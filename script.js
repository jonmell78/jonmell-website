/* ── NAV: scroll behaviour & mobile toggle ─────────────── */
const nav    = document.getElementById('nav');
const burger = document.querySelector('.nav-burger');
const links  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Close mobile nav on link click
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ── SCROLL REVEAL ─────────────────────────────────────── */
const revealElements = () => {
  document.querySelectorAll(
    '.service-card, .step, .impact-card, .testimonial, .forwho-card, ' +
    '.about-card, .about-quote, .about-tags, .about-content, ' +
    '.stat, .cred, .hero-badge, .hero-headline, .hero-sub, .hero-actions, .hero-stats'
  ).forEach(el => el.classList.add('reveal'));
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = Array.from(entry.target.parentElement?.children || []);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements();
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── ACTIVE NAV LINK on scroll ─────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--text)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── CONTACT FORM (Formspree) ──────────────────────────── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/xvzwkaod', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.reset();
      btn.hidden     = true;
      success.hidden = false;
    } else {
      const data = await res.json();
      const msg  = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong. Please email jon@jonmell.co.uk directly.';
      btn.textContent = 'Try again';
      btn.disabled    = false;
      alert(msg);
    }
  } catch {
    btn.textContent = 'Try again';
    btn.disabled    = false;
    alert('Could not send — please email jon@jonmell.co.uk directly.');
  }
});

/* ── SMOOTH SCROLL offset for fixed nav ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
