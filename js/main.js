document.getElementById('year').textContent = new Date().getFullYear();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateProgressBar();
});

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
}

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

const roles = {
  th: ['Cloud / AWS Enthusiast', 'IT Innovation Student', 'Front-End Developer', 'ผู้ชื่นชอบ Serverless'],
  en: ['Cloud / AWS Enthusiast', 'IT Innovation Student', 'Front-End Developer', 'Serverless Enthusiast']
};
const typedEl = document.getElementById('typed');
let roleIndex = 0, charIndex = 0, deleting = false, typeTimer = null;

function typeLoop() {
  if (!typedEl) return;
  const list = roles[currentLang] || roles.th;
  const current = list[roleIndex % list.length];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      typeTimer = setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % list.length;
    }
  }
  typeTimer = setTimeout(typeLoop, deleting ? 45 : 90);
}

const langToggle = document.getElementById('langToggle');
const i18nEls = document.querySelectorAll('[data-th]');
const phEls = document.querySelectorAll('[data-ph-th]');
let currentLang = localStorage.getItem('portfolio-lang') || 'th';

function applyLang(lang) {
  currentLang = lang;
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang;
  i18nEls.forEach(el => {
    const val = lang === 'en' ? el.dataset.en : el.dataset.th;
    if (val !== undefined) el.textContent = val;
  });
  phEls.forEach(el => {
    const val = lang === 'en' ? el.dataset.phEn : el.dataset.phTh;
    if (val !== undefined) el.setAttribute('placeholder', val);
  });
  langToggle.textContent = lang === 'th' ? 'EN' : 'TH';
  localStorage.setItem('portfolio-lang', lang);
  clearTimeout(typeTimer);
  roleIndex = 0; charIndex = 0; deleting = false;
  typeLoop();
}

langToggle.addEventListener('click', () => {
  applyLang(currentLang === 'th' ? 'en' : 'th');
});

applyLang(currentLang);

const revealEls = document.querySelectorAll('.reveal');
const skillCards = document.querySelectorAll('.skill-card');
const counters = document.querySelectorAll('[data-count]');
let countersDone = false;

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));
skillCards.forEach(el => io.observe(el));

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersDone) {
      countersDone = true;
      animateCounters();
    }
  });
}, { threshold: 0.4 });
const statsSection = document.querySelector('.about-stats');
if (statsSection) statObserver.observe(statsSection);

function animateCounters() {
  counters.forEach(counter => {
    const raw = counter.dataset.count;
    const target = parseFloat(raw);
    const decimals = (raw.split('.')[1] || '').length;
    const duration = 1500;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = (eased * target).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
      else counter.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  });
}

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = currentLang === 'en'
      ? "Thanks for your message! I'll get back to you as soon as possible."
      : 'ขอบคุณสำหรับข้อความ! ฉันจะติดต่อกลับโดยเร็วที่สุด';
    formNote.textContent = msg;
    contactForm.reset();
    setTimeout(() => (formNote.textContent = ''), 4000);
  });
}
