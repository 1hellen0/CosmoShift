import { memo, useEffect, useRef } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import GameMap from './GameMap';
import Player from './Player';
import { MUNDO_ANCHO, MUNDO_ALTO } from '../game/constants';

/**
 * GameViewport — une el hook del motor con la vista (GameMap + Player + escaneo CRT).
 * Las props lasersOn / puertasAbiertas / interruptoresActivos / cristales /
 * desbloqueado / mensajeTutorial vienen del estado de GamePage (fuente de verdad)
 * y se propagan tal cual al mapa.
 */
const GameViewport = memo(function GameViewport({
  nivel,
  escala,
  estadoRef,
  eventosRef,
  onApi,
  lasersOn,
  puertasAbiertas,
  interruptoresActivos,
  cristales,
  desbloqueado,
  mensajeTutorial,
}) {
  const [jugador, sesionRef, api] = useGameEngine(nivel, estadoRef, eventosRef);

  const apiref = useRef(api);
  useEffect(() => {
    apiref.current = api;
    onApi?.(api);
  }, [api, onApi]);

  if (!nivel) return null;

  return (
    <div
      className="view"
      style={{
        width: MUNDO_ANCHO,
        height: MUNDO_ALTO,
        transform: `scale(${escala})`,
      }}>
      <GameMap
        nivel={nivel}
        lasersOn={lasersOn || new Set()}
        puertasAbiertas={puertasAbiertas || new Map()}
        interruptoresActivos={interruptoresActivos || new Set()}
        cristales={cristales || new Set()}
        desbloqueado={!!desbloqueado}
        mensajeTutorial={mensajeTutorial || null}
      />
      <Player ui={jugador} />
      <div className="scanlines" />
    </div>
  );
});

export default GameViewport;
