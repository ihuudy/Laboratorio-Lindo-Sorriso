/* ==========================================================================
   FAQ — accordion acessível
   - Uma pergunta aberta por vez (abrir uma fecha a anterior).
   - aria-expanded / aria-controls corretamente sincronizados.
   - Abertura/fechamento via grid-template-rows (transição suave, sem JS
     medindo altura manualmente).
   ========================================================================== */

export function initializeFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
