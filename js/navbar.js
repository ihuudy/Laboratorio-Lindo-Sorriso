/* ==========================================================================
   Navbar
   - Entra suavemente após o loading terminar.
   - Scroll suave para as seções via IDs.
   - Marca o link ativo conforme a seção visível.
   - Menu mobile (hambúrguer).
   ========================================================================== */

export function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks ? Array.from(navLinks.querySelectorAll('a[href^="#"]')) : [];

  if (!navbar) return;

  // Entrada suave da navbar (disparada externamente após loading + pequeno delay,
  // mas garantimos aqui um fallback caso o evento já tenha passado).
  function showNavbar() {
    navbar.classList.add('is-visible');
  }

  document.addEventListener('lindosorriso:navbar-in', showNavbar);

  // Sombra sutil ao rolar a página.
  function onScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll suave (respeitando prefers-reduced-motion) + fecha o menu mobile.
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

      if (navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Menu hambúrguer (mobile).
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Marca o link ativo conforme a seção visível na viewport.
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            links.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === id);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }
}
