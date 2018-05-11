import {getHeader, getFooter} from './js/templates';
import {parseHtml} from './js/utils';
import {updateTopNav, toggleMenu} from './js/dom';
import {checkAcceptCookie, setAcceptCookie} from './js/cookie';
import {getLanguage, updateActiveLanguage, changeLanguage} from './js/language';
import {login, logout, getUser} from './js/login';

import './styles/main.css';

(function applyRaamit() {
  const lang = getLanguage();

  const header = getHeader(lang);
  const footer = getFooter(lang);

  Promise.all([header, footer]).then(function(values) {
    let body = document.body;
    body.appendChild(parseHtml(values[1]));
    body.insertBefore(parseHtml(values[0]), body.firstChild);

    getUser();
    updateTopNav(lang);
    updateActiveLanguage(lang);
    checkAcceptCookie();
  });

})();

// Global functions
window.Raamit = {
  changeLanguage: changeLanguage,
  login: login,
  logout: logout,
  toggleMenu: toggleMenu,
  setAcceptCookie: setAcceptCookie
};
