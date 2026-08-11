/* ==========================================================================
   Scroll Animations
   - Revela elementos [data-reveal] e grupos [data-reveal-group] conforme
     entram na viewport.
   - Usa GSAP + ScrollTrigger quando disponíveis (para easing mais rico);
     cai para IntersectionObserver + CSS transitions como fallback robusto.
   - Não é usado para animações contínuas (isso fica em CSS puro / rotor.js).
   ========================================================================== */

export function initializeScrollAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal], [data-reveal-group]');

  if (reduceMotion || !targets.length) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Só agora "arma" o estado oculto — a partir daqui os observers abaixo
  // são responsáveis por revelar cada elemento.
  targets.forEach((el) => el.classList.add('reveal-armed'));

  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    targets.forEach((el) => {
      window.ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => el.classList.add('is-visible'),
      });
    });
    return;
  }

  // Fallback: IntersectionObserver simples.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
