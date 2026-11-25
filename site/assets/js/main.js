const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* snow */
(() => {
  if (reduceMotion) return;
  const canvas = document.getElementById('snow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, flakes = [];
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(140, Math.round((w * h) / 18000));
    flakes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.5 + 0.12,
      vx: Math.random() * 0.25 - 0.12,
      a: Math.random() * 0.5 + 0.15,
    }));
  };
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.y += f.vy;
      f.x += f.vx;
      if (f.y > h) { f.y = -4; f.x = Math.random() * w; }
      if (f.x > w) f.x = 0;
      if (f.x < 0) f.x = w;
      ctx.beginPath();
      ctx.fillStyle = `rgba(220,238,245,${f.a})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  tick();
})();

/* reveal */
(() => {
  const targets = document.querySelectorAll('section .wrap > *, .project, .card');
  if (reduceMotion) return;
  targets.forEach((el) => el.classList.add('rv'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
})();

/* lightbox */
(() => {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const close = document.getElementById('lbClose');
  document.querySelectorAll('[data-full]').forEach((fig) => {
    fig.addEventListener('click', () => {
      img.src = fig.dataset.full;
      lb.classList.add('on');
    });
  });
  const hide = () => { lb.classList.remove('on'); img.src = ''; };
  close.addEventListener('click', hide);
  lb.addEventListener('click', (e) => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
})();

/* lazy game iframe */
(() => {
  const button = document.getElementById('playStart');
  if (!button) return;
  button.addEventListener('click', () => {
    const frame = document.getElementById('playFrame');
    frame.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = 'play/frostspace/';
    iframe.title = 'FrostSpace — играбельный прототип';
    iframe.allow = 'fullscreen; gamepad; autoplay';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
  });
})();

/* video chapters */
(() => {
  const player = document.getElementById('player');
  const chapters = document.getElementById('chapters');
  if (!player || !chapters) return;
  chapters.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled || !btn.dataset.src) return;
    chapters.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === btn));
    player.src = btn.dataset.src;
    player.load();
    player.play().catch(() => {});
    player.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });
})();
