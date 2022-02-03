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

export function updateUsername(name, usingValtuudet) {
  let elements = document.getElementsByClassName('header-identity');
  for (let element of elements) {
    if (usingValtuudet) {
      element.innerHTML = "(Valtuudet) " + name
    } else {
      element.innerHTML = name;
    }
  }
}

function updateImpersonator(impersonator) {
  let elements = document.getElementsByClassName('header-overflow-menu-links-impersonator');
  for (let element of elements) {
    element.innerHTML = impersonator;
  }
}

export function setStateLoggedOut() {
  // Default nav
  hideElement('header-logged-in');
  showElement('header-logged-out');
  closeOverflowMenu()

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

  console.log("Setting states", user)
  if (user.usingValtuudet) {
    getElement("header-omatsivut-link").innerHTML = "<span>Hakemukseni</span>";
    getElement("header-koski-link").innerHTML = "<span>Opintoni<span>";
    getElement("header-valpas-link").innerHTML = "<span>Oppivelvollisuus<span>";
  }
  updateUsername(user.name, user.usingValtuudet);
}

function closeOverflowMenu() {
  getElement('header-overflow-menu-container').classList.remove('header-menu-open');
  getElement('header-overflow-menu-button').classList.remove('header-menu-open');
}

function toggleOpenState(elementPrefix) {
  const openClassName = 'header-menu-open'

  for (let elementName of [`${elementPrefix}-container`, `${elementPrefix}-button`]) {
    let element = getElement(elementName);
    if (element.classList.contains(openClassName)) {
      element.classList.remove(openClassName);
    } else {
      element.classList.add(openClassName);
    }
  }

  const menuButton = getElement(`${elementPrefix}-button`);
  menuButton.setAttribute('aria-expanded', String(menuButton.classList.contains(openClassName)));
}

export function toggleMobileMenu() {
  toggleOpenState('header-mobile-menu')
}

export function toggleOverflowMenu() {
  toggleOpenState('header-overflow-menu')
}

export function updateDom(lang) {
  updateActiveTopNavItem();
  updateActiveHeaderItem();
  updateActiveLanguage(lang);

  if (lang === 'en') {
    hideElement('top-link-eperusteet');
    hideElement('top-link-ehoks');
    hideElement('top-link-mobile-eperusteet');
    hideElement('top-link-mobile-ehoks');
    hideElement('footer-link-feedback');
  }
}

function updateActiveTopNavItem() {
  const className = 'top-link-active';
  const host = window.location.href;

  let element;
  if (host.includes('eperusteet') || host.includes('egrunder')) {
    element = getElement('top-link-eperusteet');
  } else if (host.includes('ehoks') || host.includes('epuk')) {
    element = getElement('top-link-ehoks');
  } else if (['oma-opintopolku', 'koski', 'omatsivut', 'varda'].some(el => host.includes(el))) {
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
  } else if (host.includes('koski') && !host.includes('omadata')) {
    getElement('header-koski-link').appendChild(arrowElement);
    element = getElement('header-mobile-menu-links-koski');
  } else if (host.includes('valpas') && !host.includes('omadata')) {
    getElement('header-valpas-link').appendChild(arrowElement);
    element = getElement('header-mobile-menu-links-koski');
  } else if (host.includes('omadata') || host.includes('oma-opintopolku-loki')) {
    getElement('header-login-section').appendChild(arrowElement);
    element = getElement('header-mobile-menu-links-tietojeni-kaytto');
  } else {
    element = getElement('header-mobile-menu-links-home');
  }

  element.classList.add('header-link-active');
}

function updateActiveLanguage(lang) {
  const elements = document.getElementsByClassName(`header-language-${lang}`);
  for(let element of elements) {
    element.classList.add('header-language-button-active');
  }
}
