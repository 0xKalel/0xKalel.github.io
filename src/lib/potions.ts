/** The potion trail: one red potion hidden on each of these pages (components/pop/Potion.astro).
 *  Drinking one fills a life triangle in the HUD; all of them open the exit door in Contact.
 *  The game logic is potions() in scripts/site.ts, and Base.astro re-applies the saved state
 *  before paint. Saved in localStorage: `potions` (drunk ids), `potions:exit`, `potions:intro`
 *  (the first-visit announcement was shown), `sound`. */
export const POTIONS = ['home', 'storagepal', 'sps', 'ravenclip', 'how-i-work', 'blog', 'devtools', 'raven-post'] as const;
export type PotionId = (typeof POTIONS)[number];
/** Game sound (scripts/sound.ts) until the visitor picks: off, so the site never makes noise uninvited. */
export const SOUND_ON_BY_DEFAULT = false;
