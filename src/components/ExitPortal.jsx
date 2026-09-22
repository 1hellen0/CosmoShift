import { PORTAL_W, PORTAL_H } from '../game/constants';

export default function ExitPortal({ x, y, desbloqueado }) {
  return (
    <div
      className={`portal ${desbloqueado ? 'abierto' : 'bloqueado'}`}
      style={{ left: x, top: y, width: PORTAL_W, height: PORTAL_H }}>
      <div className="portal-ring" />
      <div className="portal-core" />
      <span className="portal-label">{desbloqueado ? 'SALIDA' : 'BLOQUEADO'}</span>
    </div>
  );
}