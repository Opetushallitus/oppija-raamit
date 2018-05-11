import Cookies from 'js-cookie';

export function checkAcceptCookie() {
  if(!readAcceptCookie()) {
    document.getElementById('cookie-notification').style.display = 'block';
  }
}

function readAcceptCookie() {
  let accept = Cookies.get('oph-cookies-accepted');
  return !!accept;
}

export function setAcceptCookie() {
  Cookies.set('oph-cookies-accepted', 'true', { expires: 1800, path: '' });
  document.getElementById('cookie-notification').style.display = 'none';
}
