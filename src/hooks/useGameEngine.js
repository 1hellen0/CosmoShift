import { useEffect, useMemo, useRef, useState } from 'react';
import { initSession, respawn, step } from '../game/engine';

/**
 * useGameEngine
 * - nivel:           datos del nivel cargado (null mientras carga).
 * - estadoRef:       ref que controla 'jugando' | 'pausado' | 'finalizado'.
 * - eventosRef:      ref que apunta a los callbacks del juego (sesión).
 * Devuelve [jugadorUI, sesionRef, api].
 */
export function useGameEngine(nivel, estadoRef, eventosRef) {
  const sesionRef = useRef(null);
  const [jugador, setJugador] = useState({ x: 0, y: 0, dir: 1, facing: 1, moving: false });

  useEffect(() => {
    if (!nivel) return;
    sesionRef.current = initSession(nivel);
    const p = sesionRef.current.player;
    setJugador({ x: p.x, y: p.y, dir: 1, facing: 1, moving: false });
  }, [nivel]);

  useEffect(() => {
    if (!nivel) return;
    let raf;
    let ultimo = performance.now();
    const loop = (ahora) => {
      const dt = Math.min((ahora - ultimo) / 1000, 1 / 30);
      ultimo = ahora;
      const s = sesionRef.current;
      if (s && estadoRef.current === 'jugando') {
        step(s, nivel, dt, eventosRef.current);
        const p = s.player;
        setJugador((prev) => {
          const nx = Math.round(p.x);
          const ny = Math.round(p.y);
          if (
            prev.x !== nx ||
            prev.y !== ny ||
            prev.dir !== p.dir ||
            prev.facing !== p.facing ||
            prev.moving !== p.moving
          ) {
            return { x: nx, y: ny, dir: p.dir, facing: p.facing, moving: p.moving };
          }
          return prev;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [nivel, estadoRef, eventosRef]);

  useEffect(() => {
    const abajo = (e) => {
      const s = sesionRef.current;
      if (!s) return;
      const k = s.keys;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      if (e.code === 'ArrowLeft') k.left = true;
      if (e.code === 'ArrowRight') k.right = true;
      if (e.code === 'ArrowUp') k.jumpEdge = true;
      if (e.code === 'Space') k.spaceEdge = true;
    };
    const arriba = (e) => {
      const s = sesionRef.current;
      if (!s) return;
      const k = s.keys;
      if (e.code === 'ArrowLeft') k.left = false;
      if (e.code === 'ArrowRight') k.right = false;
    };
    window.addEventListener('keydown', abajo);
    window.addEventListener('keyup', arriba);
    return () => {
      window.removeEventListener('keydown', abajo);
      window.removeEventListener('keyup', arriba);
    };
  }, []);

  const api = useMemo(
    () => ({
      reiniciar: () => {
        if (sesionRef.current && nivel) respawn(sesionRef.current, nivel);
      },
    }),
    [nivel]
  );

  return [jugador, sesionRef, api];
}