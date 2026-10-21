/** The site's three designs, chosen per visitor: `?design=` on any URL (so a link can be sent with
 *  one already picked), then the visitor's saved choice, then DEFAULT_DESIGN. Base.astro applies it
 *  before paint as `data-design` on <html>; the select in the header and the palette change it
 *  (setDesign in scripts/site.ts). Each design has a dark and a light mode (`data-theme`).
 *  Styles: styles/global.css is Gaming; styles/designs/ re-dress the same markup for the others. */
export const DESIGNS = [
  { id: 'classic', label: 'Classic' },
  { id: 'spec', label: 'Spec sheet' },
  { id: 'gaming', label: 'Gaming' },
] as const;
export type DesignId = (typeof DESIGNS)[number]['id'];
export const DESIGN_IDS: readonly DesignId[] = DESIGNS.map((d) => d.id);
export const DEFAULT_DESIGN: DesignId = 'classic';
export const isDesign = (value: unknown): value is DesignId => DESIGN_IDS.includes(value as DesignId);

/** Browser chrome colors: each design's --bg per mode, as hex because <meta name="theme-color"> is
 *  read outside CSS. Keep in step with the --bg values in styles/. */
export const THEME_COLOR: Record<DesignId, { dark: string; light: string }> = {
  classic: { dark: '#0d141f', light: '#fcfaf6' },
  spec: { dark: '#0c0d0f', light: '#f6f5f2' },
  gaming: { dark: '#090f1c', light: '#f6efe3' },
};
