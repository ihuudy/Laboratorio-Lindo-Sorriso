/* ==========================================================================
   WhatsApp — função centralizada de abertura de conversa
   ========================================================================== */

const WHATSAPP_NUMBER = '5511959766131';

/**
 * Monta a URL do WhatsApp e abre em nova aba.
 * @param {string} message - mensagem já em texto puro (será URL-encoded aqui).
 */
function openWhatsAppRaw(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Abre o WhatsApp com mensagem personalizada para um serviço/modelo específico.
 * @param {string} serviceName - nome do serviço ou modelo Deflex.
 */
export function openWhatsApp(serviceName) {
  const message = `Olá! Gostaria de saber mais sobre o serviço de ${serviceName}.`;
  openWhatsAppRaw(message);
}

/**
 * Abre o WhatsApp com a mensagem genérica de contato do laboratório.
 */
export function openWhatsAppContact() {
  const message = 'Olá! Gostaria de entrar em contato com o Laboratório Lindo Sorriso.';
  openWhatsAppRaw(message);
}

/**
 * Retorna a URL "wa.me" pronta (sem abrir), útil para href de links/nav.
 */
export function getWhatsAppContactUrl() {
  const message = 'Olá! Gostaria de entrar em contato com o Laboratório Lindo Sorriso.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Inicializa todos os botões "Saiba mais" (data-service-name) e os
 * botões genéricos de contato (.js-contact-whatsapp) da página.
 */
export function initializeWhatsAppButtons() {
  document.querySelectorAll('.js-whatsapp[data-service-name]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.dataset.serviceName;
      openWhatsApp(serviceName);
    });
  });

  document.querySelectorAll('.js-contact-whatsapp').forEach((el) => {
    if (el.tagName === 'A') {
      el.setAttribute('href', getWhatsAppContactUrl());
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else {
      el.addEventListener('click', () => openWhatsAppContact());
    }
  });

  // Botão da navbar (link direto, sem popup) — apenas garante URL correta.
  const navWhatsapp = document.getElementById('nav-whatsapp');
  if (navWhatsapp) {
    navWhatsapp.setAttribute('href', getWhatsAppContactUrl());
  }
}
