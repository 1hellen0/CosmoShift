export default function Door({ x, y, w, h, abierta }) {
  return <div className={`door ${abierta ? 'abierta' : 'cerrada'}`} style={{ left: x, top: y, width: w, height: h }} />;
}