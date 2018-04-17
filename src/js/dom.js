export function hideElement(id) {
  document.getElementById(id).style.display = 'none';
}

export function showElement(id) {
  document.getElementById(id).style.display = 'block';
}

export function setElementVisibility(id, visible) {
  let element = document.getElementById(id);
  visible ? element.style.display = 'inline-block' : element.style.display = 'none';
}

export function addClass(id, className) {
  getElement(id).classList.add(className);
}

export function getElement(id) {
  return document.getElementById(id);
}
