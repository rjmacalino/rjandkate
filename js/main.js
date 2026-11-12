// ===== Settings =====
const WEDDING_DATE = new Date('2026-12-26T14:00:00+08:00'); // ceremony, 2:00 PM PH time

const PHOTOS = ['_aap7466.jpg','_aap7484.jpg','_aap7505.jpg','_aap7514.jpg','_aap7516.jpg','_aap7523.jpg','apr07179.jpg','apr07191.jpg','apr07208.jpg','apr07249.jpg','apr07280.jpg','apr07329.jpg','apr07344.jpg','apr07348.jpg','apr07356.jpg','apr07377.jpg','apr07403.jpg','apr07407.jpg','apr07424.jpg','apr07437.jpg','apr07456.jpg','apr07464.jpg','apr07500.jpg','apr07502.jpg','apr07532.jpg','apr07537.jpg','apr07549.jpg','apr07551.jpg','apr07558.jpg','apr07584.jpg','apr07595.jpg','apr07644.jpg','apr07658.jpg','apr07678.jpg','apr07696.jpg','apr07707.jpg','apr07741.jpg','apr07751.jpg','apr07786.jpg','apr07796.jpg','apr07802.jpg','apr07883.jpg','_aap7542.jpg','_aap7553.jpg','_aap7557.jpg','_aap7566.jpg','_aap7571.jpg','_aap7638.jpg','_aap7682.jpg','_aap7688.jpg','_aap7718.jpg','_aap7737.jpg','_aap7740.jpg','_aap7743.jpg','_aap7762.jpg','_aap7768.jpg','_aap7778.jpg','_aap7789.jpg','_aap7791.jpg','_aap7795.jpg','_aap7796.jpg','_aap7808.jpg','_aap7822.jpg','_aap7832.jpg','_aap7865.jpg','apr07912.jpg','apr07929.jpg','apr07950.jpg','apr07960.jpg','apr08024.jpg','apr08034.jpg','apr08061.jpg','apr08065.jpg','apr08070.jpg','apr08073.jpg','apr08081.jpg','apr08086.jpg','apr08096.jpg','apr08099.jpg','apr08114.jpg','apr08183.jpg','apr08211.jpg','apr08338.jpg','apr08340.jpg','apr08342.jpg','apr08358.jpg','apr08368.jpg','apr08379.jpg','apr08389.jpg','apr08430.jpg','apr08474.jpg','apr08475.jpg','apr08482.jpg','apr08491.jpg','apr08495.jpg','apr08509.jpg','apr08513.jpg','apr08588.jpg','apr08603.jpg','apr08606.jpg','apr08616.jpg','apr08620.jpg','apr08629.jpg','apr08631.jpg','apr08634.jpg','apr08723.jpg','apr08963.jpg','apr09004.jpg','_aap7727.jpg','apr08731.jpg','apr08734.jpg','apr08749.jpg','apr08757.jpg','apr08779.jpg','apr08787.jpg','apr08831.jpg','apr08867.jpg','apr08922.jpg'];
const PAGE_SIZE = 24;

// ===== Nav =====
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
const setMenu = open => {
  links.classList.toggle('open', open);
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
};
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Countdown =====
// Before the wedding it counts down to the day; afterwards, to the next anniversary
const cd = id => document.getElementById(id);
const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
function nextTarget(now) {
  if (now < WEDDING_DATE) return { date: WEDDING_DATE, years: 0 };
  const date = new Date(WEDDING_DATE);
  let years = 0;
  while (date <= now) { years++; date.setUTCFullYear(WEDDING_DATE.getUTCFullYear() + years); }
  return { date, years };
}
function tick() {
  const now = new Date();
  const { date, years } = nextTarget(now);
  cd('cdLabel').textContent = years ? 'until our ' + ordinal(years) + ' anniversary' : '';
  const diff = Math.max(0, date - now);
  cd('cd-days').textContent = Math.floor(diff / 864e5);
  cd('cd-hours').textContent = Math.floor(diff / 36e5) % 24;
  cd('cd-mins').textContent = Math.floor(diff / 6e4) % 60;
  cd('cd-secs').textContent = Math.floor(diff / 1e3) % 60;
}
tick();
setInterval(tick, 1000);

// ===== Reveal on scroll =====
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Hero slideshow =====
// Phones get portrait photos, wider screens get landscape ones
const HERO_PORTRAIT = ['apr08757.jpg', '_aap7727.jpg', 'apr07537.jpg', 'apr08513.jpg', '_aap7740.jpg', '_aap7505.jpg', 'apr07883.jpg'];
const HERO_LANDSCAPE = ['_aap7466.jpg', 'apr07249.jpg', 'apr07208.jpg', 'apr07707.jpg', 'apr07751.jpg', 'apr07179.jpg', 'apr08831.jpg'];
const heroBox = document.getElementById('heroSlides');
const portraitMq = window.matchMedia('(max-aspect-ratio: 1/1)');
let heroTimer, heroIdx = 0;
function startHero() {
  clearInterval(heroTimer);
  const list = portraitMq.matches ? HERO_PORTRAIT : HERO_LANDSCAPE;
  heroBox.innerHTML = list.map(f => '<img src="images/full/' + f + '" alt="" ' + (f === list[0] ? '' : 'loading="lazy"') + '>').join('');
  const imgs = heroBox.querySelectorAll('img');
  heroIdx = 0;
  requestAnimationFrame(() => imgs[0].classList.add('active'));
  heroTimer = setInterval(() => {
    imgs[heroIdx].classList.remove('active');
    heroIdx = (heroIdx + 1) % imgs.length;
    imgs[heroIdx].loading = 'eager';
    imgs[heroIdx].classList.add('active');
  }, 5000);
}
startHero();
portraitMq.addEventListener('change', startHero);

// ===== Gallery =====
// Masonry with fixed columns: each photo goes into the shortest column,
// so photos already on screen never move when more are loaded.
const TALL = new Set(['apr07280.jpg','apr07329.jpg','apr07344.jpg','apr07348.jpg','apr07356.jpg','apr07377.jpg','apr07403.jpg','apr07407.jpg','apr07424.jpg','apr07437.jpg','apr07456.jpg','apr07464.jpg','apr07500.jpg','apr07502.jpg','apr07532.jpg','apr07537.jpg','apr07549.jpg','apr07551.jpg','apr07558.jpg','apr07584.jpg','apr07786.jpg','apr07796.jpg','apr07802.jpg','apr07883.jpg','apr07912.jpg','apr07929.jpg','apr07950.jpg','apr07960.jpg','apr08024.jpg','apr08081.jpg','apr08430.jpg','apr08474.jpg','apr08475.jpg','apr08482.jpg','apr08491.jpg','apr08495.jpg','apr08509.jpg','apr08513.jpg','apr08731.jpg','apr08734.jpg','apr08749.jpg','apr08757.jpg','apr08779.jpg','apr08787.jpg','apr08867.jpg','apr08922.jpg','_aap7484.jpg','_aap7505.jpg','_aap7514.jpg','_aap7516.jpg','_aap7523.jpg','_aap7566.jpg','_aap7571.jpg','_aap7727.jpg','_aap7740.jpg','_aap7743.jpg']); // portrait photos (2:3), the rest are 3:2
const ratio = f => TALL.has(f) ? 1.5 : 2 / 3;
const grid = document.getElementById('galleryGrid');
const sentinel = document.getElementById('gallerySentinel');
let shown = 0, cols = [], colHeights = [];
const colCount = () => window.innerWidth >= 1200 ? 4 : window.innerWidth >= 600 ? 3 : 2;
function buildCols() {
  grid.innerHTML = '';
  cols = []; colHeights = [];
  for (let c = 0; c < colCount(); c++) {
    const col = document.createElement('div');
    col.className = 'gallery-col';
    grid.appendChild(col);
    cols.push(col); colHeights.push(0);
  }
}
function addPhoto(idx) {
  const f = PHOTOS[idx];
  const c = colHeights.indexOf(Math.min(...colHeights));
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Open photo ' + (idx + 1));
  const h = Math.round(600 * ratio(f));
  b.innerHTML = '<img src="images/thumb/' + f + '" alt="RJ and Kate" width="600" height="' + h + '" loading="lazy">';
  b.addEventListener('click', () => openLb(idx));
  cols[c].appendChild(b);
  colHeights[c] += ratio(f);
}
function showMore() {
  const end = Math.min(PHOTOS.length, shown + PAGE_SIZE);
  for (let i = shown; i < end; i++) addPhoto(i);
  shown = end;
  if (shown >= PHOTOS.length) galleryIo.disconnect();
}
// Infinite scroll: load the next batch when the bottom of the gallery comes near
const galleryIo = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) showMore();
}, { rootMargin: '600px 0px' });
buildCols();
showMore();
galleryIo.observe(sentinel);
// Re-layout only when the number of columns changes (e.g. rotating a phone)
let lastCols = colCount();
window.addEventListener('resize', () => {
  if (colCount() === lastCols) return;
  lastCols = colCount();
  const n = shown;
  buildCols();
  for (let i = 0; i < n; i++) addPhoto(i);
});

// ===== Lightbox =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let cur = 0;
function openLb(i) {
  cur = (i + PHOTOS.length) % PHOTOS.length;
  lbImg.src = 'images/full/' + PHOTOS[cur];
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => openLb(cur - 1));
document.getElementById('lbNext').addEventListener('click', () => openLb(cur + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') openLb(cur - 1);
  if (e.key === 'ArrowRight') openLb(cur + 1);
});
let touchX = null;
lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) openLb(cur + (dx < 0 ? 1 : -1));
  touchX = null;
});


// ===== Envelope sound: paper crinkle + slide, synthesized with Web Audio (no audio files) =====
// On by default, but browsers only allow sound after the visitor's first tap/click/key press.
const soundBtn = document.getElementById('soundToggle');
let soundOn = true;
try { soundOn = localStorage.getItem('envSound') !== 'off'; } catch (e) {}
let audioCtx = null, noiseBuf = null;
function initAudio() {
  if (audioCtx) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioCtx = new AC();
  noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 1.5, audioCtx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}
function unlockAudio() {
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, unlockAudio, { passive: true }));
// One filtered noise burst: start time, length, filter sweep and loudness
function rustle(at, dur, f1, f2, vol) {
  const src = audioCtx.createBufferSource();
  src.buffer = noiseBuf;
  const bp = audioCtx.createBiquadFilter();
  bp.type = 'bandpass'; bp.Q.value = 0.9;
  bp.frequency.setValueAtTime(f1, at);
  bp.frequency.exponentialRampToValueAtTime(f2, at + dur);
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + Math.min(0.04, dur / 4));
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(bp).connect(g).connect(audioCtx.destination);
  src.start(at, Math.random() * 0.4, dur);
}
function playEnvelopeSound() {
  if (!soundOn || !audioCtx || audioCtx.state !== 'running') return;
  const t = audioCtx.currentTime;
  rustle(t, 0.18, 3200, 1800, 0.10);        // flap unsticks
  rustle(t + 0.12, 0.30, 2200, 1400, 0.07); // flap folds back
  rustle(t + 0.55, 1.10, 900, 2600, 0.05);  // paper slides out
}
function renderSoundBtn() {
  if (!soundBtn) return;
  soundBtn.classList.toggle('off', !soundOn);
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  soundBtn.setAttribute('aria-label', soundOn ? 'Mute envelope sound' : 'Turn on envelope sound');
}
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('envSound', soundOn ? 'on' : 'off'); } catch (e) {}
    renderSoundBtn();
  });
  renderSoundBtn();
}

// ===== Entourage envelopes: open once fully scrolled into view =====
const envelopes = document.querySelectorAll('.envelope');
if (envelopes.length) {
  document.documentElement.classList.add('env-anim');
  // Opens once the bottom of the envelope is on screen. Closes again once it drops
  // fully below the screen (scrolling back up), so it replays on the way down.
  let envTicking = false;
  const checkEnvelopes = () => {
    envTicking = false;
    const vh = window.innerHeight;
    let opened = false;
    envelopes.forEach(env => {
      const r = env.getBoundingClientRect();
      if (r.bottom <= vh) {
        if (!env.classList.contains('open')) { env.classList.add('open'); opened = true; }
      } else if (r.top > vh) env.classList.remove('open');
    });
    if (opened) playEnvelopeSound(); // one sound even if several open at once
  };
  const onEnvScroll = () => { if (!envTicking) { envTicking = true; requestAnimationFrame(checkEnvelopes); } };
  window.addEventListener('scroll', onEnvScroll, { passive: true });
  window.addEventListener('resize', onEnvScroll);
  checkEnvelopes();
}
