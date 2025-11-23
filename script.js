// ===================================
// Bruno Arpini Portfolio - Interactive Script
// ===================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

// ===================================
// Internationalization (i18n)
// ===================================

const translations = {
  'en': {
    'nav-home': 'Home',
    'nav-about': 'About',
    'nav-research': 'Research',
    'nav-publications': 'Publications',
    'nav-experience': 'Experience',
    'nav-contact': 'Contact',
    'hero-label': 'Chemical Research & Innovation',
    'hero-subtitle': 'Ph.D. in Chemistry | Postdoctoral Researcher at INT | Specialist in Catalysis and CO₂ Conversion',
    'role-researcher-title': 'Researcher',
    'role-researcher-desc': 'Specialized in heterogeneous catalysis, hybrid nanomaterials and green chemistry for sustainable CO₂ conversion',
    'role-chemist-title': 'Chemist',
    'role-chemist-desc': 'Development of innovative catalysts for hydrogenation, methanation and methanol synthesis from CO₂',
    'about-label': 'Who I Am',
    'about-title': 'About Me',
    'about-text-1': 'Ph.D. in Chemistry from <span class="accent-text">Institute of Chemistry, USP</span> (São Paulo, Brazil), specializing in nanomaterials and catalysis. Currently working as a Postdoctoral Researcher at <span class="accent-text">University of Southern California (USC)</span> in Los Angeles, CA, USA.',
    'about-text-2': 'My research focuses on the design and development of <span class="accent-text">hybrid nickel and carbon catalysts</span> for applications in hydrogenation reactions, CO₂ conversion, and sustainable fuel synthesis. I have experience in nanomaterial synthesis, advanced characterization, and green chemistry applications.',
    'about-text-3': 'With a solid academic background including a Master\'s in Organic Chemistry from UFES and a Bachelor\'s in Chemistry, I have developed expertise in heterogeneous catalysis, surface chemistry, and energy conversion processes.',
    'stat-publications': 'Publications',
    'stat-citations': 'Citations',
    'stat-h-factor': 'H-Factor',
    'stat-postdocs': 'Post-docs',
    'research-label': 'Expertise',
    'research-title': 'Research Areas',
    'res-cat-title': 'Catalysis',
    'res-cat-desc': 'Development of heterogeneous catalysts for hydrogenation, methanation, RWGS (Reverse Water-Gas Shift) and Fischer-Tropsch reactions',
    'res-nano-title': 'Nanomaterials',
    'res-nano-desc': 'Synthesis and characterization of metal nanoparticles, carbides, nitrogen-doped materials and organic-inorganic hybrid structures',
    'res-green-title': 'Green Chemistry',
    'res-green-desc': 'Sustainable catalytic processes, CO₂ conversion into value-added chemicals and biofuel development',
    'res-co2-title': 'CO₂ Conversion',
    'res-co2-desc': 'CO₂ hydrogenation for methanol, CO and hydrocarbon production using nickel, copper and plasmonic nanoparticle catalysts',
    'pub-label': 'Scientific Output',
    'pub-title': 'Selected Publications',
    'exp-label': 'Career Path',
    'exp-title': 'Professional Experience',
    'exp-int-2025-title': 'Postdoctoral Researcher',
    'exp-int-2025-desc': 'Research in nanomaterials and applied catalysis. FUNCATE Fellow.',
    'exp-usc-title': 'Postdoctoral Researcher',
    'exp-usc-desc': 'Preparation, characterization and application of Cu catalysts for Methanol synthesis from high-pressure CO₂ hydrogenation. Development of TiN plasmonic nanoparticles for CO₂ capture.',
    'exp-ucr-title': 'Postdoctoral Researcher',
    'exp-ucr-desc': 'Synthesis and characterization of oxide catalysts for chemical simulant conversion. Development of Ni catalysts for CH₄ and CO₂ conversion.',
    'exp-int-2022-title': 'Postdoctoral Researcher',
    'exp-int-2022-desc': 'Research in nanomaterials and applied catalysis. FUNCATE Fellow.',
    'exp-usp-title': 'Ph.D. in Chemistry',
    'exp-usp-desc': 'Thesis: "Design of hybrid nickel and carbon nanocatalysts and their applications in hydrogenation reactions". Advisor: Prof. Liane Marcia Rossi. FAPESP Fellow.',
    'exp-ufes-master-title': 'Master in Chemistry',
    'exp-ufes-master-desc': 'Dissertation: "Study of biodiesel preparation using different niobium compounds as catalysts in vegetable oil transesterification". Advisor: Prof. Valdemar Lacerda Júnior. CAPES Fellow.',
    'exp-ufes-grad-title': 'Bachelor in Chemistry',
    'exp-ufes-grad-desc': 'Bachelor\'s in Chemistry focused on catalysis and organic synthesis. CNPq Fellow.',
    'skills-label': 'Competencies',
    'skills-title': 'Skills & Languages',
    'skill-idiomas': 'Languages',
    'skill-lang-pt': 'Portuguese (Native)',
    'skill-lang-en': 'English (Fluent)',
    'skill-lang-es': 'Spanish (Intermediate)',
    'skill-techniques': 'Experimental Techniques',
    'skill-tech-1': 'Nanomaterial Synthesis',
    'skill-tech-2': 'Heterogeneous Catalysis',
    'skill-tech-3': 'Advanced Characterization',
    'skill-tech-4': 'IR/Raman Spectroscopy',
    'skill-tech-5': 'Electron Microscopy',
    'skill-tech-6': 'XRD, XPS, BET',
    'skill-research-areas': 'Research Areas',
    'skill-research-1': 'CO₂ Conversion',
    'skill-research-2': 'Catalytic Hydrogenation',
    'skill-research-3': 'Green Chemistry',
    'skill-research-4': 'Hybrid Materials',
    'skill-research-5': 'Nickel Catalysts',
    'skill-research-6': 'Plasmonic Nanoparticles',
    'skill-analytic': 'Analytical Skills',
    'skill-analytic-1': 'Design of Experiments',
    'skill-analytic-2': 'Data Analysis',
    'skill-analytic-3': 'Molecular Modeling',
    'skill-analytic-4': 'Process Optimization',
    'skill-analytic-5': 'Scientific Writing',
    'contact-title': 'Let\'s Collaborate',
    'contact-desc': 'Interested in scientific collaborations, research opportunities or discussions about catalysis and CO₂ conversion? Get in touch!',
    'academic-title': 'Academic Profiles',
    'academic-desc': 'Explore my research, publications, and academic curriculum.',
    'footer-rights': 'All rights reserved.',
    'footer-cv': 'Lattes CV'
  },
  'pt': {
    'nav-home': 'Início',
    'nav-about': 'Sobre',
    'nav-research': 'Pesquisa',
    'nav-publications': 'Publicações',
    'nav-experience': 'Experiência',
    'nav-contact': 'Contato',
    'hero-label': 'Pesquisa Química & Inovação',
    'hero-subtitle': 'Doutor em Química | Pesquisador de Pós-Doutorado no INT | Especialista em Catálise e Conversão de CO₂',
    'role-researcher-title': 'Pesquisador',
    'role-researcher-desc': 'Especializado em catálise heterogênea, nanomateriais híbridos e química verde para conversão sustentável de CO₂',
    'role-chemist-title': 'Químico',
    'role-chemist-desc': 'Desenvolvimento de catalisadores inovadores para hidrogenação, metanação e síntese de metanol a partir de CO₂',
    'about-label': 'Quem Sou',
    'about-title': 'Sobre Mim',
    'about-text-1': 'Doutor em Química pelo <span class="accent-text">Instituto de Química da USP</span> (São Paulo, Brasil), com especialização em nanomateriais e catálise. Atualmente atuando como Pesquisador de Pós-Doutorado na <span class="accent-text">University of Southern California (USC)</span> em Los Angeles, CA, EUA.',
    'about-text-2': 'Minha pesquisa foca no design e desenvolvimento de <span class="accent-text">catalisadores híbridos de níquel e carbono</span> para aplicações em reações de hidrogenação, conversão de CO₂ e síntese de combustíveis sustentáveis. Tenho experiência em síntese de nanomateriais, caracterização avançada e aplicações em química verde.',
    'about-text-3': 'Com uma sólida formação acadêmica incluindo Mestrado em Química Orgânica pela UFES e Bacharelado em Química, desenvolvi expertise em catálise heterogênea, química de superfícies e processos de conversão de energia.',
    'stat-publications': 'Publicações',
    'stat-citations': 'Citações',
    'stat-h-factor': 'Fator H',
    'stat-postdocs': 'Pós-docs',
    'research-label': 'Expertise',
    'research-title': 'Áreas de Pesquisa',
    'res-cat-title': 'Catálise',
    'res-cat-desc': 'Desenvolvimento de catalisadores heterogêneos para reações de hidrogenação, metanação, RWGS (Reverse Water-Gas Shift) e Fischer-Tropsch',
    'res-nano-title': 'Nanomateriais',
    'res-nano-desc': 'Síntese e caracterização de nanopartículas metálicas, carbetos, materiais dopados com nitrogênio e estruturas híbridas orgânico-inorgânicas',
    'res-green-title': 'Química Verde',
    'res-green-desc': 'Processos catalíticos sustentáveis, conversão de CO₂ em produtos químicos de valor agregado e desenvolvimento de biocombustíveis',
    'res-co2-title': 'Conversão de CO₂',
    'res-co2-desc': 'Hidrogenação de CO₂ para metanol, CO e produção de hidrocarbonetos usando catalisadores de níquel, cobre e nanopartículas plasmônicas',
    'pub-label': 'Produção Científica',
    'pub-title': 'Publicações Selecionadas',
    'exp-label': 'Trajetória',
    'exp-title': 'Experiência Profissional',
    'exp-int-2025-title': 'Pesquisador de Pós-Doutorado',
    'exp-int-2025-desc': 'Pesquisa em nanomateriais e catálise aplicada. Bolsista FUNCATE.',
    'exp-usc-title': 'Pesquisador de Pós-Doutorado',
    'exp-usc-desc': 'Preparação, caracterização e aplicação de catalisadores de Cu para síntese de Metanol a partir da hidrogenação de CO₂ em alta pressão. Desenvolvimento de nanopartículas plasmônicas de TiN para captura de CO₂.',
    'exp-ucr-title': 'Pesquisador de Pós-Doutorado',
    'exp-ucr-desc': 'Síntese e caracterização de catalisadores de óxidos para conversão de simulantes químicos. Desenvolvimento de catalisadores de Ni para conversão de CH₄ e CO₂.',
    'exp-int-2022-title': 'Pesquisador de Pós-Doutorado',
    'exp-int-2022-desc': 'Pesquisa em nanomateriais e catálise aplicada. Bolsista FUNCATE.',
    'exp-usp-title': 'Doutor em Química',
    'exp-usp-desc': 'Tese: "Design de nanocatalisadores híbridos de níquel e carbono e suas aplicações em reações de hidrogenação". Orientadora: Profa. Liane Marcia Rossi. Bolsista FAPESP.',
    'exp-ufes-master-title': 'Mestre em Química',
    'exp-ufes-master-desc': 'Dissertação: "Estudo da preparação de biodiesel utilizando diferentes compostos de nióbio como catalisadores na transesterificação de óleos vegetais". Orientador: Prof. Valdemar Lacerda Júnior. Bolsista CAPES.',
    'exp-ufes-grad-title': 'Bacharel em Química',
    'exp-ufes-grad-desc': 'Bacharelado em Química com foco em catálise e síntese orgânica. Bolsista CNPq.',
    'skills-label': 'Competências',
    'skills-title': 'Habilidades & Idiomas',
    'skill-idiomas': 'Idiomas',
    'skill-lang-pt': 'Português (Nativo)',
    'skill-lang-en': 'Inglês (Fluente)',
    'skill-lang-es': 'Espanhol (Intermediário)',
    'skill-techniques': 'Técnicas Experimentais',
    'skill-tech-1': 'Síntese de Nanomateriais',
    'skill-tech-2': 'Catálise Heterogênea',
    'skill-tech-3': 'Caracterização Avançada',
    'skill-tech-4': 'Espectroscopia IV/Raman',
    'skill-tech-5': 'Microscopia Eletrônica',
    'skill-tech-6': 'DRX, XPS, BET',
    'skill-research-areas': 'Áreas de Pesquisa',
    'skill-research-1': 'Conversão de CO₂',
    'skill-research-2': 'Hidrogenação Catalítica',
    'skill-research-3': 'Química Verde',
    'skill-research-4': 'Materiais Híbridos',
    'skill-research-5': 'Catalisadores de Níquel',
    'skill-research-6': 'Nanopartículas Plasmônicas',
    'skill-analytic': 'Habilidades Analíticas',
    'skill-analytic-1': 'Planejamento Experimental',
    'skill-analytic-2': 'Análise de Dados',
    'skill-analytic-3': 'Modelagem Molecular',
    'skill-analytic-4': 'Otimização de Processos',
    'skill-analytic-5': 'Redação Científica',
    'contact-title': 'Vamos Colaborar',
    'contact-desc': 'Interessado em colaborações científicas, oportunidades de pesquisa ou discussões sobre catálise e conversão de CO₂? Entre em contato!',
    'academic-title': 'Perfis Acadêmicos',
    'academic-desc': 'Explore minha pesquisa, publicações e currículo acadêmico.',
    'footer-rights': 'Todos os direitos reservados.',
    'footer-cv': 'Currículo Lattes'
  }
};
function updateLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Save preference
  localStorage.setItem('preferredLanguage', lang);
}

function initLanguage() {
  const savedLang = localStorage.getItem('preferredLanguage');
  const userLang = savedLang || (navigator.language.startsWith('pt') ? 'pt' : 'en');
  updateLanguage(userLang);
}

// Initialize on load (called at the end of file)
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      updateLanguage(lang);
    });
  });
});

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
      e.preventDefault();
      firstFocusableElement?.focus();
    }
  });
});
