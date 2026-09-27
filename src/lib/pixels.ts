export interface Pixel {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

/** Turns ASCII pixel art into SVG rects, one per horizontal run of the same character.
 *  Each character maps to a CSS color (tokens work); '.' and unmapped characters stay empty. */
export function pixels(art: string, colors: Record<string, string>, ox = 0, oy = 0): Pixel[] {
  const rows = art.split('\n').map((line) => line.trim()).filter(Boolean);
  const out: Pixel[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const fill = colors[row[x]];
      let w = 1;
      while (row[x + w] === row[x]) w++;
      if (fill) out.push({ x: x + ox, y: y + oy, w, h: 1, fill });
      x += w;
    }
  });
  return out;
}
