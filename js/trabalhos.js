/* ==========================================================================
   Nossos Trabalhos — animação de "leque"
   - Estado inicial: imagens agrupadas/sobrepostas.
   - Ao entrar na viewport: cada imagem se move (stagger) até sua posição
     final definida no layout (flex row).
   - Usa GSAP quando disponível para o stagger; fallback em CSS puro.
   - Hover simples (scale) já é tratado via CSS (.leque-item:hover).
   ========================================================================== */

export function initializeTrabalhos() {
  const wrap = document.getElementById('leque-wrap');
  if (!wrap) return;

  const items = Array.from(wrap.querySelectorAll('.leque-item'));
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    items.forEach((item) => item.classList.add('is-open'));
    return;
  }

  // Estado inicial "agrupado": todas as imagens levemente sobrepostas e
  // rotacionadas, simulando um baralho antes de abrir em leque.
  // A classe é adicionada apenas agora (via JS) para que, se o script não
  // rodar por qualquer motivo, as imagens permaneçam visíveis por padrão.
  items.forEach((item, i) => {
    const centerOffset = (i - (items.length - 1) / 2) * -34;
    item.classList.add('leque-grouped');
    item.style.transform = `translateX(${centerOffset}px) rotate(${(i - 2) * 4}deg) scale(0.92)`;
    item.style.transition = 'none';
  });

  function openFan() {
    items.forEach((item, i) => {
      window.setTimeout(() => {
        item.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease';
        item.style.transform = 'translateX(0) rotate(0deg) scale(1)';
        item.classList.add('is-open');
        item.classList.remove('leque-grouped');
      }, i * 110);
    });
  }

  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({
      trigger: wrap,
      start: 'top 80%',
      once: true,
      onEnter: openFan,
    });
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            openFan();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(wrap);
  } else {
    openFan();
  }
}
