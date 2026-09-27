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
function animate(element: HTMLElement, frames: Keyframe[], duration = 380, delay = 0) {
  if (reduced()) return;
  const motion = element.animate(frames, { duration, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  motions.add(motion);
  motion.onfinish = motion.oncancel = () => motions.delete(motion);
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
      if (entry.isIntersecting) {
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

function scrollPosition() {
  const hud = document.querySelector<HTMLElement>('.hud');
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
    const distance = document.documentElement.scrollHeight - innerHeight;
    hud?.style.setProperty('--fill', String(8 * (distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0)));
    const current = location.pathname === '/' ? [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 150) : undefined;
    if (location.pathname === '/') {
      links.forEach((link) => {
        if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    const next = hudLine(sections, current, prose, title);
    if (hudText && next !== line) hudText.innerHTML = line = next;
    frame = 0;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  listen(window, 'scroll', schedule, { passive: true });
  listen(window, 'resize', schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(document.body);
  cleanups.push(() => { cancelAnimationFrame(frame); observer.disconnect(); });
  update();
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
    const color = next === 'light' ? '#f6efe3' : '#090f1c';
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
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  listen(preference, 'change', init);
}
document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);
