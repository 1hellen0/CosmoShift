import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [nombre, setNombre] = useState(() => localStorage.getItem('cosmoshift_nombre') || '');
  const maxUnlocked = Number(localStorage.getItem('cosmoshift_max') || 0);

  const guardar = () => {
    localStorage.setItem('cosmoshift_nombre', nombre.trim());
  };

  const niveles = [
    { id: 1, nombre: 'Primer Contacto', desc: 'Aprende a saltar y recoger cristales.' },
    { id: 2, nombre: 'Zona Inestable', desc: 'Láseres y puertas con temporizador.' },
    { id: 3, nombre: 'El Desafío', desc: 'Interruptores, trampas y la gravedad al límite.' },
  ];

  return (
    <div className="screen home">
      <div className="panel hero">
        <h1 className="title-main">COSMOSHIFT</h1>
        <h2 className="title-sub">MISIÓN GRAVEDAD</h2>
        <p className="muted">
          Invierte la gravedad, esquiva láseres y recupera los cristales de energía. ¿Cuánto
          aguantan tus 3 vidas?
        </p>

        <div className="name-row">
          <input
            className="name-input"
            placeholder="Tu nombre de piloto"
            maxLength={18}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button className="btn-arcade cyan" onClick={guardar}>
            GUARDAR
          </button>
        </div>
        {nombre.trim() && (
          <p className="muted small">
            ¡Enrumbando hacia la gloria, <strong>{nombre.trim()}</strong>!
          </p>
        )}

        <div className="btn-row">
          <Link to="/tutorial" className="btn-arcade yellow" onClick={guardar}>
            ▶ JUGAR (TUTORIAL)
          </Link>
        </div>
      </div>

      <div className="levels-grid">
        {niveles.map((n) => {
          const bloqueado = n.id > maxUnlocked;
          return (
            <div key={n.id} className={`level-card ${bloqueado ? 'locked' : ''}`}>
              <span className="level-num">NIVEL {n.id}</span>
              <h3>{n.nombre}</h3>
              <p className="muted small">{n.desc}</p>
              {bloqueado ? (
                <span className="lock-label">🔒 DESBLOQUEA EL NIVEL {n.id - 1}</span>
              ) : (
                <Link to={`/nivel/${n.id}`} className="btn-arcade ghost small">
                  JUGAR
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="help-panel">
        <h3 className="panel-title">CONTROLES</h3>
        <div className="keys">
          <span className="key">←</span>
          <span className="key">→</span>
          <span className="label">MOVER</span>
          <span className="key">↑</span>
          <span className="label">SALTAR</span>
          <span className="key">ESPACIO</span>
          <span className="label">INVERTIR GRAVEDAD</span>
          <span className="key">P</span>
          <span className="label">PAUSA</span>
        </div>
        <p className="muted small">
          💡 Recuerda: esta misión necesita a <strong>json-server</strong> activo (
          <code>npm run server</code>).
        </p>
      </div>
    </div>
  );
}