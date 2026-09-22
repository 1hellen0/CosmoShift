import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getNivel } from '../services/gameService';
import GameViewport from '../components/GameViewport';
import GameHUD from '../components/GameHUD';
import { MUNDO_ANCHO, MUNDO_ALTO, MAX_CRISTALES } from '../game/constants';

const MSG_SERVER =
  'No se pudo conectar con json-server. Ejecuta "npm run server" y recarga la página.';

function calcularPuntos(nivelId, cristales, vidas, tiempo) {
  const seg = Math.floor(tiempo);
  return nivelId * 500 + cristales * 250 + vidas * 150 + Math.max(0, 500 - seg * 5);
}

function useFitScale() {
  const [escala, setEscala] = useState(1);
  useEffect(() => {
    const calc = () => {
      const esc = Math.min(
        1.2,
        (window.innerWidth - 32) / MUNDO_ANCHO,
        (window.innerHeight - 270) / MUNDO_ALTO
      );
      setEscala(Math.max(0.35, esc));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return escala;
}

export default function GamePage({ modo }) {
  const navigate = useNavigate();
  const { num } = useParams();
  const esTutorial = modo === 'tutorial';
  const nivelId = esTutorial ? 0 : Number(num);

  const [nivel, setNivel] = useState(null);
  const [carga, setCarga] = useState({ estado: 'cargando' });

  const [vidas, setVidas] = useState(3);
  const [cristales, setCristales] = useState([]);
  const [energia, setEnergia] = useState(100);
  const [tiempo, setTiempo] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [mensajeTutorial, setMensajeTutorial] = useState(null);
  const [lasersOn, setLasersOn] = useState(new Set());
  const [puertasAbiertas, setPuertasAbiertas] = useState(new Map());
  const [interruptoresActivos, setInterruptoresActivos] = useState(new Set());
  const [gravInvertida, setGravInvertida] = useState(false);

  const vidasRef = useRef(3);
  const cristalesRef = useRef([]);
  const tiempoRef = useRef(0);
  const finalizadoRef = useRef(false);
  const mensajesRef = useRef([]);

  const nombre = localStorage.getItem('cosmoshift_nombre') || 'Astronauta';
  const maxUnlocked = Number(localStorage.getItem('cosmoshift_max') || 0);

  const estadoRef = useRef('jugando');
  const eventosRef = useRef(null);
  const apiMotor = useRef(null);
  const escala = useFitScale();

  eventosRef.current = {
    onCristal: (id) => {
      setCristales((prev) => {
        if (prev.includes(id)) return prev;
        const siguiente = [...prev, id];
        cristalesRef.current = siguiente;
        return siguiente;
      });
    },
    onMuerte: (causa) => {
      const nuevas = vidasRef.current - 1;
      vidasRef.current = nuevas;
      setVidas(nuevas);
      if (nuevas <= 0) {
        finalizadoRef.current = true;
        estadoRef.current = 'finalizado';
        const pts = calcularPuntos(nivelId, cristalesRef.current.length, 0, tiempoRef.current);
        navigate('/game-over', {
          state: {
            jugador: nombre,
            nivel: nivelId,
            nombreNivel: nivel?.nombre,
            tiempo: tiempoRef.current,
            cristales: cristalesRef.current.length,
            vidas: 0,
            puntos: pts,
            causa,
            esTutorial,
          },
        });
      } else {
        apiMotor.current?.reiniciar();
        setGravInvertida(false);
      }
    },
    onVictoria: () => {
      if (finalizadoRef.current) return;
      finalizadoRef.current = true;
      estadoRef.current = 'finalizado';
      const vidasFinales = Math.max(vidasRef.current, 0);
      const pts = calcularPuntos(nivelId, cristalesRef.current.length, vidasFinales, tiempoRef.current);
      let desbloqueado = maxUnlocked;
      if (esTutorial) desbloqueado = Math.max(desbloqueado, 1);
      else desbloqueado = Math.max(desbloqueado, nivelId);
      localStorage.setItem('cosmoshift_max', String(desbloqueado));
      navigate('/victoria', {
        state: {
          jugador: nombre,
          nivel: nivelId,
          nombreNivel: nivel?.nombre,
          tiempo: tiempoRef.current,
          cristales: cristalesRef.current.length,
          vidas: vidasFinales,
          puntos: pts,
          esTutorial,
        },
      });
    },
    onSwitch: (id) => {
      setInterruptoresActivos((prev) => new Set(prev).add(id));
    },
    onEvento: (id) => {
      const m = mensajesRef.current.find((x) => x.id === id);
      if (m) setMensajeTutorial(m.texto);
    },
    onEnergia: (v) => setEnergia(v),
    onLasers: (lista) => {
      setLasersOn(new Set(lista.filter(([, on]) => on).map(([id]) => id)));
    },
    onPuertas: (lista) => {
      setPuertasAbiertas(new Map(lista.map(([id, ab]) => [id, ab])));
    },
    onGravedad: (dir) => setGravInvertida(dir < 0),
  };

  const cristalesColeccion = useMemo(() => new Set(cristales), [cristales]);

  // temporizador
  useEffect(() => {
    if (carga.estado !== 'ok' || !nivel || finalizadoRef.current || pausado) return;
    const id = setInterval(() => {
      setTiempo((t) => {
        const nt = t + 1;
        tiempoRef.current = nt;
        return nt;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [carga.estado, nivel, pausado]);

  // puntos en vivo
  useEffect(() => {
    if (!nivel) return;
    setPuntos(calcularPuntos(nivelId, cristales.length, vidas, tiempo));
  }, [nivel, nivelId, cristales, vidas, tiempo]);

  // pausa con P
  useEffect(() => {
    const h = (e) => {
      if (e.code === 'KeyP') {
        setPausado((prev) => {
          const np = !prev;
          estadoRef.current = np ? 'pausado' : 'jugando';
          return np;
        });
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // carga del nivel
  useEffect(() => {
    let activo = true;
    setCarga({ estado: 'cargando' });
    getNivel(nivelId)
      .then((n) => {
        if (!activo) return;
        if (esTutorial && n.id !== 0) {
          navigate('/', { replace: true });
          return;
        }
        if (!esTutorial && (nivelId < 1 || nivelId > 3 || nivelId > maxUnlocked)) {
          navigate('/', { replace: true });
          return;
        }
        vidasRef.current = 3;
        cristalesRef.current = [];
        tiempoRef.current = 0;
        finalizadoRef.current = false;
        mensajesRef.current = n.mensajes || [];
        estadoRef.current = 'jugando';
        setNivel(n);
        setVidas(3);
        setCristales([]);
        setEnergia(100);
        setTiempo(0);
        setPuntos(0);
        setPausado(false);
        setMensajeTutorial((n.mensajes && n.mensajes[0]) ? n.mensajes[0].texto : null);
        setLasersOn(new Set());
        setPuertasAbiertas(new Map());
        setInterruptoresActivos(new Set());
        setGravInvertida(false);
        setCarga({ estado: 'ok' });
      })
      .catch(() => {
        if (activo) setCarga({ estado: 'error', mensaje: MSG_SERVER });
      });
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nivelId, esTutorial, maxUnlocked, navigate]);

  if (carga.estado === 'cargando') {
    return (
      <div className="screen">
        <div className="loading">
          CARGANDO NIVEL...<span className="blink">▮</span>
        </div>
      </div>
    );
  }

  if (carga.estado === 'error') {
    return (
      <div className="screen">
        <div className="panel error-box">
          <h2 className="panel-title">ERROR DE CONEXIÓN</h2>
          <p className="muted">{carga.mensaje || MSG_SERVER}</p>
          <p className="muted">
            Pasos: 1) ejecuta <strong>npm run server</strong> en otra terminal. 2) recarga la
            página.
          </p>
          <div className="btn-row">
            <button className="btn-arcade cyan" onClick={() => navigate(0)}>
              REINTENTAR
            </button>
            <Link to="/" className="btn-arcade magenta">
              MENÚ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cristalesTotales = nivel.cristales?.length || MAX_CRISTALES;

  return (
    <div className="game-page">
      <GameHUD
        vidas={vidas}
        cristales={cristales.length}
        total={cristalesTotales}
        energia={energia}
        tiempo={tiempo}
        puntos={puntos}
        nombre={nombre}
        nivelNombre={nivel.nombre}
        gravedadInvertida={gravInvertida}
        pausado={pausado}
      />

      <div className="stage">
        <GameViewport
          nivel={nivel}
          escala={escala}
          estadoRef={estadoRef}
          eventosRef={eventosRef}
          cristales={cristalesColeccion}
          lasersOn={lasersOn}
          puertasAbiertas={puertasAbiertas}
          interruptoresActivos={interruptoresActivos}
          desbloqueado={cristales.length >= cristalesTotales}
          mensajeTutorial={esTutorial ? mensajeTutorial : null}
          onApi={(api) => {
            apiMotor.current = api;
          }}
        />

        {pausado && (
          <div className="pause-overlay">
            <div className="pause-box">
              <h2>PAUSA</h2>
              <p className="muted">
                Pulsa <strong>P</strong> para continuar
              </p>
              <div className="btn-row">
                <Link to="/" className="btn-arcade magenta">
                  MENÚ
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="stage-bar">
        <Link to="/" className="btn-arcade ghost small">
          ← MENÚ
        </Link>
        <span className="muted small">← → mover · ↑ saltar · ESPACIO gravedad · P pausa</span>
      </div>
    </div>
  );
}