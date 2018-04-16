export function getLanguage() {
  const regexp = /\/wp.?\/(fi|sv|en)/;

  if (document.location.href.indexOf("wp") > 0) {
    const match = document.location.href.match(regexp);
    if (match != null && match.length > 0) {
      return match[1]
    }
  }

  return getLanguageFromHost();
}

export function updateActiveLanguage(lang) {
  const element = document.getElementById(`lang-${lang}`);
  element.classList.add('active-language');
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

function getChangeLangUrl(lang) {
  if (getLanguageFromHost()) {
    return getHostForLang(rootDirectory, lang) + window.url("oppija-raamit.lang.change.suffix", lang)
  } else {
    return window.url("oppija-raamit.lang.change.full", lang)
  }
}

function setLangCookie(lang, cb) {
  $.ajax(getChangeLangUrl(lang)).done(cb).fail(function () {
    goToLanguageRoot(lang)
  })
}

function changeLanguage(language) {
  setLangCookie(language, function () {
    if (document.location.href.indexOf("wp") > 0) {
      var wpPathMatcher = document.location.href.match(/\/wp.?\/(fi|sv|en)\/(.*)/);
      var wpPath = '';
      if (wpPathMatcher != null) {
        wpPath = wpPathMatcher[2]
      } else {
        wpPathMatcher = document.location.href.match(/\/wp.?\/(.*)/);
        if (wpPathMatcher != null && ['fi', 'en', 'sv'].indexOf(wpPathMatcher[1]) < 0) {
          wpPath = wpPathMatcher[1]
        }
      }
      i18n.setLng(language, function () {
        if (language == 'en' || getLanguageFromHost() == 'en') {
          goToLanguageRoot(language); // Switching between fi/sv and en WPs
        } else {
          getTranslation(wpPath)
            .done(function (translation) {
              if (translation.status.toLowerCase() == "ok") {
                window.location.href = translation.translation.url
              } else {
                goToLanguageRoot(language)
              }
            })
            .fail(function () {
              goToLanguageRoot(language)
            })
        }
      })
    } else {
      i18n.setLng(language, function () {
        if (getLanguageFromHost()) {
          document.location.href = getHostForLang(document.location.href, language)
        } else {
          jQuery.cookie(i18n.options.cookieName, language, {expires: 1800, path: '/'});
          document.location.reload()
        }
      })
    }
  })
}

window.changeLanguage = changeLanguage;
