import {
  JUGADOR_W,
  JUGADOR_H,
  GRAVEDAD,
  VELOCIDAD_MAX,
  VELOCIDAD_MAX_CAIDA,
  ACELERACION,
  FRICCION,
  SALTO,
  MUNDO_ANCHO,
  MUNDO_ALTO,
  ENERGIA_RECUPERA_ESPERA,
  ENERGIA_RECUPERA_VEL,
  PORTAL_W,
  PORTAL_H,
  MAX_CRISTALES,
} from './constants';

const TOLERANCIA = 8;
const SUBPASOS = 3;

const solapa = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function initSession(nivel) {
  const p = nivel.jugadorInicial;
  return {
    player: {
      x: p.x,
      y: p.y,
      w: JUGADOR_W,
      h: JUGADOR_H,
      vx: 0,
      vy: 0,
      dir: 1,
      onGround: false,
      facing: 1,
      invuln: 0,
      moving: false,
    },
    keys: { left: false, right: false, jumpEdge: false, spaceEdge: false },
    energy: 100,
    energyWait: 0,
    collected: new Set(),
    activeSwitches: new Set(),
    doorsOpen: new Map(),
    firedEvents: new Set(),
    hasSaltado: false,
    won: false,
    sigLasers: '',
    sigPuertas: '',
    sigEnergia: -1,
  };
}

export function respawn(s, nivel) {
  const inicio = nivel.jugadorInicial;
  const p = s.player;
  p.x = inicio.x;
  p.y = inicio.y;
  p.vx = 0;
  p.vy = 0;
  p.dir = 1;
  p.onGround = false;
  p.facing = 1;
  p.invuln = 0.8;
  p.moving = false;
  s.energy = 100;
  s.energyWait = 0;
  s.keys.left = false;
  s.keys.right = false;
}

function laserActivo(laser, ahora) {
  if (!laser.periodico) return true;
  const ciclo = ((ahora / 1000 + (laser.fase || 0)) % laser.periodo + laser.periodo) % laser.periodo;
  return ciclo < laser.periodo / 2;
}

function emitirPuertas(s, nivel, cb) {
  if (!cb) return;
  const lista = (nivel.puertas || []).map((d) => [d.id, !!s.doorsOpen.get(d.id)]);
  const sig = lista.map(([id, ok]) => `${id}:${ok ? 1 : 0}`).join('|');
  if (sig !== s.sigPuertas) {
    s.sigPuertas = sig;
    cb.onPuertas(lista);
  }
}

function emitirLasers(s, nivel, ahora, cb) {
  if (!cb) return;
  const lista = (nivel.lasers || []).map((l) => [l.id, laserActivo(l, ahora)]);
  const sig = lista.map(([id, ok]) => `${id}:${ok ? 1 : 0}`).join('|');
  if (sig !== s.sigLasers) {
    s.sigLasers = sig;
    cb.onLasers(lista);
  }
}

function morir(s, cb, causa) {
  if (s.won) return;
  s.player.invuln = 0;
  cb?.onMuerte(causa);
}

function dispararEvento(s, nivel, cb, id) {
  if (!nivel.mensajes || !cb) return;
  if (s.firedEvents.has(id)) return;
  s.firedEvents.add(id);
  cb.onEvento(id);
}

export function step(s, nivel, dt, cb) {
  const p = s.player;
  const k = s.keys;
  const ahora = performance.now();

  if (k.jumpEdge) {
    k.jumpEdge = false;
    if (p.onGround) {
      p.vy = -p.dir * SALTO;
      p.onGround = false;
      if (!s.hasSaltado) {
        s.hasSaltado = true;
        lanzarPorTrigger(s, nivel, cb, 'saltar');
      }
    }
  }

  if (k.spaceEdge) {
    k.spaceEdge = false;
    if (s.energy > 0) {
      p.dir = -p.dir;
      s.energy = 0;
      s.energyWait = ENERGIA_RECUPERA_ESPERA;
      cb?.onEnergia(0);
      cb?.onGravedad(p.dir);
    }
  }

  let ax = 0;
  if (k.left) ax -= ACELERACION;
  else if (k.right) ax += ACELERACION;

  if (k.left || k.right) {
    p.vx += ax * dt;
  } else {
    const frenado = FRICCION * dt;
    p.vx = Math.abs(p.vx) <= frenado ? 0 : p.vx - Math.sign(p.vx) * frenado;
  }
  p.vx = Math.max(-VELOCIDAD_MAX, Math.min(VELOCIDAD_MAX, p.vx));
  p.facing = p.vx > 12 ? 1 : p.vx < -12 ? -1 : p.facing;
  p.moving = Math.abs(p.vx) > 15;

  p.vy = Math.min(p.vy + GRAVEDAD * p.dir * dt, VELOCIDAD_MAX_CAIDA);

  let puertasCambiaron = false;
  for (const [id, od] of s.doorsOpen) {
    if (od.expiry && ahora >= od.expiry) {
      s.doorsOpen.delete(id);
      for (const sw of nivel.interruptores || []) {
        if (sw.puertas && sw.puertas.includes(id)) s.activeSwitches.delete(sw.id);
      }
      puertasCambiaron = true;
    }
  }
  if (puertasCambiaron) emitirPuertas(s, nivel, cb);

  const solids = [...(nivel.plataformas || [])];
  for (const d of nivel.puertas || []) {
    if (!s.doorsOpen.get(d.id)) solids.push(d);
  }

  const h = dt / SUBPASOS;
  for (let i = 0; i < SUBPASOS; i++) {
    const prevY = p.y;
    const prevX = p.x;
    p.x += p.vx * h;
    p.y += p.vy * h;

    for (const sol of solids) {
      if (!solapa(p, sol)) continue;
      if (p.vx > 0) {
        p.x = sol.x - p.w;
        p.vx = 0;
      } else if (p.vx < 0) {
        p.x = sol.x + sol.w;
        p.vx = 0;
      }
    }

    for (const sol of solids) {
      if (!solapa(p, sol)) continue;
      const piesIniciales = p.dir > 0 ? prevY + p.h : prevY;
      if (p.dir > 0 && piesIniciales <= sol.y + TOLERANCIA) {
        p.y = sol.y - p.h;
        p.vy = 0;
        p.onGround = true;
      } else if (p.dir < 0 && piesIniciales >= sol.y + sol.h - TOLERANCIA) {
        p.y = sol.y + sol.h;
        p.vy = 0;
        p.onGround = true;
      } else {
        if (p.y < sol.y) {
          p.y = sol.y - p.h;
        } else {
          p.y = sol.y + sol.h;
        }
        p.vy = 0;
      }
    }
  }

  if (p.x < 0) {
    p.x = 0;
    p.vx = 0;
  }
  if (p.x > MUNDO_ANCHO - p.w) {
    p.x = MUNDO_ANCHO - p.w;
    p.vx = 0;
  }

  if (p.invuln > 0) p.invuln -= dt;

  for (const cr of nivel.cristales || []) {
    if (s.collected.has(cr.id)) continue;
    if (solapa(p, cr)) {
      s.collected.add(cr.id);
      cb?.onCristal(cr.id);
      if (s.collected.size >= MAX_CRISTALES) {
        dispararEvento(s, nivel, cb, 'portal');
      } else {
        dispararEvento(s, nivel, cb, 'cristal');
      }
    }
  }

  for (const t of nivel.trampas || []) {
    if (p.invuln > 0) break;
    const hb = { x: t.x + 3, y: t.y + 5, w: t.w - 6, h: t.h - 8 };
    if (solapa(p, hb)) {
      morir(s, cb, 'Trampa');
      break;
    }
  }

  for (const l of nivel.lasers || []) {
    if (p.invuln > 0) break;
    if (laserActivo(l, ahora) && solapa(p, l)) {
      morir(s, cb, 'Láser');
      break;
    }
  }

  if (p.y > MUNDO_ALTO + 40 || p.y + p.h < -40) {
    if (p.invuln <= 0) morir(s, cb, 'Caída');
  }

  for (const sw of nivel.interruptores || []) {
    if (s.activeSwitches.has(sw.id)) continue;
    if (solapa(p, sw)) {
      s.activeSwitches.add(sw.id);
      cb?.onSwitch(sw.id);
      for (const id of sw.puertas || []) {
        s.doorsOpen.set(id, { open: true, expiry: sw.tiempo ? ahora + sw.tiempo * 1000 : null });
      }
      emitirPuertas(s, nivel, cb);
    }
  }

  for (const m of nivel.mensajes || []) {
    if (m.trigger === 'area' && !s.firedEvents.has(m.id)) {
      if (p.x >= m.x && p.x <= m.x + (m.w || 0)) dispararEvento(s, nivel, cb, m.id);
    }
  }

  if (!s.won && s.collected.size >= MAX_CRISTALES && solapa(p, {
    x: nivel.portal.x,
    y: nivel.portal.y,
    w: PORTAL_W,
    h: PORTAL_H,
  })) {
    s.won = true;
    cb?.onVictoria();
  }

  if (p.onGround) {
    s.energy = Math.min(100, s.energy + 500 * dt);
  } else if (s.energy < 100) {
    if (s.energyWait > 0) s.energyWait -= dt;
    else s.energy = Math.min(100, s.energy + ENERGIA_RECUPERA_VEL * dt);
  }

  emitirLasers(s, nivel, ahora, cb);
  const energiaRedondeada = Math.round(s.energy);
  if (energiaRedondeada !== s.sigEnergia) {
    s.sigEnergia = energiaRedondeada;
    cb?.onEnergia(energiaRedondeada);
  }
}

function lanzarPorTrigger(s, nivel, cb, trigger) {
  if (!nivel.mensajes || !cb) return;
  const m = nivel.mensajes.find((x) => x.trigger === trigger);
  if (m) dispararEvento(s, nivel, cb, m.id);
}