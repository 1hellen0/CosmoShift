export default function Laser({ x, y, w, h, activo }) {
  const vertical = h > w;
  const clase = `laser ${vertical ? 'l-vertical' : 'l-horizontal'} ${activo ? 'on' : 'off'}`;
  return (
    <div className={clase} style={{ left: x, top: y, width: w, height: h }}>
      <span className="laser-core" />
    </div>
  );
}