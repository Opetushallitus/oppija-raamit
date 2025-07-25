// eslint-disable-next-line no-undef
__webpack_nonce__ = window.nonce
import './polyfills';
import { getHeader, getFooter } from './js/templates';
import { registerEventHandlers } from './js/event-handlers';
import { parseHtml } from './js/utils';
import { updateDom, toggleMobileMenu, toggleOverflowMenu } from './js/dom';
import { getLanguage, changeLanguage } from './js/language';
import { login, logout, getUser } from './js/login-cas';
import { applyInlineStyles } from './js/inline-styles';
import browserUpdate from 'browser-update';

import('./styles/main.css');

(function applyRaamit() {
  const lang = getLanguage();

  const casEventHandlers = {
    "header-mobile-menu-button": ["click", function handler() { Raamit.toggleMobileMenu() }],

    "header-button-language-fi": ["click", function handler() { Raamit.changeLanguage('fi') }],
    "header-button-language-sv": ["click", function handler() { Raamit.changeLanguage('sv') }],
    "header-button-language-en": ["click", function handler() { Raamit.changeLanguage('en') }],

    "mobile-header-button-language-fi": ["click", function handler() { Raamit.changeLanguage('fi') }],
    "mobile-header-button-language-sv": ["click", function handler() { Raamit.changeLanguage('sv') }],
    "mobile-header-button-language-en": ["click", function handler() { Raamit.changeLanguage('en') }],

    "header-overflow-menu-button": ["click", function handler() { Raamit.toggleOverflowMenu() }],

    "header-login-button": ["click", function handler() { Raamit.login() }],
    "header-mobile-menu-login": ["click", function handler() { Raamit.login() }],

    "header-overflow-menu-logout-button": ["click", function handler() { Raamit.logout() }],
    "header-mobile-menu-logout-button": ["click", function handler() { Raamit.logout() }]
  }

  var updateText;
  if (getLanguage() === 'fi') {
    updateText = 'Selaimesi {brow_name} on vanhentunut ja Opintopolun toiminnallisuudet eivät toimi. Päivitä selaimesi turvallisempaan, nopeampaan ja helppokäyttöisempään. <a{up_but}>Päivitä selain</a><a{ignore_but}>Hylkää</a>'
  } else if (getLanguage() === 'sv') {
    updateText = 'Din webbläsare {brow_name} är föråldrad och vissa funktioner i Studieinfo fungerar inte. Uppdatera din webbläsare och gör den säkrare, snabbare och tillgängligare. <a{up_but}>Uppdatera webbläsaren</a><a{ignore_but}>Ignorera</a>'
  } else {
    updateText = 'Your web browser {brow_name}, is out of date and Studyinfo’s functions won’t work. Update your browser for more security, speed and the best experience. <a{up_but}>Update browser</a><a{ignore_but}>Ignore</a>'
  }
  browserUpdate({
    required: {
      //e:0, // MS Edge
      i: 12 // Below IE 12
      //f:0, // Firefox
      //o:0, // Opera
      //s:0, // Safari
      //c:0 // Chrome
    },
    //test:true, //Uncomment to show update bar always
    reminder: 0,
    reminderClosed: 0,
    newwindow: true,
    insecure: true,
    unsupported: true,
    text: updateText,
    no_permanent_hide: true,
    api: 2019.05
  });

  const header = getHeader(lang, '-cas');
  const footer = getFooter(lang);

  Promise.all([header, footer]).then(function (values) {
    const body = document.body;
    const footerLocation = document.getElementById('oppija-raamit-footer-here') || body;
    footerLocation.appendChild(parseHtml(values[1]));
    const headerLocation = document.getElementById('oppija-raamit-header-here') || body;
    headerLocation.insertBefore(parseHtml(values[0]), headerLocation.firstChild);

    getUser();
    updateDom(lang);
    // Rekisteröidään raamien event handlerit
    registerEventHandlers(casEventHandlers, "data-cas-event-id")
    // Headerin ja footerin inline stylet
    applyInlineStyles("[data-raamit-component='header-cas']")
    applyInlineStyles("[data-raamit-component='footer']")
  });

})();

// Global functions
window.Raamit = {
  changeLanguage: changeLanguage,
  login: login,
  logout: logout,
  toggleMobileMenu: toggleMobileMenu,
  toggleOverflowMenu: toggleOverflowMenu,
  getLanguage: getLanguage
};
