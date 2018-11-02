import './polyfills';
import {getHeader, getFooter} from './js/templates';
import {parseHtml} from './js/utils';
import {updateDom, toggleMobileMenu} from './js/dom';
import {checkAcceptCookie, setAcceptCookie} from './js/cookie';
import {getLanguage, changeLanguage} from './js/language';
import {login, logout, getUser} from './js/login';

import './styles/main.css';

(function applyRaamit() {
  const lang = getLanguage();

  const header = getHeader(lang);
  const footer = getFooter(lang);

  Promise.all([header, footer]).then(function(values) {
    const body = document.body;
    const footerLocation = document.getElementById('oppija-raamit-footer-here') || body;
    footerLocation.appendChild(parseHtml(values[1]));
    const headerLocation = document.getElementById('oppija-raamit-header-here') || body;
    headerLocation.insertBefore(parseHtml(values[0]), headerLocation.firstChild);

    getUser();
    updateDom(lang);

    checkAcceptCookie();
  });

})();

// Global functions
window.Raamit = {
  changeLanguage: changeLanguage,
  login: login,
  logout: logout,
  toggleMobileMenu: toggleMobileMenu,
  setAcceptCookie: setAcceptCookie,
  getLanguage: getLanguage
};
