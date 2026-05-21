/* ============================================================
   LAS DOS TRINIDADES : Main Application JS
   ============================================================
   Hash-based routing, theme toggle, progress bar,
   sidebar navigation, scroll spy for TOC, expandable notes.
   ============================================================ */

(function () {
  'use strict';

  /* ---- Page Registry & Comments Configuration ---- */
  /* Content base path - points to the markdown source files */
  const CONTENT_BASE = './';
  const CUSDIS_APP_ID = '598465e9-1182-4ee5-895b-49035799a1fb'; // ID del proyecto de Cusdis.com para moderación


  const PAGES = [
    { id: 'inicio', file: 'pages/00_inicio.html', number: '', title: 'Inicio', short: 'Inicio', isHtml: true },
    { id: 'concilio-nicea', file: '01_el_concilio_de_nicea.md', number: '1', title: 'Lo que dice Nicea literalmente', short: 'El Concilio de Nicea' },
    { id: 'fundamentos-apostolicos', file: '02_fundamentos_apostolicos.md', number: '2', title: 'Anclaje bíblico de Nicea', short: 'Fundamentos Apostólicos' },
    { id: 'fundamento-patristico', file: '03_fundamento_patristico.md', number: '3', title: 'Anclaje patrístico de Nicea', short: 'Fundamento Patrístico' },
    { id: 'capadocios', file: '04_capadocios_y_constantinopla.md', number: '4', title: 'Los Capadocios y el Concilio de Constantinopla', short: 'Capadocios y Constantinopla', inPreparation: true },
    { id: 'tipo-teismo', file: '05_que_tipo_de_teismo.md', number: '5', title: '¿Qué tipo de teísmo articula Nicea?', short: '¿Qué tipo de teísmo?', inPreparation: true },
    { id: 'antes-agustin', file: '06_antes_de_agustin.md', number: '6', title: 'Entre Constantinopla y Agustín', short: 'Antes de Agustín', inPreparation: true },
    { id: 'quien-agustin', file: '07_quien_fue_agustin.md', number: '7', title: 'Quién fue Agustín', short: 'Quién fue Agustín', inPreparation: true },
    { id: 'de-persona-a-esencia', file: '08_de_persona_a_esencia.md', number: '8', title: 'El salto agustiniano', short: 'De persona a esencia', inPreparation: true },
    { id: 'dos-monoteismos', file: '09_dos_monoteismos.md', number: '9', title: 'Los dos tipos de monoteísmo trinitario', short: 'Dos monoteísmos', inPreparation: true },
    { id: 'filioque', file: '10_el_filioque.md', number: '10', title: 'El Filioque', short: 'El Filioque', inPreparation: true },
    { id: 'tres-igual-uno', file: '11_tres_es_igual_a_uno.md', number: '11', title: 'El problema lógico de la Trinidad', short: '¿Tres es igual a uno?', inPreparation: true },
    { id: 'donde-estamos', file: '12_donde_estamos_hoy.md', number: '12', title: 'Tres tradiciones hoy', short: '¿Dónde estamos hoy?', inPreparation: true },
    { id: 'implicaciones', file: '13_implicaciones_practicas.md', number: '13', title: 'Implicaciones para la doctrina de Dios', short: 'Implicaciones prácticas', inPreparation: true },
    { id: 'volver-a-nicea', file: '14_volver_a_nicea.md', number: '14', title: 'Volver al texto: una invitación', short: 'Volver a Nicea', inPreparation: true },
    { id: 'las-dos-trinidades', file: '15_las_dos_trinidades.md', number: '15', title: 'Las dos Trinidades: armonizaciones', short: 'Las dos Trinidades', inPreparation: true },
    { id: 'glosario', file: 'A_glosario.md', number: 'A', title: 'Glosario', short: 'Glosario', appendix: true, inPreparation: true },
    { id: 'cronologia', file: 'B_cronologia.md', number: 'B', title: 'Cronología', short: 'Cronología', appendix: true, inPreparation: true },
    { id: 'cuadro-comparativo', file: 'C_cuadro_comparativo.md', number: 'C', title: 'Cuadro comparativo', short: 'Cuadro comparativo', appendix: true, inPreparation: true },
    { id: 'bibliografia', file: 'D_bibliografia.md', number: 'D', title: 'Bibliografía', short: 'Bibliografía', appendix: true, inPreparation: true },
    { id: 'faq', file: 'E_faq.md', number: 'E', title: 'FAQ', short: 'FAQ', appendix: true, inPreparation: true },
    { id: 'quicumque-vult', file: 'F_quicumque_vult.md', number: 'F', title: 'El Quicumque Vult', short: 'Quicumque Vult', appendix: true, inPreparation: true },
    { id: 'gregorio-nisa-juan', file: 'G_gregorio_nisa_juan_17_3.md', number: 'G', title: 'Gregorio de Nisa y Juan 17:3', short: 'Gregorio y Jn 17:3', appendix: true, inPreparation: true },
  ];

  /* ---- Admin Lock System ---- */
  const ADMIN_PASSWORD = 'nicea325';

  function isAdminUnlocked() {
    return localStorage.getItem('ldt_admin_unlocked') === 'true';
  }

  function unlockAdmin(pwd) {
    if (pwd === ADMIN_PASSWORD) {
      localStorage.setItem('ldt_admin_unlocked', 'true');
      return true;
    }
    return false;
  }

  function lockAdmin() {
    localStorage.removeItem('ldt_admin_unlocked');
  }

  /* ---- DOM References ---- */
  const els = {};

  function cacheDom() {
    els.app = document.getElementById('app');
    els.content = document.getElementById('content');
    els.sidebarNav = document.getElementById('sidebar-nav');
    els.progressFill = document.getElementById('progress-fill');
    els.sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
    els.sidebarThemeIcon = document.getElementById('sidebar-theme-icon');
    els.sidebarThemeLabel = document.querySelector('.sidebar__theme-toggle-label');
    els.mobileToggle = document.getElementById('mobile-menu-toggle');
    els.mobileTocToggle = document.getElementById('mobile-toc-toggle');
    els.sidebar = document.getElementById('sidebar');
    els.overlay = document.getElementById('sidebar-overlay');
    els.toc = document.getElementById('toc-list');
    els.tocContainer = document.querySelector('.toc');
    els.scrollTop = document.getElementById('scroll-top');
  }

  /* ---- Theme Management ---- */
  function updateThemeColorMeta(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#08080A' : '#FDFBF7');
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('ldt-theme');
    const theme = saved || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    updateThemeColorMeta(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ldt-theme', next);
    updateThemeIcon(next);
    updateThemeColorMeta(next);
    updateCommentsTheme(next);
  }

  function updateCommentsTheme(theme) {
    const thread = document.getElementById('cusdis_thread');
    if (thread) {
      thread.innerHTML = '';
      thread.setAttribute('data-theme', theme);
      if (window.CUSDIS && typeof window.CUSDIS.initial === 'function') {
        window.CUSDIS.initial();
      }
    }
  }


  function updateThemeIcon(theme) {
    if (els.sidebarThemeIcon) {
      els.sidebarThemeIcon.textContent = theme === 'dark' ? '☀' : '☽';
    }
    if (els.sidebarThemeLabel) {
      els.sidebarThemeLabel.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
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

    // Close right panel if opening left panel
    if (isOpen && els.tocContainer && els.tocContainer.classList.contains('open')) {
      els.tocContainer.classList.remove('open');
    }
  }

  function toggleMobileToc() {
    if (!els.tocContainer) return;
    const isOpen = els.tocContainer.classList.toggle('open');
    els.overlay.classList.toggle('visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Close left panel if opening right panel
    if (isOpen && els.sidebar && els.sidebar.classList.contains('open')) {
      els.sidebar.classList.remove('open');
    }
  }

  function closeMobileSidebar() {
    if (els.sidebar) els.sidebar.classList.remove('open');
    if (els.tocContainer) els.tocContainer.classList.remove('open');
    if (els.overlay) els.overlay.classList.remove('visible');
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

    // Intercept locked pages if user is not authenticated
    if (page.inPreparation && !isAdminUnlocked()) {
      setTimeout(() => {
        const lockHtml = `
          <div class="lock-screen-container">
            <div class="lock-card" id="lock-card">
              <div class="lock-card__header">
                <div class="lock-card__icon" aria-hidden="true">🔑</div>
                <span class="lock-card__badge">Página en Edición</span>
              </div>
              <h1 class="lock-card__title">Contenido en Preparación</h1>
              <p class="lock-card__desc">
                Esta página no está disponible públicamente en este momento. Si eres el administrador del sitio, ingresa la contraseña para visualizar el contenido.
              </p>
              <form class="lock-card__form" id="lock-form">
                <input type="password" id="lock-password" placeholder="Contraseña..." class="lock-card__input" autocomplete="current-password" required>
                <button type="submit" class="lock-card__button">Desbloquear</button>
              </form>
              <div class="lock-card__error" id="lock-error">Contraseña incorrecta. Intenta nuevamente.</div>
            </div>
          </div>
        `;
        els.content.innerHTML = lockHtml;

        // Hide TOC since the page is locked
        if (els.toc) {
          els.toc.closest('.toc').style.display = 'none';
        }

        // Attach form validation listener
        const form = document.getElementById('lock-form');
        const pwdInput = document.getElementById('lock-password');
        const card = document.getElementById('lock-card');
        const errDiv = document.getElementById('lock-error');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const isOk = unlockAdmin(pwdInput.value);
          if (isOk) {
            // Success transition
            card.classList.add('unlocked-success');
            els.content.style.opacity = '0';
            setTimeout(() => {
              // Clear page cache to load fresh content
              for (const k in pageCache) delete pageCache[k];
              currentPageId = null;
              loadPage(pageId);
            }, 300);
          } else {
            // Shake and error animation
            card.classList.remove('shake');
            void card.offsetWidth; // Trigger reflow to restart animation
            card.classList.add('shake');
            errDiv.classList.add('visible');
            pwdInput.value = '';
            pwdInput.focus();
          }
        });

        // Update document title
        document.title = `Página en Edición : Las dos Trinidades`;

        // Animate in
        requestAnimationFrame(() => {
          els.content.style.opacity = '1';
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      }, 50);

      // Close mobile sidebar
      closeMobileSidebar();
      return;
    }

    try {
      let html;
      if (pageCache[pageId]) {
        html = pageCache[pageId];
      } else {
        const filePath = page.isHtml ? page.file : CONTENT_BASE + page.file;
        const res = await fetch(filePath);
        if (!res.ok) {
          if (isAdminUnlocked()) {
            html = `
              <div class="admin-banner" id="admin-banner">
                <span class="admin-banner__text">
                  <span class="admin-banner__dot"></span>
                  <strong>Modo Administrador</strong> (Archivo no encontrado)
                </span>
                <button class="admin-banner__btn" id="admin-lock-btn">Bloquear de nuevo</button>
              </div>
              <div class="page-header">
                <span class="page-header__number">Página ${page.number}</span>
                <h1 class="page-header__title">${page.title}</h1>
              </div>
              <div class="callout callout--caution">
                <div class="callout__header">Aviso del Administrador</div>
                <div class="callout__body">
                  <p>Estás viendo esto porque tienes sesión de administrador activa. El archivo físico correspondiente (<code>${filePath}</code>) no se encuentra en el servidor o está vacío.</p>
                </div>
              </div>
            `;
          } else {
            html = `<div class="page-header">
              <span class="page-header__number">Página ${page.number}</span>
              <h1 class="page-header__title">${page.title}</h1>
            </div><p class="text-secondary">Contenido en preparación.</p>`;
          }
        } else {
          const text = await res.text();
          let baseHtml = page.isHtml ? text : window.MarkdownRenderer.render(text);
          
          if (page.inPreparation && isAdminUnlocked()) {
            const adminBanner = `
              <div class="admin-banner" id="admin-banner">
                <span class="admin-banner__text">
                  <span class="admin-banner__dot"></span>
                  <strong>Modo Administrador</strong> (Página en edición)
                </span>
                <button class="admin-banner__btn" id="admin-lock-btn">Bloquear de nuevo</button>
              </div>
            `;
            html = adminBanner + baseHtml;
          } else {
            html = baseHtml;
          }
        }
        pageCache[pageId] = html;
      }

      els.content.innerHTML = html;

      // Attach admin banner event listener if present
      const lockBtn = document.getElementById('admin-lock-btn');
      if (lockBtn) {
        lockBtn.addEventListener('click', () => {
          lockAdmin();
          // Clear page cache
          for (const k in pageCache) delete pageCache[k];
          els.content.style.opacity = '0';
          setTimeout(() => {
            currentPageId = null;
            loadPage(pageId);
          }, 250);
        });
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

      // Render comments section (Cusdis)
      renderComments(page.id, page.title);

      // Close mobile sidebar
      closeMobileSidebar();


      // Update document title
      document.title = page.number
        ? `${page.number}. ${page.title} : Las dos Trinidades`
        : `${page.title} : Las dos Trinidades`;

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
      const isH3 = h.tagName === 'H3';
      const className = isH3 ? 'toc__link toc__link--h3' : 'toc__link toc__link--h2';
      html += `<li class="toc__item">
        <a href="#${h.id}" data-scroll-to="${h.id}" class="${className}" style="cursor:pointer;">${h.textContent}</a>
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
        // Close both drawers on mobile when a section is clicked
        closeMobileSidebar();
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
            link.classList.toggle('active', link.getAttribute('data-scroll-to') === id);
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

  /* ---- Comments Widget (Cusdis) ---- */
  function renderComments(pageId, pageTitle) {
    if (pageId === 'inicio') return;

    const existingSection = document.getElementById('comments-section');
    if (existingSection) {
      existingSection.remove();
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    const commentsHtml = `
      <section class="comments-section" id="comments-section">
        <h2 class="comments-section__title">Preguntas y comentarios</h2>
        <p class="comments-section__subtitle">
          Si tienes preguntas, dudas o sugerencias de corrección, puedes formularlas abajo de forma abierta. Tu comentario será visible públicamente una vez moderado.
        </p>
        <div id="cusdis_thread"
          data-host="https://cusdis.com"
          data-app-id="${CUSDIS_APP_ID}"
          data-page-id="${pageId}"
          data-page-url="https://hotheos.github.io/lasdostrinidades/#${pageId}"
          data-page-title="${pageTitle}"
          data-theme="${currentTheme}">
        </div>
      </section>
    `;

    const wrapper = document.getElementById('content-wrapper');
    if (wrapper) {
      wrapper.insertAdjacentHTML('beforeend', commentsHtml);
    } else {
      els.content.insertAdjacentHTML('beforeend', commentsHtml);
    }

    if (window.CUSDIS && typeof window.CUSDIS.initial === 'function') {
      window.CUSDIS.initial();
    } else {
      const scriptId = 'cusdis-script';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cusdis.com/js/cusdis.es.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', () => {
        if (window.CUSDIS && typeof window.CUSDIS.initial === 'function') {
          window.CUSDIS.initial();
        }
      });
    }
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
    if (els.sidebarThemeToggle) els.sidebarThemeToggle.addEventListener('click', toggleTheme);
    if (els.mobileToggle) els.mobileToggle.addEventListener('click', toggleMobileSidebar);
    if (els.mobileTocToggle) els.mobileTocToggle.addEventListener('click', toggleMobileToc);
    if (els.overlay) els.overlay.addEventListener('click', closeMobileSidebar);

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('scroll', () => {
      updateProgress();
      // Show/hide scroll-to-top button
      if (els.scrollTop) {
        els.scrollTop.classList.toggle('visible', window.scrollY > 600);
      }
    }, { passive: true });

    // Cusdis dynamic iframe resizing listener for SPA route changes
    window.addEventListener('message', (e) => {
      try {
        let data = e.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data && data.event === 'resize' && typeof data.data === 'number') {
          const iframe = document.querySelector('#cusdis_thread iframe');
          if (iframe) {
            iframe.style.setProperty('height', `${data.data}px`, 'important');
          }
        }
      } catch (err) {
        // Silencioso ante errores
      }
    });

    // Scroll to top button
    if (els.scrollTop) {
      els.scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

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
