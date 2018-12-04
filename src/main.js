import './polyfills';
import {getHeader, getFooter} from './js/templates';
import {parseHtml} from './js/utils';
import {updateDom, toggleMobileMenu, toggleOverflowMenu} from './js/dom';
import {checkAcceptCookie, setAcceptCookie} from './js/cookie';
import {getLanguage, changeLanguage} from './js/language';
import {login, logout, getUser} from './js/login';
import browserUpdate from 'browser-update';

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

    var updateText;
    if (getLanguage() === 'fi') {
      updateText = 'Selaimesi {brow_name} on vanhentunut. Päivitä selaimesi turvallisempaan, nopeampaan ja helppokäyttöisempään. <a{up_but}>Päivitä selain</a><a{ignore_but}>Hylkää</a>'
    } else if (getLanguage() === 'sv') {
      updateText = 'Din webbläsare {brow_name} är föråldrad. Uppdatera din webbläsare för mer säkerhet, snabbhet och den bästa upplevelsen. <a{up_but}>Uppdatera webbläsaren</a><a{ignore_but}>Ignorera</a>'
    } else {
      updateText = 'Your web browser {brow_name}, is out of date. Update your browser for more security, speed and the best experience. <a{up_but}>Update browser</a><a{ignore_but}>Ignore</a>'
    }
    browserUpdate({
      required:{
        e:-4,
        f:-3,
        o:-3,
        s:-1,
        c:-3
      },
      insecure:true,
      unsupported:true,
      text:updateText,
      no_permanent_hide:true,
      api:2018.12
    });

    });

})();

// Global functions
window.Raamit = {
  changeLanguage: changeLanguage,
  login: login,
  logout: logout,
  toggleMobileMenu: toggleMobileMenu,
  toggleOverflowMenu: toggleOverflowMenu,
  setAcceptCookie: setAcceptCookie,
  getLanguage: getLanguage
};
