(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const revealItems = document.querySelectorAll('[data-reveal]');
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && revealItems.length && !prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add('is-pending'));
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const searchableItems = document.querySelectorAll('[data-searchable]');
  const emptyState = document.querySelector('[data-empty-state]');
  if (filterInput && searchableItems.length) {
    const filter = () => {
      const query = filterInput.value.trim().toLowerCase();
      let matches = 0;
      searchableItems.forEach((item) => {
        const visible = !query || item.textContent.toLowerCase().includes(query);
        item.hidden = !visible;
        if (visible) matches += 1;
      });
      if (emptyState) emptyState.style.display = matches ? 'none' : 'block';
    };
    filterInput.addEventListener('input', filter);
  }

  const tocLinks = document.querySelectorAll('[data-toc] a');
  const sections = [...document.querySelectorAll('[data-article-section]')];
  if (tocLinks.length && sections.length && 'IntersectionObserver' in window) {
    const tocObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-16% 0px -68% 0px', threshold: 0 });
    sections.forEach((section) => tocObserver.observe(section));
  }
})();
