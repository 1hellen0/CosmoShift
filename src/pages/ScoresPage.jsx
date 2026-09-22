import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPuntajes } from '../services/gameService';

function fmtTiempo(seg) {
  const s = Math.max(0, Math.floor(seg));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function ScoresPage() {
  const [puntajes, setPuntajes] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let activo = true;
    getPuntajes()
      .then((data) => {
        if (!activo) return;
        const ordenados = [...data].sort((a, b) => b.puntos - a.puntos).slice(0, 10);
        setPuntajes(ordenados);
      })
      .catch(() => {
        if (activo) setError(true);
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="screen">
      <div className="panel scores-box">
        <h1 className="panel-title">🏆 MEJORES PUNTAJES</h1>

        {error ? (
          <p className="muted">
            No se pudo conectar con json-server. Ejecuta <code>npm run server</code> y recarga.
          </p>
        ) : puntajes === null ? (
          <p className="muted">
            Cargando tabla…<span className="blink">▮</span>
          </p>
        ) : puntajes.length === 0 ? (
          <p className="muted">Aún no hay puntajes. ¡Sé el primero en firmar la tabla!</p>
        ) : (
          <table className="scores-table">
            <thead>
              <tr>
                <th>#</th>
                <th>PILOTO</th>
                <th>PUNTOS</th>
                <th>NIVEL</th>
                <th>CRISTALES</th>
                <th>TIEMPO</th>
              </tr>
            </thead>
            <tbody>
              {puntajes.map((p, i) => (
                <tr key={p.id}>
                  <td className="rank">{i + 1}</td>
                  <td>{p.nombre}</td>
                  <td className="pts">{p.puntos}</td>
                  <td>{p.nivel}</td>
                  <td>{p.cristales}/3</td>
                  <td>{fmtTiempo(p.tiempo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="btn-row">
          <Link to="/" className="btn-arcade magenta">
            ← MENÚ
          </Link>
          <Link to="/tutorial" className="btn-arcade cyan">
            ▶ JUGAR
          </Link>
        </div>
      </div>
    </div>
  );
}