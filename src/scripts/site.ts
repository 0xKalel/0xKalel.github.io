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

function projectPreview() {
  const root = document.querySelector<HTMLElement>('[data-project-preview]');
  if (!root) return;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-preview-select]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-preview-panel]')];
  const controls = root.querySelector<HTMLElement>('.preview-controls');
  if (controls) controls.hidden = false;
  let active = Math.max(0, buttons.findIndex((button) => button.getAttribute('aria-pressed') === 'true'));
  const select = (index: number) => {
    if (index === active) return;
    active = index;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    animate(panels[index], [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], 260);
  };
  buttons.forEach((button, index) => {
    listen(button, 'click', () => select(index));
    listen(button, 'keydown', ((event: KeyboardEvent) => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      select(next);
      buttons[next].focus();
    }) as EventListener);
    // Warm the chosen images when the visitor approaches the control.
    const warm = () => panels[index].querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
    listen(button, 'pointerenter', warm);
    listen(button, 'focus', warm);
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

function scrollPosition() {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  const sections = $$<HTMLElement>('main section[id]');
  const links = $$<HTMLAnchorElement>('[data-section-link]');
  let frame = 0;
  const update = () => {
    const distance = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    if (location.pathname === '/') {
      const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 150)?.id;
      links.forEach((link) => {
        if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
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
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((g) => {
    const track = g.querySelector<HTMLElement>('[data-gallery-track]');
    const slides = [...g.querySelectorAll<HTMLElement>('[data-gallery-slide]')];
    const dots = [...g.querySelectorAll<HTMLButtonElement>('[data-gallery-dot]')];
    const prev = g.querySelector<HTMLButtonElement>('[data-gallery-prev]');
    const next = g.querySelector<HTMLButtonElement>('[data-gallery-next]');
    if (!track || slides.length < 2) return;
    let index = 0;
    const setActive = (i: number) => {
      index = i;
      dots.forEach((d, n) => d.setAttribute('aria-selected', String(n === i)));
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
      // Pause any playing video that scrolled away.
      slides.forEach((sl, n) => { if (n !== i) sl.querySelector('video')?.pause(); });
    };
    const goTo = (i: number) => {
      const target = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[target].offsetLeft, behavior: 'smooth' });
    };
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(slides.indexOf(e.target as HTMLElement)); }),
      { root: track, threshold: 0.6 },
    );
    slides.forEach((sl) => io.observe(sl));
    cleanups.push(() => io.disconnect());
    if (prev) listen(prev, 'click', () => goTo(index - 1));
    if (next) listen(next, 'click', () => goTo(index + 1));
    dots.forEach((d, n) => listen(d, 'click', () => goTo(n)));
    listen(track, 'keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    });
    setActive(0);
  });
}

function init() {
  cleanup();
  reveals();
  projectPreview();
  spotlight();
  scrollPosition();
  menu();
  theme();
  copyEmail();
  galleries();
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  listen(preference, 'change', init);
}
document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);
