// Hand-written WebGL aurora for the hero. No library, ~4KB.
// Slow flowing noise in the accent hue, nudged by the pointer.
// Pauses offscreen and in hidden tabs; the caller skips it under reduced motion.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uLight;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=uv;p.x*=uRes.x/uRes.y;
  vec2 m=(uMouse-.5)*.45;
  float t=uTime*.045;
  float f=fbm(p*1.5+vec2(t,-t*.6)+m);
  float f2=fbm(p*2.1-vec2(t*.7,t*.4)+f);
  float band=smoothstep(.32,.9,f2);
  vec3 c1=vec3(.04,.34,.24);
  vec3 c2=vec3(.06,.58,.42);
  vec3 c3=vec3(.5,.95,.72);
  vec3 col=mix(c1,c2,f)*band+c3*pow(band,6.)*.4;
  float vig=smoothstep(1.2,.3,distance(uv,vec2(.6,.45)));
  float a=band*vig*(1.-uLight*.55);
  gl_FragColor=vec4(col*vig,a*.85);
}`;

export function mount(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) return () => {};

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uLight = gl.getUniformLocation(prog, 'uLight');

  const dpr = Math.min(devicePixelRatio || 1, 2) * 0.55;
  const resize = () => {
    canvas.width = Math.max(2, canvas.clientWidth * dpr);
    canvas.height = Math.max(2, canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();

  const isLight = () =>
    document.documentElement.dataset.theme === 'light' ||
    (document.documentElement.dataset.theme !== 'dark' && matchMedia('(prefers-color-scheme: light)').matches);

  let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5;
  let raf = 0, visible = true, light = isLight() ? 1 : 0;
  const t0 = performance.now();

  const loop = () => {
    raf = 0;
    if (!visible || document.hidden) return;
    mx += (tx - mx) * 0.04;
    my += (ty - my) * 0.04;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (performance.now() - t0) / 1000);
    gl.uniform2f(uMouse, mx, 1 - my);
    gl.uniform1f(uLight, light);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(loop);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  const onMove = (e: PointerEvent) => {
    tx = e.clientX / innerWidth;
    ty = e.clientY / innerHeight;
  };
  const onVis = () => kick();
  const mo = new MutationObserver(() => { light = isLight() ? 1 : 0; });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('visibilitychange', onVis);
  kick();

  return () => {
    if (raf) cancelAnimationFrame(raf);
    removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVis);
    io.disconnect();
    ro.disconnect();
    mo.disconnect();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
