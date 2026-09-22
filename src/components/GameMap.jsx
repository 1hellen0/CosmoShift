import { memo } from 'react';
import Platform from './Platform';
import Crystal from './Crystal';
import Trap from './Trap';
import Laser from './Laser';
import Door from './Door';
import Switch from './Switch';
import ExitPortal from './ExitPortal';
import TutorialMessage from './TutorialMessage';

/**
 * GameMap — capa presentacional del mundo.
 * Dibuja todos los elementos del nivel usando sus componentes pixel-art.
 * No contiene lógica de juego; solo mapea las listas del nivel y el estado
 * de la sesión (lasers/puertas/interruptores encendidos, cristales recogidos).
 */
const GameMap = memo(function GameMap({
  nivel,
  lasersOn,
  puertasAbiertas,
  interruptoresActivos,
  cristales,
  desbloqueado,
  mensajeTutorial,
}) {
  if (!nivel) return null;

  return (
    <div className="map">
      <div className="stars" />
      <div className="stars-2" />

      {(nivel.plataformas || []).map((p) => (
        <Platform key={p.id} x={p.x} y={p.y} w={p.w} h={p.h} />
      ))}

      {(nivel.cristales || []).map((c) => (
        <Crystal
          key={c.id}
          x={c.x}
          y={c.y}
          w={c.w}
          h={c.h}
          recolectado={cristales.has(c.id)}
        />
      ))}

      {(nivel.trampas || []).map((t) => (
        <Trap key={t.id} x={t.x} y={t.y} w={t.w} h={t.h} />
      ))}

      {(nivel.lasers || []).map((l) => (
        <Laser
          key={l.id}
          x={l.x}
          y={l.y}
          w={l.w}
          h={l.h}
          activo={lasersOn.has(l.id)}
        />
      ))}

      {(nivel.puertas || []).map((d) => (
        <Door
          key={d.id}
          x={d.x}
          y={d.y}
          w={d.w}
          h={d.h}
          abierta={puertasAbiertas.has(d.id)}
        />
      ))}

      {(nivel.interruptores || []).map((sw) => (
        <Switch
          key={sw.id}
          x={sw.x}
          y={sw.y}
          w={sw.w}
          h={sw.h}
          activo={interruptoresActivos.has(sw.id)}
        />
      ))}

      {nivel.portal && (
        <ExitPortal
          x={nivel.portal.x}
          y={nivel.portal.y}
          w={nivel.portal.w}
          h={nivel.portal.h}
          desbloqueado={desbloqueado}
        />
      )}

      {mensajeTutorial && <TutorialMessage texto={mensajeTutorial} />}
    </div>
  );
});

export default GameMap;
