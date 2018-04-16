import {showElement, hideElement} from './dom';

export function checkAcceptCookie() {
  if(!readAcceptCookie()) {
    showElement('cookie-notification');
  }
}

function readAcceptCookie() {
  let accept = localStorage.getItem('oph-cookies-accepted');
  return !!accept;
}

function setAcceptCookie() {
  localStorage.setItem('oph-cookies-accepted', 'true');
  hideElement('cookie-notification');
}

window.setAcceptCookie = setAcceptCookie;
