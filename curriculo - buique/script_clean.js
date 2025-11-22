// ===================================
// Bruno Arpini Portfolio - Interactive Script
// ===================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

mobileMenuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  // Animate icon
  if (navLinks.classList.contains('active')) {
    mobileMenuToggle.textContent = '✕';
  } else {
    mobileMenuToggle.textContent = '☰';
  }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileMenuToggle.textContent = '☰';
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===================================
// Intersection Observer for Animations
// ===================================

const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // For staggered animations
      if (entry.target.classList.contains('research-card') ||
        entry.target.classList.contains('publication-card') ||
        entry.target.classList.contains('skill-category')) {
        const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100;
        entry.target.style.transitionDelay = `${delay}ms`;
      }
    }
  });
}, observerOptions);

// Observe elements for scroll animations
const animatedElements = document.querySelectorAll(
  '.about-text, .about-stats, .research-card, .publication-card, .timeline-item, .skill-category'
);

animatedElements.forEach(el => observer.observe(el));

// ===================================
// Dynamic Stats Counter Animation
// ===================================

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
  statsObserver.observe(stat);
});

function animateCounter(element) {
  const text = element.textContent;
  const hasHFactor = text.includes('H:');

  if (hasHFactor) return; // Skip H-factor animation

  const target = parseInt(text.replace(/\D/g, ''));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = text;
      clearInterval(timer);
    } else {
      const suffix = text.includes('+') ? '+' : '';
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// ===================================
// Parallax Effect for Hero Section
// ===================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');

  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
  }
});

// ===================================
// Publication Cards Hover Effect
// ===================================

document.querySelectorAll('.publication-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateX(15px) scale(1.02)';
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateX(0) scale(1)';
  });
});

// ===================================
// Research Cards Interactive Glow
// ===================================

document.querySelectorAll('.research-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===================================
// Timeline Items Progressive Reveal
// ===================================

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 150);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(item => {
  timelineObserver.observe(item);
});

// ===================================
// Contact Button Ripple Effect
// ===================================

document.querySelectorAll('.contact-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// ===================================
// Keyboard Navigation Enhancement
// ===================================

document.addEventListener('keydown', (e) => {
  // Navigate sections with arrow keys
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const sections = ['home', 'about', 'research', 'publications', 'experience', 'contact'];
    const currentSection = sections.find(id => {
      const element = document.getElementById(id);
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight / 2;
    });

    if (currentSection) {
      const currentIndex = sections.indexOf(currentSection);
      const nextIndex = e.key === 'ArrowDown'
        ? Math.min(currentIndex + 1, sections.length - 1)
        : Math.max(currentIndex - 1, 0);

      const nextSection = document.getElementById(sections[nextIndex]);
      if (nextSection) {
        e.preventDefault();
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
});

// ===================================
// Performance: Lazy Load Images (if any added)
// ===================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===================================
// Active Navigation Link Highlighting
// ===================================

const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink?.classList.add('active');
    } else {
      navLink?.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Console Easter Egg
// ===================================

console.log('%c🔬 Bruno Henrique Arpini', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cChemical Researcher | Catalyst Specialist', 'font-size: 14px; color: #00d4ff;');
console.log('%cInterested in collaboration? Let\'s talk about catalysis and CO₂ conversion!', 'font-size: 12px; color: #b0b0b0;');
console.log('%cLattes: http://lattes.cnpq.br/1022964934574626', 'font-size: 12px; color: #00ff88;');

// ===================================
// Initialize on Load
// ===================================

window.addEventListener('load', () => {
  // Add loaded class to body for any CSS transitions
  document.body.classList.add('loaded');

  // Trigger initial highlight
  highlightNavigation();

  // Log performance metrics
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`%c⚡ Page loaded in ${pageLoadTime}ms`, 'color: #00ff88; font-weight: bold;');
  }
});

// ===================================
// Accessibility: Skip to Content
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Focus management for keyboard users
  const firstFocusableElement = document.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');

        if (heroContent && scrolled < window.innerHeight) {
          heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
