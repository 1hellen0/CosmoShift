import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { postPuntaje } from '../services/gameService';

function fmtTiempo(seg) {
  const s = Math.max(0, Math.floor(seg));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function VictoryPage() {
  const { state } = useLocation();
  const posteado = useRef(false);
  const [resumen, setResumen] = useState(
    state || {
      jugador: 'Astronauta',
      nivel: 0,
      nombreNivel: 'Desconocido',
      tiempo: 0,
      cristales: 0,
      vidas: 0,
      puntos: 0,
      esTutorial: true,
    }
  );

  useEffect(() => {
    if (posteado.current) return;
    posteado.current = true;
    if (state && state.puntos > 0) {
      postPuntaje({
        nombre: state.jugador,
        puntos: state.puntos,
        nivel: state.nivel,
        cristales: state.cristales,
        tiempo: Math.floor(state.tiempo),
      }).catch(() => {});
    }
    if (state) setResumen(state);
  }, [state]);

  const siguiente = resumen.esTutorial ? 1 : resumen.nivel + 1;
  const sigueDisponible = siguiente <= 3;

  return (
    <div className="screen">
      <div className="panel victory-box">
        <h1 className="title-vic">⭐ ¡NIVEL SUPERADO! ⭐</h1>
        <p className="muted">Estación estabilizada, {resumen.jugador}. La misión continúa…</p>

        <div className="result-grid">
          <div className="result-item">
            <span className="res-label">NIVEL</span>
            <span className="res-value">{resumen.nombreNivel || `Nivel ${resumen.nivel}`}</span>
          </div>
          <div className="result-item">
            <span className="res-label">CRISTALES</span>
            <span className="res-value">{resumen.cristales}/3</span>
          </div>
          <div className="result-item">
            <span className="res-label">VIDAS</span>
            <span className="res-value">{resumen.vidas}</span>
          </div>
          <div className="result-item">
            <span className="res-label">TIEMPO</span>
            <span className="res-value">{fmtTiempo(resumen.tiempo)}</span>
          </div>
          <div className="result-item puntos">
            <span className="res-label">PUNTOS</span>
            <span className="res-value total">{resumen.puntos}</span>
          </div>
        </div>

        <div className="btn-row">
          {sigueDisponible ? (
            <Link to={`/nivel/${siguiente}`} className="btn-arcade cyan">
              SIGUIENTE NIVEL →
            </Link>
          ) : (
            <Link to="/puntajes" className="btn-arcade yellow">
              VER PUNTAJES
            </Link>
          )}
          <Link to="/" className="btn-arcade ghost">
            MENÚ
          </Link>
        </div>
      </div>
    </div>
  );
}