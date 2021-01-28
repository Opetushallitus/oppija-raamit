import Cookies from 'js-cookie';

function setLangCookies(language) {
  ['lang', 'i18next'].forEach(function (name) {
    Cookies.set(name, language, {expires: 1800, path: '/'});
  });
  console.log("cookies ", document.cookie);
}

export function changeLanguage(language) {
  setLangCookies(language);
  if (typeof Service !== 'undefined' && typeof Service.changeLanguage === 'function') {
    const promise = Service.changeLanguage(language);
    promise.then(() => {
      document.location.reload();
    });
  } else {
    //Quick and dirty, use only on Pallero :)
    console.log("Hardcoded domain lang change");
    if (language === 'fi') {
      document.location.href = 'https://testiopintopolku.fi/oma-opintopolku/'
    } else if (language === 'sv') {
      document.location.href = 'https://testistudieinfo.fi/oma-opintopolku/'
    } else if (language === 'en') {
      document.location.href = 'https://testistudyinfo.fi/oma-opintopolku/'
    } else {
      console.log("invalid lang: " + language);
    }
    //document.location.reload();
  }
}

export function getLanguage() {
  let lang = Cookies.get('lang');
  if (lang) {
    return lang;
  }

  const regexp = /\/wp.?\/(fi|sv|en)/;
  if (document.location.href.indexOf("wp") > 0) {
    const match = document.location.href.match(regexp);
    if (match != null && match.length > 0) {
      return match[1]
    }
  }

  return getLanguageFromHost();
}

function getLanguageFromHost(host) {
  if (!host) { host = document.location.host; }

  let parts = host.split('.');
  if (parts.length < 2) {
    return 'fi';
  }

  let domain = parts[parts.length - 2];
  if (domain.indexOf('opintopolku') > -1) {
    return 'fi';
  } else if (domain.indexOf('studieinfo') > -1) {
    return 'sv';
  } else if (domain.indexOf('studyinfo') > -1) {
    return 'en'
  }
  return 'fi'
}
