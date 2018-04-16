import {setElementVisibility} from './dom';

export function updateLoginSection() {
  const shibbolethUrl = '/oppija-raamit/shibbolethcheck';

  fetch(shibbolethUrl)
    .then(() => {
      let loggedIn = localStorage.getItem('shibboleth_loggedIn') === 'true'; // SessionStorage?
      setElementVisibility('header-logged-in', loggedIn);
      setElementVisibility('header-logged-out', !loggedIn);

      /* //TODO: wat
      if (isDemoEnv()) {
        $('.header-login-section').hide();
      }
      */
    }).catch(() => {
      // TODO: what to do here?
    });
}
