/* ==========================================================================
   Loading Screen
   - Aparece somente na primeira entrada do site (por sessão de navegador).
   - Duração aproximada de 2s.
   - Ao terminar, dispara o evento "lindosorriso:loaded" para que a navbar
     e o restante do conteúdo comecem sua sequência de entrada.
   ========================================================================== */

const SESSION_KEY = 'lindosorriso_loaded';

function skipLoading() {
  const screen = document.getElementById('loading-screen');
  if (screen) {
    screen.remove();
  }
  document.body.classList.remove('is-loading');
  document.dispatchEvent(new CustomEvent('lindosorriso:loaded'));
}

function runLoading() {
  const screen = document.getElementById('loading-screen');
  if (!screen) {
    document.dispatchEvent(new CustomEvent('lindosorriso:loaded'));
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealDelay = reduceMotion ? 200 : 900;
  const totalDuration = reduceMotion ? 400 : 2000;

  // Etapa 1 -> Etapa 2: o "blob" recolhe para a forma de onda (CSS cuida da transição via atributo).
  window.setTimeout(() => {
    screen.setAttribute('data-stage', 'reveal');
  }, revealDelay);

  // Etapa 3: remove a tela de loading e sinaliza para o resto do app.
  window.setTimeout(() => {
    screen.style.opacity = '0';
    screen.style.transition = 'opacity 0.4s ease';
    window.setTimeout(() => {
      screen.remove();
      document.body.classList.remove('is-loading');
      sessionStorage.setItem(SESSION_KEY, '1');
      document.dispatchEvent(new CustomEvent('lindosorriso:loaded'));
    }, 400);
  }, totalDuration);
}

export function initializeLoading() {
  const alreadyLoaded = sessionStorage.getItem(SESSION_KEY) === '1';

  if (alreadyLoaded) {
    skipLoading();
    return;
  }

  runLoading();
}
