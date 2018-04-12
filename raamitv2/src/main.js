import {getHeader, getFooter} from './js/templates';
import {parseHtml} from './js/utils';
import {hideElement, addClass, getElement} from './js/dom';
import {checkAcceptCookie} from './js/cookie';
import {getLanguage, updateActiveLanguage} from './js/language';
import {updateLoginSection} from './js/login';

//import '../static/css/fontello.css';
import './styles/main.css';

(function applyRaamit() {
  const lang = getLanguage();

  const header = getHeader(lang);
  const footer = getFooter(lang);

  Promise.all([header, footer]).then(function(values) {
    let body = document.body;
    body.appendChild(parseHtml(values[1]));
    body.insertBefore(parseHtml(values[0]), body.firstChild);

    updateLoginSection();
    updateTopNav(lang);
    updateActiveLanguage(lang);
    checkAcceptCookie();

    updateEnvironmentName();
    // All the environment specific things
    // TODO: They should be already added in compile phase, not runtime
    // TODO: Set test system name already in compile phase
    /*
    if (isDemoEnv()) {
      addDemoWarning();
    }
    */

    updateNavigation();
  });

})();

function updateTopNav(lang) {
  if (['fi', 'sv'].includes(lang)) {
    updateActiveTopNavItem();
  } else {
    hideElement('top-links-bar');
  }
}

function updateActiveTopNavItem() {
  const className = 'top-link-active';
  const host = window.location.host;

  let element;
  if (host.includes('eperusteet') || host.includes('egrunder')) {
    element = getElement('top-link-eperusteet');
  } else if (host.includes('omatsivut')) {
    element = getElement('top-link-omatsivut');
  } else {
    element = getElement('top-link-opintopolku');
  }

  element.classList.add(className);
  document.getElementById('header-active-view-name').innerText = element.innerText;
}

function updateEnvironmentName() {
  document.getElementById("header-system-name").value = "ENVIRONMENT X";
}

function updateNavigation() {
  // TODO: not needed atm
}
