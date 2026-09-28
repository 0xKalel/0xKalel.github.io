/** The potion trail: one red potion hidden on each of these pages (components/pop/Potion.astro).
 *  Drinking one fills a life triangle in the HUD; all of them open the exit door in Contact.
 *  The game logic is potions() in scripts/site.ts, and Base.astro re-applies the saved state
 *  before paint. Saved in localStorage: `potions` (drunk ids), `potions:exit`, `potions:intro`
 *  (the first-visit announcement was shown), `potions:start` and `potions:time` (when the first
 *  potion was drunk, and how long all of them took), `sound`. */
import { postHref } from './blog';

export const POTIONS = ['home', 'storagepal', 'sps', 'ravenclip', 'how-i-work', 'blog', 'devtools', 'raven-post'] as const;
export type PotionId = (typeof POTIONS)[number];
/** Game sound (scripts/sound.ts) until the visitor picks: off, so the site never makes noise uninvited. */
export const SOUND_ON_BY_DEFAULT = false;

/** The page each potion is on, so links there can carry a mark while it is still full. */
const POTION_PAGES: Record<PotionId, string> = {
  home: '/',
  storagepal: '/work/storagepal/',
  sps: '/work/sps/',
  ravenclip: '/work/ravenclip/',
  'how-i-work': '/how-i-work/',
  blog: '/blog/',
  devtools: postHref('2025-11-02-chrome-devtools-mcp-wsl-claude-code'),
  'raven-post': postHref('2026-09-25-ravenclip-engineering'),
};

/** The potions on pages under a path, as a `data-potion-link` value; undefined when there are none. */
export function potionsUnder(path: string) {
  const ids = POTIONS.filter((id) => POTION_PAGES[id].startsWith(path));
  return ids.length ? ids.join(' ') : undefined;
}
