import {getHeader, getFooter} from './js/templates';
import {parseHtml} from './js/utils';
import {hideElement, getElement, toggleMenu} from './js/dom';
import {checkAcceptCookie} from './js/cookie';
import {getLanguage, updateActiveLanguage, changeLanguage} from './js/language';
import {login, logout, updateLoginSection} from './js/login';

import './styles/main.css';

(function applyRaamit() {
  const lang = getLanguage();

  const header = getHeader(lang);
  const footer = getFooter(lang);

  Promise.all([header, footer]).then(function(values) {
    let body = document.body;
    body.appendChild(parseHtml(values[1]));
    body.insertBefore(parseHtml(values[0]), body.firstChild);

    updateLoginSection();
    updateTopNav(lang);
    updateActiveLanguage(lang);
    checkAcceptCookie();
    updateNavigation();
  });

})();

// Global functions
window.Raamit = {
  changeLanguage: changeLanguage,
  login: login,
  logout: logout,
  toggleMenu: toggleMenu
};

function updateTopNav(lang) {
  if (['fi', 'sv'].includes(lang)) {
    updateActiveTopNavItem();
  } else {
    hideElement('top-links-bar');
  }
}

function updateActiveTopNavItem() {
  const className = 'top-link-active';
  const host = window.location.host;

  let element;
  if (host.includes('eperusteet') || host.includes('egrunder')) {
    element = getElement('top-link-eperusteet');
  } else if (host.includes('omatsivut')) {
    element = getElement('top-link-omatsivut');
  } else {
    element = getElement('top-link-opintopolku');
  }

  element.classList.add(className);
}

function updateNavigation() {
  // TODO: not needed atm
}
