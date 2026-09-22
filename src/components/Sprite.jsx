const CARACTERES_VACIO = new Set(['.', ' ']);

export default function Sprite({ pixels, palette, pixel = 2, className = '' }) {
  const cols = pixels[0]?.length || 0;
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${pixel}px)`,
        width: cols * pixel,
        height: pixels.length * pixel,
        imageRendering: 'pixelated',
      }}>
      {pixels.flatMap((fila, r) =>
        [...fila].map((ch, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: pixel,
              height: pixel,
              background: CARACTERES_VACIO.has(ch) ? 'transparent' : palette[ch],
            }}
          />
        ))
      )}
    </div>
  );
}