export default function GameHUD({
  vidas,
  cristales,
  total,
  energia,
  tiempo,
  puntos,
  nombre,
  nivelNombre,
  gravedadInvertida,
  pausado,
}) {
  const seg = Math.floor(tiempo);
  const mm = String(Math.floor(seg / 60)).padStart(2, '0');
  const ss = String(seg % 60).padStart(2, '0');
  let barColor = '#38f7a0';
  if (energia < 50) barColor = '#ffcf46';
  if (energia < 20) barColor = '#ff5b5b';

  return (
    <div className="hud">
      <div className="hud-item">
        <span className="hud-label">VIDAS</span>
        <span className="hearts">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`heart ${i < vidas ? '' : 'off'}`}>
              ❤
            </span>
          ))}
        </span>
      </div>

      <div className="hud-item">
        <span className="hud-label">CRISTALES</span>
        <span className="crystal-count">
          <span className="gem">◆</span> {cristales}/{total}
        </span>
      </div>

      <div className="hud-item hud-energia">
        <span className="hud-label">ENERGÍA GRAVITACIONAL</span>
        <div className="energy-bar">
          <div className="energy-fill" style={{ width: `${energia}%`, background: barColor }} />
        </div>
      </div>

      <div className="hud-item">
        <span className="hud-label">PUNTOS</span>
        <span className="hud-value">{puntos}</span>
      </div>

      <div className="hud-item">
        <span className="hud-label">TIEMPO</span>
        <span className="hud-value">
          {mm}:{ss}
        </span>
      </div>

      <div className="hud-item">
        <span className="hud-label">GRAVEDAD</span>
        <span className={`gravity-flag ${gravedadInvertida ? 'invertida' : ''}`}>
          {gravedadInvertida ? '▲ INVERTIDA' : '▼ NORMAL'}
        </span>
      </div>

      <div className="hud-item hud-extra">
        <span className="hud-label">{nivelNombre}</span>
        <span className="hud-name">{nombre || 'Astronauta'}</span>
        {pausado && <span className="hud-pausa">⏸</span>}
      </div>
    </div>
  );
}