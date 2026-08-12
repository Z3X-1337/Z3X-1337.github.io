(() => {
  const body = document.body;
  const navToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-menu]');

  const closeMenu = () => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    nav.dataset.open = 'false';
    body.classList.remove('menu-is-open');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      nav.dataset.open = String(!isOpen);
      body.classList.toggle('menu-is-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealNodes = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const readingProgress = document.querySelector('[data-reading-progress]');
  const article = document.querySelector('[data-article]');
  const tocLinks = [...document.querySelectorAll('[data-toc-link]')];
  const sections = [...document.querySelectorAll('[data-section]')];

  if (article && readingProgress) {
    const updateProgress = () => {
      const start = article.offsetTop;
      const height = article.offsetHeight - window.innerHeight;
      const complete = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(height, 1)));
      readingProgress.style.transform = `scaleX(${complete})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  if (tocLinks.length && sections.length && 'IntersectionObserver' in window) {
    const tocObserver = new IntersectionObserver((entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!active) return;
      tocLinks.forEach((link) => {
        link.toggleAttribute('aria-current', link.getAttribute('href') === `#${active.target.id}`);
      });
    }, { rootMargin: '-22% 0px -66% 0px', threshold: 0 });
    sections.forEach((section) => tocObserver.observe(section));
  }

  const searchInput = document.querySelector('[data-research-search]');
  const searchCards = [...document.querySelectorAll('[data-research-card]')];
  const emptyState = document.querySelector('[data-empty-state]');
  const resultCount = document.querySelector('[data-result-count]');

  if (searchInput && searchCards.length) {
    const filterCards = () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      let visible = 0;
      searchCards.forEach((card) => {
        const matches = card.dataset.search?.toLocaleLowerCase().includes(query) ?? true;
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (emptyState) emptyState.hidden = visible !== 0;
      if (resultCount) resultCount.textContent = `${visible} note${visible === 1 ? '' : 's'}`;
    };
    searchInput.addEventListener('input', filterCards);
    filterCards();
  }

  document.querySelectorAll('[data-copy-link]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const original = button.textContent;
        button.textContent = 'Link copied';
        window.setTimeout(() => { button.textContent = original; }, 1800);
      } catch {
        button.textContent = 'Copy unavailable';
      }
    });
  });
})();
