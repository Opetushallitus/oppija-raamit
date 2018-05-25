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
  let element = getElement('header-mobile-menu-content');

  if (element.classList.contains('header-menu-open')) {
    element.classList.remove('header-menu-open');
  } else {
    element.classList.add('header-menu-open');
  }
}

export function updateTopNav(lang) {
  if (['fi', 'sv'].includes(lang)) {
    updateActiveTopNavItem();
    updateActiveHeaderItem();
  } else {
    hideElement('top-links-bar');
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

  if (host.includes('omatsivut')) {
    getElement('header-omatsivut-link').appendChild(arrowElement);
  } else if (host.includes('koski')) {
    getElement('header-koski-link').appendChild(arrowElement);
  }
}
