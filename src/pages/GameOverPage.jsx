import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { postPuntaje } from '../services/gameService';

function fmtTiempo(seg) {
  const s = Math.max(0, Math.floor(seg));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function GameOverPage() {
  const { state } = useLocation();
  const posteado = useRef(false);
  const [resumen, setResumen] = useState(
    state || {
      jugador: 'Astronauta',
      nivel: 1,
      nombreNivel: 'Desconocido',
      tiempo: 0,
      cristales: 0,
      vidas: 0,
      puntos: 0,
      causa: 'desconocida',
      esTutorial: false,
    }
  );

  useEffect(() => {
    if (posteado.current) return;
    posteado.current = true;
    const r = state;
    if (r && r.puntos > 0) {
      postPuntaje({
        nombre: r.jugador,
        puntos: r.puntos,
        nivel: r.nivel,
        cristales: r.cristales,
        tiempo: Math.floor(r.tiempo),
      }).catch(() => {});
    }
    if (r) setResumen(r);
  }, [state]);

  return (
    <div className="screen">
      <div className="panel gameover-box">
        <h1 className="title-go">FIN DE LA MISIÓN</h1>
        <p className="muted">{resumen.jugador}, la estación no te suelta todavía…</p>

        <div className="result-grid">
          <div className="result-item">
            <span className="res-label">NIVEL</span>
            <span className="res-value">{resumen.nombreNivel || `Nivel ${resumen.nivel}`}</span>
          </div>
          <div className="result-item">
            <span className="res-label">CAUSA</span>
            <span className="res-value causa">{resumen.causa}</span>
          </div>
          <div className="result-item">
            <span className="res-label">CRISTALES</span>
            <span className="res-value">{resumen.cristales}/3</span>
          </div>
          <div className="result-item">
            <span className="res-label">TIEMPO</span>
            <span className="res-value">{fmtTiempo(resumen.tiempo)}</span>
          </div>
          <div className="result-item">
            <span className="res-label">VIDAS</span>
            <span className="res-value">0</span>
          </div>
          <div className="result-item puntos">
            <span className="res-label">PUNTOS</span>
            <span className="res-value total">{resumen.puntos}</span>
          </div>
        </div>

        <div className="btn-row">
          <Link to="/tutorial" className="btn-arcade yellow">
            ⟳ REINTENTAR
          </Link>
          <Link to="/" className="btn-arcade magenta">
            MENÚ
          </Link>
        </div>
      </div>
    </div>
  );
}