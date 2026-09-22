import Sprite from './Sprite';
import { CRISTAL, PALETTE_CRISTAL } from '../assets/sprites';

export default function Crystal({ x, y, w, h }) {
  const px = w / 8;
  return (
    <div className="crystal-wrap" style={{ left: x, top: y, width: w, height: h }}>
      <Sprite pixels={CRISTAL} palette={PALETTE_CRISTAL} pixel={px} className="crystal" />
    </div>
  );
}