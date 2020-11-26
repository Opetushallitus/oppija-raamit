import Cookies from 'js-cookie';

export function checkAcceptedCookies() {
  if(!readAcceptedMandatoryCookie()) {
    document.getElementById('cookie-modal-backdrop').style.display = 'block';
  }
}

function readAcceptedMandatoryCookie() {
  let accept = Cookies.get('oph-mandatory-cookies-accepted');
  return !!accept;
}

export function setAcceptedCookies() {
    Cookies.set('oph-mandatory-cookies-accepted', 'true', { expires: 1800, path: '/' });
    document.getElementById('cookie-modal-backdrop').style.display = 'none';
  if (document.getElementById("statisticCookies").checked) {
    Cookies.set('oph-statistic-cookies-accepted', 'true', { expires: 1800, path: '/' });
  }
  if (document.getElementById("marketingCookies").checked) {
    Cookies.set('oph-marketing-cookies-accepted', 'true', { expires: 1800, path: '/' });
  }
}

export function showModalCookieSettings() {
  if (document.getElementById('cookie-modal-settings').style.display === 'none') {
    document.getElementById('cookie-modal-settings').style.display = 'block';
  } else {
    document.getElementById('cookie-modal-settings').style.display = 'none';
  }
}

export function showCookieText() {
  if (document.getElementById('cookie-modal-fulltext').style.display === 'none') {
    document.getElementById('cookie-modal-fulltext').style.display = 'block';
  } else {
    document.getElementById('cookie-modal-fulltext').style.display = 'none';
  }
}
