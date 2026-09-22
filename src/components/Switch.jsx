export default function Switch({ x, y, w, h, activo }) {
  return (
    <div
      className={`switch ${activo ? 'activo' : ''}`}
      style={{ left: x, top: y, width: w, height: h }}>
      <span className="switch-light" />
    </div>
  );
}