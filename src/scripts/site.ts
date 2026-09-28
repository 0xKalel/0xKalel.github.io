import { POTIONS } from '../lib/potions';
import { THEME_COLOR } from '../lib/theme';
import { play, setSound, soundOn } from './sound';

// Bind once per Astro page visit, and release listeners and animation frames on exit.
const cleanups: Array<() => void> = [];
const motions = new Set<Animation>();
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = <T extends Element = HTMLElement>(selector: string) => [...document.querySelectorAll<T>(selector)];

function listen(target: EventTarget, event: string, fn: EventListener, options?: AddEventListenerOptions) {
  target.addEventListener(event, fn, options);
  cleanups.push(() => target.removeEventListener(event, fn, options));
}
function animate(element: Element, frames: Keyframe[], duration = 380, delay = 0, easing = 'cubic-bezier(.22,1,.36,1)') {
  if (reduced()) return;
  const motion = element.animate(frames, { duration, delay, easing, fill: 'backwards' });
  motions.add(motion);
  motion.onfinish = motion.oncancel = () => motions.delete(motion);
  return motion;
}
function track(name: string, params?: Record<string, string | number>) {
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}
function cleanup() {
  cleanups.splice(0).forEach((fn) => fn());
  motions.forEach((motion) => motion.cancel());
  motions.clear();
}

function reveals() {
  const elements = $$('.fx');
  if (reduced()) { elements.forEach((el) => el.classList.add('in')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top >= innerHeight) return;
      const el = entry.target as HTMLElement;
      el.classList.add('in');
      observer.unobserve(el);
      // Only section headings rise in; everything else is simply there (charts still draw in via .in).
      if (entry.isIntersecting && el.matches('.sec-head')) {
        const delay = Math.min(parseFloat(el.style.getPropertyValue('--d')) || 0, 140);
        animate(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], 480, delay);
      }
    });
  }, { threshold: 0.05 });
  elements.forEach((el) => observer.observe(el));
  cleanups.push(() => observer.disconnect());
}

// "Show more" lists: extras stay visible without JavaScript; with it they start collapsed.
function moreToggles() {
  $$('[data-more]').forEach((root) => {
    const button = root.querySelector<HTMLButtonElement>('[data-more-toggle]');
    const label = root.querySelector<HTMLElement>('[data-more-label]');
    if (!button || !label) return;
    const closedLabel = label.textContent;
    listen(button, 'click', () => {
      const open = !root.classList.contains('is-open');
      root.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      label.textContent = open ? label.dataset.openLabel ?? closedLabel : closedLabel;
      if (open) {
        root.querySelectorAll<HTMLElement>('[data-more-extra]').forEach((el, i) => {
          animate(el, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], 360, Math.min(i * 45, 240));
        });
      } else if (button.getBoundingClientRect().top < 0) {
        button.scrollIntoView({ block: 'center', behavior: reduced() ? 'instant' : 'smooth' });
      }
    });
  });
}

function spotlight() {
  if (!fine() || reduced()) return;
  $$('[data-spotlight]').forEach((el) => {
    let frame = 0;
    let x = 0;
    let y = 0;
    listen(el, 'pointermove', ((event: PointerEvent) => {
      x = event.clientX; y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${x - bounds.left}px`);
        el.style.setProperty('--my', `${y - bounds.top}px`);
        frame = 0;
      });
    }) as EventListener);
    cleanups.push(() => cancelAnimationFrame(frame));
  });
}

// The HUD line: "Level N · Section" on the homepage, reading time left on long text, else the page name.
const escape = (text: string) => text.replace(/[&<>]/g, (c) => `&#${c.charCodeAt(0)};`);
function hudLine(sections: HTMLElement[], current: HTMLElement | undefined, prose: { el: HTMLElement; words: number } | null, title: string) {
  title = escape(title);
  if (location.pathname === '/') {
    if (!current) return title;
    if (current.dataset.hud) return current.dataset.hud;
    const numbered = sections.filter((section) => section.querySelector('.sec-num'));
    const heading = current.querySelector('.sec-head h2')?.textContent?.trim();
    return heading ? `<b>Level ${numbered.indexOf(current) + 1}</b> · ${escape(heading)}` : title;
  }
  if (prose) {
    const box = prose.el.getBoundingClientRect();
    const left = Math.min(1, Math.max(0, (box.bottom - innerHeight) / box.height));
    const minutes = Math.ceil((prose.words * left) / 220);
    return minutes > 0 ? `<b>${minutes}</b> min left` : '<b>Level complete</b>';
  }
  return title;
}

// A short message that takes over the HUD line for a moment, and carries across page changes.
let hudFlash: { html: string; until: number } | null = null;
let refreshHud = () => {};
let flashTimer: ReturnType<typeof setTimeout>;
function flash(html: string, ms = 3200) {
  hudFlash = { html, until: performance.now() + ms };
  refreshHud();
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => refreshHud(), ms + 20);
}

function scrollPosition() {
  const hudText = document.querySelector<HTMLElement>('[data-hud-text]');
  const title = hudText?.dataset.hudTitle ?? '';
  const sections = $$<HTMLElement>('main section[id]');
  const links = $$<HTMLAnchorElement>('[data-section-link]');
  const proseEl = document.querySelector<HTMLElement>('main .prose');
  const words = proseEl?.textContent?.trim().split(/\s+/).length ?? 0;
  const prose = proseEl && words > 300 ? { el: proseEl, words } : null;
  let line = '';
  let frame = 0;
  const update = () => {
    const current = location.pathname === '/' ? [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 150) : undefined;
    if (location.pathname === '/') {
      links.forEach((link) => {
        if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    const flashing = !!hudFlash && performance.now() < hudFlash.until;
    const next = flashing ? hudFlash!.html : hudLine(sections, current, prose, title);
    if (hudText && next !== line) {
      hudText.innerHTML = line = next;
      hudText.classList.toggle('is-flash', flashing);
    }
    frame = 0;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  listen(window, 'scroll', schedule, { passive: true });
  listen(window, 'resize', schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  refreshHud = schedule;
  cleanups.push(() => { cancelAnimationFrame(frame); observer.disconnect(); refreshHud = () => {}; });
  update();
}

// The potion trail (lib/potions.ts): one potion per page. Drinking fills a HUD life triangle; all of
// them open the exit door in Contact. Progress lives in localStorage, and in memory when that is blocked.
const total = POTIONS.length;
let drunk = new Set<string>();
let exitOpen = false;
// When the first potion was drunk, and how long all of them took (ms), for the reward line.
let startedAt = 0;
let finishedIn = 0;
function loadPotions() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem('potions') ?? '[]');
    drunk = new Set(Array.isArray(saved) ? POTIONS.filter((id) => saved.includes(id)) : []);
    exitOpen = localStorage.getItem('potions:exit') === 'open';
    startedAt = Number(localStorage.getItem('potions:start')) || 0;
    finishedIn = Number(localStorage.getItem('potions:time')) || 0;
  } catch {}
}
function savePotions() {
  try {
    localStorage.setItem('potions', JSON.stringify([...drunk]));
    const extras: Record<string, string> = {
      'potions:exit': exitOpen ? 'open' : '',
      'potions:start': startedAt ? String(startedAt) : '',
      'potions:time': finishedIn ? String(finishedIn) : '',
    };
    Object.entries(extras).forEach(([key, value]) => (value ? localStorage.setItem(key, value) : localStorage.removeItem(key)));
  } catch {}
}
// Mirrors the head script in Base.astro, which applies the same state before paint. Links to pages
// that still hold a full potion (data-potion-link, see lib/potions.ts) show a small potion mark.
function applyPotions() {
  const html = document.documentElement;
  html.style.setProperty('--potions', String(drunk.size));
  if (drunk.size >= total) html.dataset.potions = 'full';
  else delete html.dataset.potions;
  if (exitOpen) html.dataset.exit = 'open';
  else delete html.dataset.exit;
  $$('[data-potion-link]').forEach((link) => {
    link.toggleAttribute('data-potion-left', link.dataset.potionLink!.split(' ').some((id) => !drunk.has(id)));
  });
}
function duration(ms: number) {
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return 'under a minute';
  if (minutes < 90) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  const hours = Math.round(minutes / 60);
  return hours < 36 ? `${hours} hours` : `${Math.round(hours / 24)} days`;
}
// The reward in Contact: how long the hunt took, and an email with that in the subject.
function rewardLine() {
  const time = finishedIn ? ` in ${duration(finishedIn)}` : '';
  $$('[data-potion-time]').forEach((el) => { el.textContent = time; });
  $$<HTMLAnchorElement>('[data-potion-mail]').forEach((link) => {
    link.href = `${link.href.split('?')[0]}?subject=${encodeURIComponent(`I found all ${total} potions${time}`)}`;
  });
}
// True once per visitor: the first page they open announces the game.
let introShown = false;
function firstVisit() {
  if (introShown) return false;
  introShown = true;
  try {
    if (localStorage.getItem('potions:intro')) return false;
    localStorage.setItem('potions:intro', '1');
  } catch {}
  return true;
}
function emptyFlask(button: HTMLButtonElement) {
  button.dataset.drunk = '';
  button.setAttribute('aria-label', 'Empty potion');
}

// Once every potion is drunk, the exit door opens the first time it comes into view, then stays open.
function watchExit() {
  const door = document.querySelector('.contact-exit');
  if (!door || exitOpen || drunk.size < total) return;
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    exitOpen = true;
    savePotions();
    applyPotions();
    play('door');
  }, { threshold: 0.6 });
  observer.observe(door);
  cleanups.push(() => observer.disconnect());
}

function potions() {
  loadPotions();
  applyPotions();
  const status = document.querySelector<HTMLElement>('[data-potion-status]');
  // Say what the triangles are for, once, after the first scroll: the opening seconds belong to the page.
  if (!drunk.size && !introShown) {
    listen(window, 'scroll', () => {
      if (drunk.size || !firstVisit()) return;
      flash(`<b>${total} potions</b> hide in the castle`, 5000);
      if (status) status.textContent = `${total} potions hide in the castle. Find one and select it to drink it.`;
    }, { passive: true, once: true });
  }
  $$<HTMLButtonElement>('[data-potion]').forEach((button) => {
    const id = button.dataset.potion!;
    // Set both ways, so "Play again" can refill a flask on the page it is clicked from.
    button.disabled = drunk.has(id);
    button.removeAttribute('aria-disabled');
    if (drunk.has(id)) { emptyFlask(button); return; }
    delete button.dataset.drunk;
    button.setAttribute('aria-label', 'Drink me: one of the potions hidden around the site');
    listen(button, 'click', () => {
      if (drunk.has(id)) return;
      if (!drunk.size) startedAt = Date.now();
      drunk.add(id);
      if (drunk.size >= total && startedAt) finishedIn = Date.now() - startedAt;
      savePotions();
      const count = drunk.size;
      // Stays focusable until the next page, so keyboard focus is not lost.
      button.setAttribute('aria-disabled', 'true');
      const done = () => { emptyFlask(button); applyPotions(); };
      const motion = animate(button.querySelector('.potion-full')!, [{ transform: 'none' }, { transform: 'translate(-3px, -9px) rotate(-40deg)' }], 420, 0, 'steps(3, end)');
      if (motion) motion.finished.then(done, done);
      else done();
      const tri = document.querySelectorAll<HTMLElement>('.hud-tri')[count - 1];
      if (tri) {
        tri.classList.add('is-new');
        setTimeout(() => tri.classList.remove('is-new'), 1000);
      }
      if (count >= total) {
        flash(`<b>All ${total} potions</b> · The exit is open`, 5000);
        if (status) status.textContent = `All ${total} potions found. The exit door in Contact is open.`;
        play('fanfare');
        track('potion_found', { potion_id: id, count });
        track('potions_complete', { minutes: Math.round(finishedIn / 60000) });
        rewardLine();
        watchExit();
        return;
      }
      flash(count === 1 ? `<b>Potion found</b> · ${total - 1} more in the castle` : `<b>Potion found</b> · ${count} of ${total}`);
      if (status) status.textContent = `Potion found. ${count} of ${total}.`;
      play('potion');
      track('potion_found', { potion_id: id, count });
      // Sound starts off; the first potion points out the switch once.
      if (count === 1 && !soundOn()) {
        const toggle = document.querySelector<HTMLElement>('[data-sound-toggle]');
        toggle?.classList.add('is-hint');
        setTimeout(() => toggle?.classList.remove('is-hint'), 1600);
      }
    });
  });
  rewardLine();
  $$('[data-potion-mail]').forEach((link) => listen(link, 'click', () => track('potion_mail')));
  $$('[data-potion-reset]').forEach((button) => listen(button, 'click', () => {
    drunk = new Set();
    exitOpen = false;
    startedAt = finishedIn = 0;
    savePotions();
    document.querySelector<HTMLElement>('.contact-mail')?.focus();
    flash(`<b>The potions are back</b> · Find all ${total}`);
    if (status) status.textContent = `The potions are back. Find all ${total}.`;
    init();
  }));
  watchExit();
}

function soundToggle() {
  $$('[data-sound-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(soundOn()));
    listen(button, 'click', () => {
      const on = !soundOn();
      setSound(on);
      button.setAttribute('aria-pressed', String(on));
      play('toggle');
    });
  });
}

// On pages with a section nav, mark the room being read and the rooms already passed.
function caseNav() {
  const links = $$<HTMLAnchorElement>('.case-nav a[href^="#"]');
  const rooms = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  if (!links.length) return;
  let frame = 0;
  let last = -2;
  const update = () => {
    frame = 0;
    let current = -1;
    rooms.forEach((room, i) => { if (room && room.getBoundingClientRect().top <= 160) current = i; });
    if (current === last) return;
    last = current;
    links.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      link.toggleAttribute('data-visited', i < current);
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  listen(window, 'scroll', schedule, { passive: true });
  listen(window, 'resize', schedule);
  cleanups.push(() => cancelAnimationFrame(frame));
  update();
}

function menu() {
  const button = document.getElementById('mnav-btn');
  const dialog = document.getElementById('mnav') as HTMLDialogElement | null;
  if (!button || !dialog) return;
  const previousOverflow = document.documentElement.style.overflow;
  const close = () => dialog.close();
  listen(button, 'click', () => {
    dialog.showModal();
    button.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  });
  listen(dialog, 'close', () => {
    button.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = previousOverflow;
  });
  dialog.querySelectorAll('a, [data-menu-close]').forEach((el) => listen(el, 'click', close));
  listen(dialog, 'click', (event) => { if (event.target === dialog && (event as MouseEvent).clientX < dialog.getBoundingClientRect().left) close(); });
  const desktop = matchMedia('(min-width: 1024px)');
  listen(desktop, 'change', () => { if (desktop.matches && dialog.open) close(); });
  cleanups.push(() => { if (dialog.open) close(); document.documentElement.style.overflow = previousOverflow; });
}

function theme() {
  $$('[data-theme-toggle]').forEach((button) => listen(button, 'click', () => {
    const html = document.documentElement;
    const light = html.dataset.theme === 'light' || (!html.dataset.theme && matchMedia('(prefers-color-scheme: light)').matches);
    const next = light ? 'dark' : 'light';
    html.dataset.theme = next;
    // Keep the browser chrome color in sync with the chosen theme.
    const color = THEME_COLOR[next];
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      meta.content = color;
      meta.removeAttribute('media');
    });
    try { localStorage.setItem('theme', next); } catch {}
  }));
}

function copyEmail() {
  $$('[data-copy]').forEach((button) => {
    const label = button.querySelector<HTMLElement>('[data-copy-label]') ?? button;
    const original = label.textContent;
    const status = document.querySelector<HTMLElement>('[data-copy-status]');
    let timer: ReturnType<typeof setTimeout>;
    listen(button, 'click', async () => {
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(button.dataset.copy!);
        if (!button.isConnected) return;
        label.textContent = 'Copied';
        if (status) status.textContent = 'Email address copied.';
      } catch {
        if (!button.isConnected) return;
        label.textContent = button.dataset.copy!;
        if (status) status.textContent = 'Could not copy. The email address is now shown.';
      }
      timer = setTimeout(() => { label.textContent = original; if (status) status.textContent = ''; }, 2400);
    });
    cleanups.push(() => clearTimeout(timer));
  });
}

function galleries() {
  $$('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector<HTMLElement>('[data-gallery-track]');
    const slides = [...gallery.querySelectorAll<HTMLElement>('[data-gallery-slide]')];
    const dots = [...gallery.querySelectorAll<HTMLButtonElement>('[data-gallery-dot]')];
    const prev = gallery.querySelector<HTMLButtonElement>('[data-gallery-prev]');
    const next = gallery.querySelector<HTMLButtonElement>('[data-gallery-next]');
    const controls = gallery.querySelector<HTMLElement>('[data-gallery-controls]');
    const status = gallery.querySelector<HTMLElement>('[data-gallery-status]');
    if (!track || slides.length < 2) return;
    if (controls) controls.hidden = false;
    let index = 0;
    let interacted = false;
    const setActive = (i: number) => {
      index = i;
      dots.forEach((dot, n) => dot.setAttribute('aria-pressed', String(n === i)));
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
      slides.forEach((slide, n) => {
        slide.inert = n !== i;
        if (n !== i) slide.querySelector('video')?.pause();
      });
      if (status && interacted) status.textContent = `Item ${i + 1} of ${slides.length}`;
    };
    const goTo = (i: number) => {
      interacted = true;
      const target = Math.max(0, Math.min(slides.length - 1, i));
      const left = slides[target].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
      track.scrollTo({ left, behavior: reduced() ? 'instant' : 'smooth' });
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(slides.indexOf(entry.target as HTMLElement)); }),
      { root: track, threshold: .6 },
    );
    slides.forEach((slide) => observer.observe(slide));
    cleanups.push(() => observer.disconnect());
    if (prev) listen(prev, 'click', () => goTo(index - 1));
    if (next) listen(next, 'click', () => goTo(index + 1));
    dots.forEach((dot, n) => listen(dot, 'click', () => goTo(n)));
    listen(track, 'pointerdown', () => { interacted = true; });
    listen(track, 'keydown', ((event: KeyboardEvent) => {
      if (event.target !== track) return;
      const targets: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: slides.length - 1 };
      if (!(event.key in targets)) return;
      event.preventDefault();
      goTo(targets[event.key]);
    }) as EventListener);
    setActive(0);
  });
}

function init() {
  cleanup();
  reveals();
  moreToggles();
  spotlight();
  scrollPosition();
  caseNav();
  menu();
  theme();
  copyEmail();
  galleries();
  potions();
  soundToggle();
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  listen(preference, 'change', init);
}
document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);
