export function checkAcceptCookie() {
  if(!readAcceptCookie()) {
    document.getElementById('cookie-notification').style.display = 'block';
  }
}

function readAcceptCookie() {
  let accept = localStorage.getItem('oph-cookies-accepted');
  return !!accept;
}

function setAcceptCookie() {
  localStorage.setItem('oph-cookies-accepted', 'true');
  document.getElementById('cookie-notification').style.display = 'none';
}

window.setAcceptCookie = setAcceptCookie;
