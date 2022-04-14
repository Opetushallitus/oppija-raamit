// eslint-disable-next-line no-undef
__webpack_nonce__ = window.nonce
import './polyfills';
import {getModal, getModalNoSdg} from './js/templates';
import {parseHtml} from './js/utils';
import {checkAcceptedCookies, setAcceptedCookies, showCookieText, showModalCookieSettings} from './js/cookie-modal';
import {changeLanguage, getLanguage} from './js/language';

import('./styles/main.css');

(function applyModal() {
  let lang;
  let cookieModal;
  let sdg;
  let domain;

  try {
    lang = document.getElementById('apply-modal').getAttribute('lang');
    if (lang == null) {
      lang = getLanguage();
    }
  } catch (e) {
    lang = getLanguage();
  }

  try {
    domain = getDomain();
    sdg = document.getElementById('apply-modal').getAttribute('sdg');

    if (sdg === "false") {
      cookieModal = getModalNoSdg(domain, lang);
    } else {
      cookieModal = getModal(domain, lang);
    }
  } catch (e) {
    cookieModal = getModal(domain, lang);
    sdg = true;
  }

  function getDomain() {
    if (document.location.hostname === 'localhost') {
      var url = window.location.href
      var urlArray = url.split("/");
      return urlArray[0] + "//" + urlArray[2]
    }

    return document.location.protocol + '//' + document.location.hostname.split('.').slice(-2).join('.');
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
