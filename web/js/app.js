/* ============================================================
   LAS DOS TRINIDADES — Main Application JS
   ============================================================
   Hash-based routing, theme toggle, progress bar,
   sidebar navigation, scroll spy for TOC, expandable notes.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Page Registry ---- */
  /* Content base path - points to the markdown source files */
  const CONTENT_BASE = '../';

  const PAGES = [
    { id: 'inicio', file: 'pages/00_inicio.html', number: '', title: 'Inicio', short: 'Inicio', isHtml: true },
    { id: 'concilio-nicea', file: '01_el_concilio_de_nicea.md', number: '1', title: 'Lo que dice Nicea literalmente', short: 'El Concilio de Nicea' },
    { id: 'fundamentos-apostolicos', file: '02_fundamentos_apostolicos.md', number: '2', title: 'Anclaje bíblico de Nicea', short: 'Fundamentos Apostólicos' },
    { id: 'fundamento-patristico', file: '03_fundamento_patristico.md', number: '3', title: 'Anclaje patrístico de Nicea', short: 'Fundamento Patrístico' },
    { id: 'capadocios', file: '04_capadocios_y_constantinopla.md', number: '4', title: 'Los Capadocios y el Concilio de Constantinopla', short: 'Capadocios y Constantinopla' },
    { id: 'tipo-teismo', file: '05_que_tipo_de_teismo.md', number: '5', title: '¿Qué tipo de teísmo articula Nicea?', short: '¿Qué tipo de teísmo?' },
    { id: 'antes-agustin', file: '06_antes_de_agustin.md', number: '6', title: 'Entre Constantinopla y Agustín', short: 'Antes de Agustín' },
    { id: 'quien-agustin', file: '07_quien_fue_agustin.md', number: '7', title: 'Quién fue Agustín', short: 'Quién fue Agustín' },
    { id: 'de-persona-a-esencia', file: '08_de_persona_a_esencia.md', number: '8', title: 'El salto agustiniano', short: 'De persona a esencia' },
    { id: 'dos-monoteismos', file: '09_dos_monoteismos.md', number: '9', title: 'Los dos tipos de monoteísmo trinitario', short: 'Dos monoteísmos' },
    { id: 'filioque', file: '10_el_filioque.md', number: '10', title: 'El Filioque', short: 'El Filioque' },
    { id: 'tres-igual-uno', file: '11_tres_es_igual_a_uno.md', number: '11', title: 'El problema lógico de la Trinidad', short: '¿Tres es igual a uno?' },
    { id: 'donde-estamos', file: '12_donde_estamos_hoy.md', number: '12', title: 'Tres tradiciones hoy', short: '¿Dónde estamos hoy?' },
    { id: 'implicaciones', file: '13_implicaciones_practicas.md', number: '13', title: 'Implicaciones para la doctrina de Dios', short: 'Implicaciones prácticas' },
    { id: 'volver-a-nicea', file: '14_volver_a_nicea.md', number: '14', title: 'Volver al texto: una invitación', short: 'Volver a Nicea' },
    { id: 'las-dos-trinidades', file: '15_las_dos_trinidades.md', number: '15', title: 'Las dos Trinidades: armonizaciones', short: 'Las dos Trinidades' },
    { id: 'glosario', file: 'A_glosario.md', number: 'A', title: 'Glosario', short: 'Glosario', appendix: true },
    { id: 'cronologia', file: 'B_cronologia.md', number: 'B', title: 'Cronología', short: 'Cronología', appendix: true },
    { id: 'cuadro-comparativo', file: 'C_cuadro_comparativo.md', number: 'C', title: 'Cuadro comparativo', short: 'Cuadro comparativo', appendix: true },
    { id: 'bibliografia', file: 'D_bibliografia.md', number: 'D', title: 'Bibliografía', short: 'Bibliografía', appendix: true },
    { id: 'faq', file: 'E_faq.md', number: 'E', title: 'FAQ', short: 'FAQ', appendix: true },
    { id: 'quicumque-vult', file: 'F_quicumque_vult.md', number: 'F', title: 'El Quicumque Vult', short: 'Quicumque Vult', appendix: true },
    { id: 'gregorio-nisa-juan', file: 'G_gregorio_nisa_juan_17_3.md', number: 'G', title: 'Gregorio de Nisa y Juan 17:3', short: 'Gregorio y Jn 17:3', appendix: true },
  ];

  /* ---- DOM References ---- */
  const els = {};

  function cacheDom() {
    els.app = document.getElementById('app');
    els.content = document.getElementById('content');
    els.sidebarNav = document.getElementById('sidebar-nav');
    els.progressFill = document.getElementById('progress-fill');
    els.themeToggle = document.getElementById('theme-toggle');
    els.themeIcon = document.getElementById('theme-icon');
    els.mobileToggle = document.getElementById('mobile-menu-toggle');
    els.sidebar = document.getElementById('sidebar');
    els.overlay = document.getElementById('sidebar-overlay');
    els.toc = document.getElementById('toc-list');
  }

  /* ---- Theme Management ---- */
  function initTheme() {
    const saved = localStorage.getItem('ldt-theme');
    const theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ldt-theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    if (els.themeIcon) {
      els.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /* ---- Sidebar Navigation ---- */
  function buildSidebar() {
    if (!els.sidebarNav) return;

    const mainPages = PAGES.filter(p => !p.appendix);
    const appendices = PAGES.filter(p => p.appendix);

    let html = '<div class="sidebar__section-label">Páginas</div>';

    mainPages.forEach(page => {
      const num = page.number ? `<span class="sidebar__link-number">${page.number}</span>` : '';
      html += `<a href="#${page.id}" class="sidebar__link" data-page="${page.id}">${num}${page.short}</a>`;
    });

    html += '<div class="sidebar__section-label" style="margin-top: var(--space-md);">Apéndices</div>';

    appendices.forEach(page => {
      html += `<a href="#${page.id}" class="sidebar__link" data-page="${page.id}">
        <span class="sidebar__link-number">${page.number}</span>${page.short}
      </a>`;
    });

    els.sidebarNav.innerHTML = html;
  }

  function updateActiveLink(pageId) {
    if (!els.sidebarNav) return;
    els.sidebarNav.querySelectorAll('.sidebar__link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
  }

  /* ---- Mobile Sidebar ---- */
  function toggleMobileSidebar() {
    if (!els.sidebar) return;
    const isOpen = els.sidebar.classList.toggle('open');
    els.overlay.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileSidebar() {
    if (!els.sidebar) return;
    els.sidebar.classList.remove('open');
    els.overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  /* ---- Router ---- */
  let currentPageId = null;
  const pageCache = {};

  async function loadPage(pageId) {
    const page = PAGES.find(p => p.id === pageId);
    if (!page) return loadPage('inicio');

    if (currentPageId === pageId) return;
    currentPageId = pageId;

    updateActiveLink(pageId);

    // Show loading state
    els.content.style.opacity = '0';

    try {
      let html;
      if (pageCache[pageId]) {
        html = pageCache[pageId];
      } else {
        const filePath = page.isHtml ? page.file : CONTENT_BASE + page.file;
        const res = await fetch(filePath);
        if (!res.ok) {
          html = `<div class="page-header">
            <span class="page-header__number">Página ${page.number}</span>
            <h1 class="page-header__title">${page.title}</h1>
          </div><p class="text-secondary">Contenido en preparación.</p>`;
        } else {
          const text = await res.text();
          html = page.isHtml ? text : window.MarkdownRenderer.render(text);
        }
        pageCache[pageId] = html;
      }

      els.content.innerHTML = html;

      // If this is the inicio page, inject card navigation
      if (pageId === 'inicio') {
        injectLandingCards();
      }

      // Animate in
      requestAnimationFrame(() => {
        els.content.style.opacity = '1';
        window.scrollTo({ top: 0, behavior: 'instant' });
      });

      // Build TOC from h2/h3 elements
      buildToc();

      // Initialize scroll spy
      initScrollSpy();

      // Initialize expandable notes
      initExpandables();

      // Add prev/next navigation
      buildPageNav(page);

      // Close mobile sidebar
      closeMobileSidebar();

      // Update document title
      document.title = page.number
        ? `${page.number}. ${page.title} — Las dos Trinidades`
        : `${page.title} — Las dos Trinidades`;

    } catch (err) {
      console.error('Error loading page:', err);
      els.content.innerHTML = '<p>Error al cargar la página.</p>';
      els.content.style.opacity = '1';
    }
  }

  function handleRoute() {
    const hash = window.location.hash.slice(1) || 'inicio';
    loadPage(hash);
  }

  /* ---- Landing Card Injection for Inicio ---- */
  function injectLandingCards() {
    const cardData = PAGES.filter(p => p.id !== 'inicio' && !p.appendix).map(p => ({
      id: p.id, num: String(p.number).padStart(2, '0'), title: p.short, desc: p.title,
      pivot: ['antes-agustin','quien-agustin','de-persona-a-esencia','dos-monoteismos'].includes(p.id)
    }));
    const appendices = PAGES.filter(p => p.appendix);

    // Build CTA button - insert after h1
    const h1 = els.content.querySelector('h1');
    if (h1) {
      const cta = document.createElement('div');
      cta.style.cssText = 'text-align:center; margin: var(--space-lg) 0;';
      cta.innerHTML = `<a href="#concilio-nicea" class="landing__cta" style="display:inline-block; padding: 0.75rem 2rem; background: var(--accent); color: var(--bg-primary); border-radius: 8px; font-weight: 600; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 20px rgba(201,168,76,0.3)'" onmouseout="this.style.transform='';this.style.boxShadow=''">Comenzar lectura →</a>`;
      h1.parentNode.insertBefore(cta, h1.nextSibling.nextSibling);
    }

    // Find the "Estructura" heading and replace its section content
    const allH2 = els.content.querySelectorAll('h2');
    let estructuraH2 = null;
    allH2.forEach(h => { if (h.textContent.includes('Estructura')) estructuraH2 = h; });

    if (!estructuraH2) return;

    // Remove everything between "Estructura" h2 and the next h2 (or next hr)
    const toRemove = [];
    let sibling = estructuraH2.nextElementSibling;
    while (sibling && sibling.tagName !== 'H2') {
      toRemove.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    toRemove.forEach(el => el.remove());

    // Build card HTML
    let cardsHtml = `<div class="landing__pages" style="margin-top: var(--space-lg);">
      <div class="landing__pages-title" style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: var(--space-md);">15 páginas · Una línea argumentativa</div>
      <div class="landing__index" style="display:flex; flex-direction:column; gap:2px;">`;

    cardData.forEach(c => {
      const pivotStyle = c.pivot ? 'border-left: 3px solid var(--accent);' : '';
      cardsHtml += `<a href="#${c.id}" class="landing__index-item" style="display:flex; align-items:center; gap: var(--space-md); padding: var(--space-sm) var(--space-md); border-radius: 8px; text-decoration:none; color: var(--text-primary); transition: background 0.2s; ${pivotStyle}" onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background=''">
        <span style="font-size: 0.8rem; font-weight:700; color: var(--accent); min-width:2rem; font-family: var(--font-mono, monospace);">${c.num}</span>
        <div style="flex:1;">
          <span style="font-weight:600; display:block;">${c.title}</span>
          <span style="font-size:0.85rem; color: var(--text-secondary); display:block;">${c.desc}</span>
        </div>
        <span style="color: var(--text-tertiary); font-size:1.2rem;">→</span>
      </a>`;
    });

    cardsHtml += `</div></div>`;

    // Appendices grid
    cardsHtml += `<div style="margin-top: var(--space-xl);">
      <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: var(--space-md);">Apéndices</div>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-sm);">`;

    appendices.forEach(a => {
      cardsHtml += `<a href="#${a.id}" style="display:block; padding: var(--space-sm) var(--space-md); border-radius: 8px; border: 1px solid var(--border-primary); text-decoration:none; color: var(--text-secondary); font-size:0.9rem; transition: border-color 0.2s, color 0.2s;" onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--text-primary)'" onmouseout="this.style.borderColor='var(--border-primary)';this.style.color='var(--text-secondary)'">${a.number}. ${a.short}</a>`;
    });

    cardsHtml += `</div></div><hr style="margin-top: var(--space-xl);">`;

    // Insert after Estructura heading
    estructuraH2.insertAdjacentHTML('afterend', cardsHtml);
  }

  /* ---- Table of Contents (scroll spy) ---- */
  function buildToc() {
    if (!els.toc) return;

    const headings = els.content.querySelectorAll('h2[id], h3[id]');
    if (headings.length === 0) {
      els.toc.closest('.toc').style.display = 'none';
      return;
    }

    els.toc.closest('.toc').style.display = '';

    let html = '';
    headings.forEach(h => {
      const level = h.tagName === 'H3' ? ' style="padding-left: var(--space-md);"' : '';
      html += `<li class="toc__item"${level}>
        <a data-scroll-to="${h.id}" class="toc__link" style="cursor:pointer;">${h.textContent}</a>
      </li>`;
    });

    els.toc.innerHTML = html;

    // Attach scroll handlers to TOC links
    els.toc.querySelectorAll('.toc__link[data-scroll-to]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-scroll-to');
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  let tocObserver = null;

  function initScrollSpy() {
    if (tocObserver) tocObserver.disconnect();

    tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          els.toc.querySelectorAll('.toc__link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    els.content.querySelectorAll('h2[id], h3[id]').forEach(h => {
      tocObserver.observe(h);
    });
  }

  /* ---- Progress Bar ---- */
  function updateProgress() {
    if (!els.progressFill) return;
    const winH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    const pct = Math.min((scrolled / (docH - winH)) * 100, 100);
    els.progressFill.style.width = pct + '%';
  }

  /* ---- Expandable Notes ---- */
  function initExpandables() {
    els.content.querySelectorAll('.expandable__toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.expandable');
        parent.classList.toggle('open');
      });
    });
  }

  /* ---- Page Navigation (Prev / Next) ---- */
  function buildPageNav(currentPage) {
    const idx = PAGES.findIndex(p => p.id === currentPage.id);
    const prev = idx > 0 ? PAGES[idx - 1] : null;
    const next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

    // Don't show on landing page
    if (currentPage.id === 'inicio') return;

    let navHtml = '<nav class="page-nav">';

    if (prev) {
      const label = prev.number ? `${prev.number}. ${prev.short}` : prev.short;
      navHtml += `<a href="#${prev.id}" class="page-nav__link page-nav__link--prev">
        <span class="page-nav__direction">← Anterior</span>
        <span class="page-nav__title">${label}</span>
      </a>`;
    } else {
      navHtml += '<div class="page-nav__spacer"></div>';
    }

    if (next) {
      const label = next.number ? `${next.number}. ${next.short}` : next.short;
      navHtml += `<a href="#${next.id}" class="page-nav__link page-nav__link--next">
        <span class="page-nav__direction">Siguiente →</span>
        <span class="page-nav__title">${label}</span>
      </a>`;
    } else {
      navHtml += '<div class="page-nav__spacer"></div>';
    }

    navHtml += '</nav>';
    els.content.insertAdjacentHTML('beforeend', navHtml);
  }

  /* ---- Page Navigation Helpers ---- */
  window.LDT = {
    getPageIndex: function (id) {
      return PAGES.findIndex(p => p.id === id);
    },
    getPrevPage: function () {
      const idx = this.getPageIndex(currentPageId);
      return idx > 0 ? PAGES[idx - 1] : null;
    },
    getNextPage: function () {
      const idx = this.getPageIndex(currentPageId);
      return idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
    },
    PAGES: PAGES
  };

  /* ---- Init ---- */
  function init() {
    cacheDom();
    initTheme();
    buildSidebar();

    // Event listeners
    if (els.themeToggle) els.themeToggle.addEventListener('click', toggleTheme);
    if (els.mobileToggle) els.mobileToggle.addEventListener('click', toggleMobileSidebar);
    if (els.overlay) els.overlay.addEventListener('click', closeMobileSidebar);

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('scroll', () => {
      updateProgress();
    }, { passive: true });

    // Initial route
    handleRoute();

    // Start scroll spy after first page loads
    const tocCheck = setInterval(() => {
      if (els.content.querySelector('h2[id]')) {
        initScrollSpy();
        clearInterval(tocCheck);
      }
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
