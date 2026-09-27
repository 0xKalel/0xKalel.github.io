/** A pointed Persian arch in pixel steps, as a CSS clip-path polygon. Each side is an arc of
 *  radius `r` (in widths of the box) that meets the other at the center; `aspect` is the box's
 *  width / height, so the arch keeps its shape whatever the box's proportions. */
export function archPolygon(aspect: number, r = 0.62, steps = 7) {
  const tMax = Math.acos(1 - 0.5 / r);
  const rise = r * Math.sin(tMax);
  const pct = (n: number) => +n.toFixed(2);
  const left = ['0% 100%', `0% ${pct(rise * aspect * 100)}%`];
  let x = 0;
  for (let k = 1; k <= steps; k++) {
    const t = (k / steps) * tMax;
    const nx = pct((r - r * Math.cos(t)) * 100);
    const ny = pct((rise - r * Math.sin(t)) * aspect * 100);
    left.push(`${x}% ${ny}%`, `${nx}% ${ny}%`);
    x = nx;
  }
  const right = left.slice(1).reverse().map((point) => {
    const [px, py] = point.split(' ');
    return `${pct(100 - parseFloat(px))}% ${py}`;
  });
  return `polygon(${[...left, ...right, '100% 100%'].join(', ')})`;
}
