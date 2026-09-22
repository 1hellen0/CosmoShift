import { useEffect, useState } from 'react';
import Sprite from './Sprite';
import { ASTRONAUTA_F1, ASTRONAUTA_F2, PALETTE_ASTRONAUTA } from '../assets/sprites';

export default function Player({ ui }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!ui.moving) return;
    const id = setInterval(() => setFrame((f) => (f ^ 1)), 140);
    return () => clearInterval(id);
  }, [ui.moving]);

  const pixeles = ui.moving ? (frame ? ASTRONAUTA_F2 : ASTRONAUTA_F1) : ASTRONAUTA_F1;

  return (
    <div className="player" style={{ left: ui.x, top: ui.y }}>
      <div
        className="player-sprite"
        style={{
          transform: `scaleX(${ui.facing}) rotate(${ui.dir > 0 ? '0deg' : '180deg'})`,
        }}>
        <Sprite pixels={pixeles} palette={PALETTE_ASTRONAUTA} pixel={2} />
      </div>
    </div>
  );
}
