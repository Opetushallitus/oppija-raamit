import Cookies from 'js-cookie';

export function checkAcceptedCookies(sdg) {
  if (!readAcceptedMandatoryCookie(sdg)) {
    document.getElementById('cookie-modal-backdrop').style.display = 'block';
  }
}

function readAcceptedMandatoryCookie(sdg) {
  let accept;

  if (sdg) {
    accept = Cookies.get('oph-mandatory-cookies-accepted');
    return !!accept;
  } else {
    let accept = Cookies.get('oph-mandatory-cookies-accepted') || Cookies.get('oph-mandatory-cookies-no-sdg-accepted');
    return !!accept;
  }
}

export function setAcceptedCookies(sdg) {
  if (sdg) {
    Cookies.set('oph-mandatory-cookies-accepted', 'true', {expires: 1800, path: '/'});
    if (document.getElementById("statisticCookies").checked) {
      Cookies.set('oph-statistic-cookies-accepted', 'true', {expires: 1800, path: '/'});
    }
    if (document.getElementById("marketingCookies").checked) {
      Cookies.set('oph-marketing-cookies-accepted', 'true', {expires: 1800, path: '/'});
    }
  } else {
    Cookies.set('oph-mandatory-cookies-no-sdg-accepted', 'true', {expires: 1800, path: '/'});
    if (document.getElementById("statisticCookies").checked) {
      Cookies.set('oph-statistic-cookies-no-sdg-accepted', 'true', {expires: 1800, path: '/'});
    }
    if (document.getElementById("marketingCookies").checked) {
      Cookies.set('oph-marketing-cookies-no-sdg-accepted', 'true', {expires: 1800, path: '/'});
    }
  }
  document.getElementById('cookie-modal-backdrop').style.display = 'none';
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
