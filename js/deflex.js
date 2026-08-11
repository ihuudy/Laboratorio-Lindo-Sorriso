/* ==========================================================================
   Linha Deflex — carrossel com 3 modelos (Classic, Acrilato, Supra)
   - Mostra apenas um modelo por vez.
   - Setas anterior/próximo com loop infinito.
   - Autoplay a cada 5s, reiniciado sempre que o usuário interage.
   - Transição suave (fade + translate) na troca de conteúdo.
   - Botão "Saiba mais" abre WhatsApp com mensagem específica do modelo atual.
   ========================================================================== */

const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_MS = 320;

const MODELS = [
  {
    key: 'classic',
    name: 'Classic SR',
    whatsappName: 'Deflex Classic',
    bottle: 'assets/images/deflex/cartucho-classic.png',
    logo: 'assets/images/deflex/logo-classic.png',
    modelo: 'assets/images/deflex/modelo-classic.png',
    features: [
      { title: 'Equilíbrio ótimo entre flexibilidade e rigidez', text: 'Recomendado para todo tipo de desenhos em próteses parciais.' },
      { title: 'Apoios oclusais', text: 'Confeccionados com o próprio material.' },
      { title: 'Alto brilho e translucidez', text: '' },
    ],
  },
  {
    key: 'acrilato',
    name: 'Acrilato FD',
    whatsappName: 'Deflex Acrilato',
    bottle: 'assets/images/deflex/cartucho-acrilato.png',
    logo: 'assets/images/deflex/logo-acrilato.png',
    modelo: 'assets/images/deflex/modelo-acrilato.png',
    features: [
      { title: 'Próteses Totais', text: 'Mais resistentes e leves que as de acrílico convencional.' },
      { title: 'Livres de monômero', text: '' },
      { title: 'Contração muito baixa', text: '' },
    ],
  },
  {
    key: 'supra',
    name: 'Supra SF',
    whatsappName: 'Deflex Supra',
    bottle: 'assets/images/deflex/cartucho-supra.png',
    logo: 'assets/images/deflex/logo-supra.png',
    modelo: 'assets/images/deflex/modelo-supra.png',
    features: [
      { title: 'Flexibilidade média', text: 'Para casos clínicos que requerem mais elasticidade — dentes pilares divergentes, por exemplo.' },
      { title: 'Alta resistência à fratura', text: 'Permite reduzir a espessura.' },
      { title: 'Extrema fluidez de injeção', text: '' },
    ],
  },
];

export function initializeDeflex() {
  const visual = document.getElementById('deflex-visual');
  const info = document.getElementById('deflex-info');
  const bottleImg = document.getElementById('deflex-bottle');
  const logoImg = document.getElementById('deflex-logo');
  const modelImg = document.getElementById('deflex-model');
  const titleEl = document.getElementById('deflex-title');
  const featuresList = document.getElementById('deflex-features');
  const ctaBtn = document.getElementById('deflex-cta');
  const prevBtn = document.getElementById('deflex-prev');
  const nextBtn = document.getElementById('deflex-next');
  const dots = document.querySelectorAll('.deflex-dot');
  const carousel = document.querySelector('.deflex-carousel');

  if (!visual || !info || !carousel) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let currentIndex = 0;
  let autoplayTimer = null;
  let isTransitioning = false;

  function renderModel(index) {
    const model = MODELS[index];

    bottleImg.src = model.bottle;
    bottleImg.alt = `Frasco Deflex ${model.name}`;
    logoImg.src = model.logo;
    logoImg.alt = `Selo Deflex ${model.name}`;
    modelImg.src = model.modelo;
    modelImg.alt = `Prótese confeccionada com Deflex ${model.name}`;
    titleEl.textContent = model.name;

    featuresList.innerHTML = model.features
      .map(
        (f) => `<li><strong>${f.title}</strong>${f.text ? `<span>${f.text}</span>` : ''}</li>`
      )
      .join('');

    ctaBtn.dataset.serviceName = model.whatsappName;

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function goToIndex(newIndex, { resetAutoplay = true } = {}) {
    if (isTransitioning) return;
    const normalized = (newIndex + MODELS.length) % MODELS.length;
    if (normalized === currentIndex) return;

    isTransitioning = true;

    if (reduceMotion) {
      currentIndex = normalized;
      renderModel(currentIndex);
      isTransitioning = false;
    } else {
      visual.classList.add('is-transitioning');
      info.classList.add('is-transitioning');

      window.setTimeout(() => {
        currentIndex = normalized;
        renderModel(currentIndex);
        visual.classList.remove('is-transitioning');
        info.classList.remove('is-transitioning');
        window.setTimeout(() => {
          isTransitioning = false;
        }, TRANSITION_MS);
      }, TRANSITION_MS);
    }

    if (resetAutoplay) restartAutoplay();
  }

  function next(opts) {
    goToIndex(currentIndex + 1, opts);
  }

  function prev(opts) {
    goToIndex(currentIndex - 1, opts);
  }

  function startAutoplay() {
    if (reduceMotion) return;
    stopAutoplay();
    autoplayTimer = window.setInterval(() => next({ resetAutoplay: false }), AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => prev());
  nextBtn.addEventListener('click', () => next());

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToIndex(Number(dot.dataset.index));
    });
  });

  // O clique do botão "Saiba mais" é tratado de forma centralizada em
  // whatsapp.js (initializeWhatsAppButtons), que lê data-service-name no
  // momento do clique — sempre sincronizado pelo renderModel() acima.

  // Pausa o autoplay quando o usuário está com o mouse sobre o carrossel,
  // e retoma ao sair — respeita a interação sem cancelar o ciclo.
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  renderModel(0);
  startAutoplay();
}
