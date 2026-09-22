export default function Trap({ x, y, w, h }) {
  return <div className="trap" style={{ left: x, top: y, width: w, height: h }} />;
}