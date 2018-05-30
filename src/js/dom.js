import {createDomain} from './utils';

export function hideElement(id) {
  document.getElementById(id).style.display = 'none';
}

export function showElement(id) {
  document.getElementById(id).style.display = 'inline-block';
}

export function getElement(id) {
  return document.getElementById(id);
}

export function updateUsername(name) {
  let elements = document.getElementsByClassName('header-identity');
  for (let element of elements) {
    element.innerHTML = name;
  }
}

export function setStateLoggedOut() {
  // Default nav
  hideElement('header-logged-in');
  showElement('header-logged-out');

  // Mobile nav
  hideElement('header-mobile-menu-logged-in');
  hideElement('header-mobile-menu-logout-button');
  showElement('header-mobile-menu-logged-out');
}

export function setStateLoggedIn(user) {
  // Default nav
  hideElement('header-logged-out');
  showElement('header-logged-in');

  // Mobile nav
  showElement('header-mobile-menu-logged-in');
  showElement('header-mobile-menu-logout-button');
  hideElement('header-mobile-menu-logged-out');

  updateUsername(user.name);
}

export function toggleMenu() {
  let element = getElement('header-mobile-menu-container');

  if (element.classList.contains('header-menu-open')) {
    element.classList.remove('header-menu-open');
  } else {
    element.classList.add('header-menu-open');
  }
}

export function updateDom(lang) {
  if (['fi', 'sv'].includes(lang)) {
    updateActiveTopNavItem();
    updateActiveHeaderItem();
  } else {
    hideElement('top-links-bar');
  }

  appendDomainToDynamicLinks(lang);
  updateActiveLanguage(lang);

  if (lang === 'en') {
    hideElement('footer-link-feedback');
  }
}

function updateActiveTopNavItem() {
  const className = 'top-link-active';
  const host = window.location.href;

  let element;
  if (host.includes('eperusteet') || host.includes('egrunder')) {
    element = getElement('top-link-eperusteet');
  } else if (['oma-opintopolku', 'koski', 'omatsivut'].some(el => host.includes(el))) {
    element = getElement('top-link-oma-opintopolku');
  } else {
    element = getElement('top-link-opintopolku');
  }
  element.classList.add(className);
}

function updateActiveHeaderItem() {
  const host = window.location.href;
  const arrowElement = document.createElement('div');
  arrowElement.classList.add('header-arrow-down');

  let element;
  if (host.includes('omatsivut')) {
    getElement('header-omatsivut-link').appendChild(arrowElement);
    element = getElement('header-mobile-menu-links-omatsivut');
  } else if (host.includes('koski')) {
    getElement('header-koski-link').appendChild(arrowElement);
    element = getElement('header-mobile-menu-links-koski');
  } else {
    element = getElement('header-mobile-menu-links-home');
  }

  element.classList.add('header-link-active');
}

function appendDomainToDynamicLinks(lang) {
  const items = document.getElementsByClassName('raamit-dynamic-link');
  for (let i = 0; i < items.length; ++i) {
    const a = items[i];
    a.href = createDomain(lang) + a.pathname;
  }
}

function updateActiveLanguage(lang) {
  const elements = document.getElementsByClassName(`header-language-${lang}`);
  for(let element of elements) {
    element.classList.add('header-language-button-active');
  }
}
