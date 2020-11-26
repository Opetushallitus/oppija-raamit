import './polyfills';
import {getModal} from './js/templates';
import {parseHtml} from './js/utils';
import {updateDom} from './js/dom';
import {checkAcceptedCookies, setAcceptedCookies, showModalCookieSettings, showCookieText} from './js/cookie-modal';
import {getLanguage, changeLanguage} from './js/language';

import './styles/main.css';

(function applyModal() {
  const lang = getLanguage();
  const cookieModal = getModal(lang);

  Promise.all([cookieModal]).then(function(values) {
    const body = document.body;
    const modalLocation = document.getElementById('oppija-raamit-modal-here') || body;
    modalLocation.appendChild(parseHtml(values[0]));

    //updateDom(lang);
    checkAcceptedCookies();
    showModalCookieSettings();
    showCookieText();
  });

})();

// Global functions
window.Modal = {
  changeLanguage: changeLanguage,
  setAcceptedCookies: setAcceptedCookies,
  showModalCookieSettings: showModalCookieSettings,
  showCookieText: showCookieText,
  getLanguage: getLanguage
};
