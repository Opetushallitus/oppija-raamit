import {setStateLoggedIn, setStateLoggedOut} from './dom';

// run on initial load
export function updateLoginSection() {
  const shibbolethUrl = '/oppija-raamit/shibbolethcheck';

  fetch(shibbolethUrl)
    .then(() => {
      // TODO: check if the user has a valid session
      let loggedIn = localStorage.getItem('shibboleth_loggedIn') === 'true';
      setStateLoggedOut();
    });
}

export function login() {

  // Call service login
  const user = Service.login();
  // Update dom (if we still can)
  setStateLoggedIn(user);

}

export function logout() {

  // Call service logout
  Service.logout();
  // Update dom (if we still can)
  setStateLoggedOut();

}
