/* ==========================================================================
   Nossos Serviços — filtro funcional por categoria
   - Clique no pill ativa a categoria (estado visual + aria-selected).
   - Categorias/cards que não pertencem ao filtro são ocultados com transição
     suave (opacity + scale) antes do display:none real.
   - "Todos" mostra tudo.
   ========================================================================== */

const TRANSITION_MS = 260;

export function initializeServicesFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const categories = document.querySelectorAll('.service-category');

  if (!pills.length || !categories.length) return;

  function applyFilter(filter) {
    categories.forEach((category) => {
      const matches = filter === 'todos' || category.dataset.category === filter;
      const cards = category.querySelectorAll('.service-card');

      if (matches) {
        category.style.display = '';
        // Força reflow antes de animar entrada.
        requestAnimationFrame(() => {
          category.style.opacity = '0';
          category.style.transform = 'translateY(10px)';
          requestAnimationFrame(() => {
            category.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
          });
        });
        cards.forEach((card) => card.classList.remove('is-hidden'));
      } else {
        category.style.transition = `opacity ${TRANSITION_MS}ms ease, transform ${TRANSITION_MS}ms ease`;
        category.style.opacity = '0';
        category.style.transform = 'translateY(10px)';
        window.setTimeout(() => {
          category.style.display = 'none';
        }, TRANSITION_MS);
      }
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');
      applyFilter(pill.dataset.filter);
    });
  });

  // Estado inicial: "Todos".
  applyFilter('todos');
}
