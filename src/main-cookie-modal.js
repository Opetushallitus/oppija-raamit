import './polyfills';
import {getModal, getModalNoSdg} from './js/templates';
import {parseHtml} from './js/utils';
import {checkAcceptedCookies, setAcceptedCookies, showCookieText, showModalCookieSettings} from './js/cookie-modal';
import {changeLanguage, getLanguage} from './js/language';

import './styles/main.css';

(function applyModal() {
  let lang;
  let cookieModal;
  let sdg;

  try {
    lang = document.getElementById('apply-modal').getAttribute('lang');
    if (lang == null) {
      lang = getLanguage();
    }
  } catch (e) {
    lang = getLanguage();
  }

  try {
    sdg = document.getElementById('apply-modal').getAttribute('sdg');
    if (sdg === "false") {
      cookieModal = getModalNoSdg(lang);
    } else {
      cookieModal = getModal(lang);
    }
  } catch (e) {
    cookieModal = getModal(lang);
    sdg = true;
  }

  Promise.all([cookieModal]).then(function (values) {
    const body = document.body;
    const modalLocation = document.getElementById('oppija-raamit-modal-here') || body;
    modalLocation.appendChild(parseHtml(values[0]));

    checkAcceptedCookies(sdg);
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
