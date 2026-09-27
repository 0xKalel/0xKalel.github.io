// Game sounds, synthesized in the browser: short square-wave cues in the Hijaz mode, in the spirit of
// the PC speaker music of Prince of Persia (1989). No audio files. Every cue answers something the
// visitor did, and the HUD speaker button turns them on or off.
import { SOUND_ON_BY_DEFAULT } from '../lib/potions';

export type Cue = 'potion' | 'fanfare' | 'door' | 'toggle';

const KEY = 'sound';
let remembered = SOUND_ON_BY_DEFAULT;
let ctx: AudioContext | null = null;
let out: GainNode;
let noise: AudioBuffer;

export function soundOn() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? saved === 'on' : SOUND_ON_BY_DEFAULT;
  } catch {
    return remembered;
  }
}

export function setSound(on: boolean) {
  remembered = on;
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch {}
  if (on) document.documentElement.dataset.sound = 'on';
  else delete document.documentElement.dataset.sound;
}

// Created on first use, which is always inside a click, so the browser lets it play.
function context() {
  if (!ctx) {
    const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Context) return null;
    ctx = new Context();
    // A lowpass takes the edge off the square waves, like a small speaker would.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2600;
    out = ctx.createGain();
    out.gain.value = 0.16;
    out.connect(filter).connect(ctx.destination);
    noise = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.04), ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function note(c: AudioContext, freq: number, at: number, length: number, { type = 'square', volume = 0.5, to }: { type?: OscillatorType; volume?: number; to?: number } = {}) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, at + length);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

// One click of the door's chain: a burst of filtered noise over a low thud.
function tick(c: AudioContext, at: number) {
  const source = c.createBufferSource();
  source.buffer = noise;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 1400;
  band.Q.value = 1.2;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.9, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.035);
  source.connect(band).connect(gain).connect(out);
  source.start(at);
  note(c, 90, at, 0.03, { volume: 0.4 });
}

// Three swallows, each a falling blip. Returns when the gulp ends.
function gulp(c: AudioContext, at: number) {
  for (let i = 0; i < 3; i++) note(c, 210, at + i * 0.1, 0.08, { type: 'triangle', volume: 0.9, to: 110 });
  return at + 0.32;
}

// D Hijaz: D, Eb, F#, G, A, Bb, C.
const [D3, D4, Eb4, Fs4, G4, A4, Bb4, D5, Eb5, Fs5, G5, A5] = [146.83, 293.66, 311.13, 369.99, 392, 440, 466.16, 587.33, 622.25, 739.99, 783.99, 880];

export function play(cue: Cue) {
  if (!soundOn()) return;
  const c = context();
  if (!c) return;
  let t = c.currentTime + 0.02;
  if (cue === 'toggle') {
    note(c, 660, t, 0.05);
    note(c, 990, t + 0.06, 0.07);
    return;
  }
  // The door rises in ten steps over 900ms (ExitDoor.astro); one tick per step.
  if (cue === 'door') {
    for (let i = 0; i < 10; i++) tick(c, t + i * 0.09);
    return;
  }
  t = gulp(c, t);
  if (cue === 'potion') {
    [D5, Eb5, Fs5, G5].forEach((f, i) => note(c, f, t + i * 0.07, 0.09));
    note(c, A5, t + 0.28, 0.24);
    return;
  }
  // The fanfare: down the scale to the tonic, then a leap back up, over a held drone.
  const phrase: Array<[number, number]> = [[A4, 0.12], [Bb4, 0.12], [A4, 0.12], [G4, 0.12], [Fs4, 0.12], [Eb4, 0.12], [D4, 0.24], [D4, 0.08], [Fs4, 0.08], [A4, 0.08], [D5, 0.5]];
  note(c, D3, t, phrase.reduce((sum, [, d]) => sum + d, 0), { type: 'triangle', volume: 0.35 });
  phrase.forEach(([f, d]) => { note(c, f, t, d * 0.95); t += d; });
}
