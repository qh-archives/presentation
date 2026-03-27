// --- Slide navigation ---
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

const areaVideo = document.getElementById('area-video');
const areaSlideIndex = parseInt(areaVideo?.closest('.slide')?.dataset.slide);

function goToSlide(index) {
  if (index < 0 || index >= slides.length || index === currentSlide) return;
  slides[currentSlide].classList.remove('slide-active');
  currentSlide = index;
  slides[currentSlide].classList.add('slide-active');

  if (areaVideo) {
    if (currentSlide === areaSlideIndex) {
      areaVideo.currentTime = 0;
      areaVideo.play();
    } else {
      areaVideo.pause();
    }
  }
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prevSlide();
  }
});

const iframeOverlay = document.getElementById('iframe-overlay');
const iframeEmbed = document.getElementById('iframe-embed');
const iframeClose = document.querySelector('.iframe-close');
let overlayOpen = false;

document.querySelectorAll('.grid-clickable').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const url = el.dataset.href;
    iframeEmbed.src = url;
    iframeOverlay.classList.remove('hidden');
    overlayOpen = true;
  });
});

iframeClose.addEventListener('click', (e) => {
  e.stopPropagation();
  iframeOverlay.classList.add('hidden');
  iframeEmbed.src = '';
  overlayOpen = false;
});

iframeOverlay.addEventListener('click', (e) => {
  if (e.target === iframeOverlay) {
    e.stopPropagation();
    iframeOverlay.classList.add('hidden');
    iframeEmbed.src = '';
    overlayOpen = false;
  }
});

window.addEventListener('click', (e) => {
  if (!overlayOpen) nextSlide();
});

// --- Slide 1: Floating images ---
const IMG_SIZE = 180;
const images = [
  { src: '/images/imgp9361.png', label: 'Taipei 101' },
  { src: '/images/img3.png', label: 'My cat Juki!' },
  { src: '/images/uber.png', label: 'My internship at Uber' },
  { src: '/images/img2.png', label: 'I cofounded UXCNYU' },
  { src: '/images/img8571.png', label: 'Talking at a UXCNYU event' },
  { src: '/images/img5.png', label: 'Cake' },
  { src: '/images/bread.png', label: 'Sourdough' },
  { src: '/images/climbing.png', label: 'Rock climbing' },
  { src: '/images/img4.png', label: 'Skiing upstate' },
  { src: '/images/sunset-new.png', label: 'Sunset' },
];

const container = document.getElementById('images-layer');
const count = images.length;
const STAGGER_MS = 150;
const allVisibleAt = STAGGER_MS * count + 500;

const els = images.map((img, i) => {
  const div = document.createElement('div');
  div.className = 'float-img';
  const labelHtml = img.label ? `<span class="img-label">${img.label}</span>` : '';
  div.innerHTML = `<img src="${img.src}" alt="" />${labelHtml}`;
  div.style.width = IMG_SIZE + 'px';
  container.appendChild(div);

  setTimeout(() => div.classList.add('visible'), 300 + i * STAGGER_MS);

  return { el: div, index: i };
});

const baseAngle = -Math.PI * 0.55;
const angleStep = (Math.PI * 2) / count;
const orbitSpeed = 0.05;

els.forEach((d, i) => {
  d.startAngle = baseAngle + angleStep * i;
  d.fixedRY = -Math.cos(d.startAngle) * 35;
  d.fixedRX = Math.sin(d.startAngle) * 15;
});

const startTime = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const elapsed = (now - startTime) / 1000;
  const orbitElapsed = Math.max(0, (now - startTime - allVisibleAt) / 1000);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = vw / 2;
  const cy = vh / 2;
  const radiusX = vw * 0.42;
  const radiusY = vh * 0.43;

  els.forEach((d, i) => {
    const angle = d.startAngle - orbitElapsed * orbitSpeed;

    const x = cx + Math.cos(angle) * radiusX;
    const y = cy + Math.sin(angle) * radiusY;

    d.el.style.left = (x - IMG_SIZE / 2) + 'px';
    d.el.style.top = (y - IMG_SIZE / 2) + 'px';

    d.el.style.transform = `perspective(800px) rotateY(${d.fixedRY}deg) rotateX(${d.fixedRX}deg)`;
  });
}

animate();
