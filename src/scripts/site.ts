// All page interactions. Re-initialised on every view transition (astro:page-load).
// Everything visual is gated: reduced motion drops movement, coarse pointers skip
// tilt and magnetic effects, and the hero shader only loads where it can run.

const cleanups: Array<() => void> = [];
const on = <K extends string>(t: EventTarget, e: K, f: any, o?: any) => {
  t.addEventListener(e, f, o);
  cleanups.push(() => t.removeEventListener(e, f, o));
};
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

/* Scroll reveals */
function reveals() {
  const els = $$('.fx');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        // Reveal when entering, and also when already scrolled past (fast scrolls
        // can deliver the entry after the element has left the viewport).
        if (e.isIntersecting || e.boundingClientRect.top < innerHeight) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
  );
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/* Count-up numbers */
function counters() {
  const els = $$('[data-count]');
  if (!els.length) return;
  const run = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.count!);
    const suffix = el.dataset.suffix ?? '';
    if (reduced()) { el.textContent = target + suffix; return; }
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target as HTMLElement); io.unobserve(e.target); } }),
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/* Decode-in headline */
function scramble() {
  if (reduced()) return;
  const GLYPHS = '#/\\<>[]{}|=+*';
  $$('[data-scramble]').forEach((el, block) => {
    const text = el.textContent ?? '';
    let frame = 0;
    const total = 26;
    const step = () => {
      frame++;
      const settled = Math.floor((frame / total) * text.length);
      el.textContent = [...text]
        .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join('');
      if (settled < text.length) requestAnimationFrame(step);
      else el.textContent = text;
    };
    setTimeout(() => requestAnimationFrame(step), 120 + block * 220);
  });
}

/* 3D tilt + spotlight coordinates */
function tilt() {
  if (!fine() || reduced()) return;
  $$('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt || '3.5');
    on(el, 'pointermove', (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
      el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
    });
    on(el, 'pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
}

/* Magnetic buttons */
function magnets() {
  if (!fine() || reduced()) return;
  $$('[data-magnet]').forEach((el) => {
    on(el, 'pointermove', (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--tx', `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
      el.style.setProperty('--ty', `${(e.clientY - r.top - r.height / 2) * 0.28}px`);
    });
    on(el, 'pointerleave', () => {
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
    });
  });
}

/* Timeline accordions */
function accordions() {
  $$('.acc-item').forEach((item) => {
    const btn = item.querySelector('.acc-btn');
    if (!btn) return;
    on(btn, 'click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

/* Mobile menu */
function menu() {
  const btn = document.getElementById('mnav-btn');
  const nav = document.getElementById('mnav');
  if (!btn || !nav) return;
  const set = (open: boolean) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  on(btn, 'click', () => set(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((a) => on(a, 'click', () => set(false)));
  on(document, 'keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') set(false); });
  cleanups.push(() => set(false));
}

/* Theme toggle (any number of buttons) */
function theme() {
  $$('[data-theme-toggle]').forEach((btn) =>
    on(btn, 'click', () => {
      const html = document.documentElement;
      const light = html.dataset.theme === 'light' ||
        (html.dataset.theme !== 'dark' && matchMedia('(prefers-color-scheme: light)').matches);
      const next = light ? 'dark' : 'light';
      html.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch {}
    }),
  );
}

/* Copy email chip */
function copyChips() {
  $$('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('[data-copy-label]') ?? btn;
    const original = label.textContent;
    on(btn, 'click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy!);
        label.textContent = 'Email copied';
        setTimeout(() => { label.textContent = original; }, 1400);
      } catch {}
    });
  });
}

/* Hero shader */
function shader() {
  const canvas = document.getElementById('gl') as HTMLCanvasElement | null;
  if (!canvas || reduced()) return;
  import('./aurora').then((m) => cleanups.push(m.mount(canvas)));
}

function init() {
  cleanups.splice(0).forEach((f) => f());
  document.documentElement.classList.add('js');
  reveals();
  counters();
  scramble();
  tilt();
  magnets();
  accordions();
  menu();
  theme();
  copyChips();
  shader();
}

document.addEventListener('astro:page-load', init);
