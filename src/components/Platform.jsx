export default function Platform({ x, y, w, h }) {
  return <div className="platform" style={{ left: x, top: y, width: w, height: h }} />;
}