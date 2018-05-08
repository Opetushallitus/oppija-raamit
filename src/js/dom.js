export function hideElement(id) {
  document.getElementById(id).style.display = 'none';
}

export function showElement(id) {
  document.getElementById(id).style.display = 'inline-block';
}

export function setElementVisibility(id, visible) {
  let element = document.getElementById(id);
  visible ? element.style.display = 'inline-block' : element.style.display = 'none';
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
