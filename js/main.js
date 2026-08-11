/* ==========================================================================
   main.js — ponto de entrada da aplicação
   Sequência:
     1. Loading (só na primeira entrada da sessão)
     2. logo-navegar assume a posição final / navbar aparece suavemente
     3. Conteúdo é revelado progressivamente conforme o scroll
   ========================================================================== */

import { initializeLoading } from './loading.js';
import { initializeNavbar } from './navbar.js';
import { initializeScrollAnimations } from './scrollAnimations.js';
import { initializeServicesFilter } from './services.js';
import { initializeDeflex } from './deflex.js';
import { initializeTrabalhos } from './trabalhos.js';
import { initializeFAQ } from './faq.js';
import { initializeWhatsAppButtons } from './whatsapp.js';

function initializeApp() {
  // Módulos que não dependem da sequência visual de entrada.
  initializeNavbar();
  initializeScrollAnimations();
  initializeServicesFilter();
  initializeDeflex();
  initializeTrabalhos();
  initializeFAQ();
  initializeWhatsAppButtons();

  // Após o loading terminar (ou ser pulado), a navbar recebe o sinal para
  // entrar com sua animação leve (opacity + translateY, ver CSS #navbar).
  document.addEventListener('lindosorriso:loaded', () => {
    window.setTimeout(() => {
      document.dispatchEvent(new CustomEvent('lindosorriso:navbar-in'));
    }, 120);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  initializeLoading();
});
