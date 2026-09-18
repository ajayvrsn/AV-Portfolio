/* ============================================================
   PORTFOLIO — main.js
   All interactivity: cursor, nav, scroll reveal,
   parallax, form validation, mobile menu
============================================================ */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR
   - Dot follows mouse instantly
   - Ring follows with lerp (smooth lag)
   - Scales up when hovering interactive elements
============================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  // Current mouse position
  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;

  // Ring position (lerped)
  let rx = mx;
  let ry = my;

  // Update dot position immediately on mousemove
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Lerp function: moves 'a' toward 'b' by factor 't'
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Animate ring with smooth follow
  function animateRing() {
    rx = lerp(rx, mx, 0.1);
    ry = lerp(ry, my, 0.1);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect: enlarge cursor on interactive elements
  const hoverTargets = 'a, button, .project-card, .service-item, .skill-item, input, textarea';

  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    });
  });

  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ============================================================
   2. NAVIGATION — Scrolled state + Active link highlight
============================================================ */
(function initNav() {
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (progress) {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      progress.style.width = `${Math.min(100, percentage)}%`;
    }
  }, { passive: true });

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--gold-2)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach((s) => observer.observe(s));
})();


/* ============================================================
   3. MOBILE MENU
============================================================ */
(function initMobileMenu() {
  const btn        = document.getElementById('menuBtn');
  const menu       = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => {
    toggleMenu(!menu.classList.contains('open'));
  });

  // Close when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();


/* ============================================================
   4. SCROLL REVEAL
   Uses IntersectionObserver — far better than scroll events.
   Elements get .reveal class in HTML, JS adds .visible.
============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing (one-shot animation)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach((el) => observer.observe(el));
})();


/* ============================================================
   5. PARALLAX — Hero section
   Subtle parallax on hero left and image on scroll.
   Only runs above the fold to avoid jank.
============================================================ */
(function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroLeft = document.querySelector('.hero-left');
  const heroImg  = document.querySelector('.hero-img-wrap');
  const hero     = document.getElementById('hero');

  if (!heroLeft || !heroImg || !hero) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;

    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const heroH = hero.offsetHeight;

      // Only apply within the hero viewport
      if (sy < heroH) {
        heroLeft.style.transform = `translateY(${sy * 0.12}px)`;
        heroImg.style.transform  = `translateY(${sy * 0.06}px)`;
      }

      ticking = false;
    });

    ticking = true;
  }, { passive: true });
})();


/* ============================================================
   6. CONTACT FORM — Validation + Submit feedback
   No real backend needed for portfolio. You can wire this
   to Formspree, EmailJS, or your own API later.
============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  function showError(inputId, message) {
    const errorEl = document.getElementById(inputId + 'Error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  function clearError(inputId) {
    const errorEl = document.getElementById(inputId + 'Error');
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live validation: clear errors as user types
  ['name', 'email', 'project'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => clearError(id));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const project = document.getElementById('project').value.trim();
    const budget  = document.getElementById('budget').value.trim();

    // Validate name
    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    }

    // Validate email
    if (!email) {
      showError('email', 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    // Validate project brief
    if (!project) {
      showError('project', 'Please tell me about your project.');
      valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';

    try {
      const response = await fetch('https://formspree.io/f/xqegggne', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, project, budget }),
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Unable to submit contact form:', error);
      submitBtn.querySelector('.btn-text').textContent = 'Try again';
      submitBtn.disabled = false;
      successMsg.textContent = 'Unable to send right now. Please email me directly.';
      successMsg.classList.add('visible');
      return;
    }

    submitBtn.querySelector('.btn-text').textContent = 'Sent ✓';
    submitBtn.style.background = 'var(--gold-2)';
    successMsg.classList.add('visible');
    form.reset();

    // Reset button after a few seconds
    setTimeout(() => {
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
      successMsg.textContent = "Message sent! I'll reply within 24 hours.";
      successMsg.classList.remove('visible');
    }, 4000);
  });
})();


/* ============================================================
   7. SMOOTH ANCHOR SCROLL
   Handles click on nav links and any <a href="#..."> links
   with an offset for the fixed nav bar.
============================================================ */
(function initSmoothScroll() {
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
})();


/* ============================================================
   8. PROJECT CARD — Tilt effect on hover (subtle 3D feel)
============================================================ */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;

      // Max tilt: 4 degrees
      const tiltX = ((y - cy) / cy) * 4;
      const tiltY = ((x - cx) / cx) * -4;

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'background 0.4s, transform 0.1s';
    });
  });
})();


/* ============================================================
   9. COUNTER ANIMATION — Stats numbers count up
============================================================ */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el  = entry.target;
      const raw = el.textContent;             // e.g. "3+" or "6+"
      const num = parseInt(raw, 10);          // extract number
      const suffix = raw.replace(/[0-9]/g, ''); // extract suffix like "+"

      let start = 0;
      const duration = 1200; // ms
      const startTime = performance.now();

      function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * num);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach((el) => observer.observe(el));
})();

/* ============================================================
   11. THEME TOGGLE — Dark / Light mode
   Persists preference in localStorage.
   Defaults to light (matches your existing palette).
============================================================ */
(function initThemeToggle() {
  const STORAGE_KEY = 'portfolio-theme';
  const html = document.documentElement;

  const toggleBtns = [
    document.getElementById('themeToggle'),
    document.getElementById('themeToggleMobile'),
  ].filter(Boolean);

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    const icon = theme === 'dark' ? '☽' : '☀';
    toggleBtns.forEach((btn) => {
      const iconEl = btn.querySelector('.theme-icon');
      if (iconEl) iconEl.textContent = icon;
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    });
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Load saved preference, default to light
  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);

  toggleBtns.forEach((btn) => btn.addEventListener('click', toggleTheme));
})();