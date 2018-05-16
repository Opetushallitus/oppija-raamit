import {setStateLoggedIn, setStateLoggedOut} from './dom';

export function login() {
  if (typeof Service.login === 'function') {
    const user = Service.login();
    setStateLoggedIn(user);
  } else {
    throw new Error('Service is missing a login function.');
  }
}

export function logout() {
  if (typeof Service.logout === 'function') {
    Service.logout();
    setStateLoggedOut();
  } else {
    throw new Error('Service is missing a logout function.');
  }
}

export function getUser() {
  if (typeof Service.getUser === 'function') {
    const promise = Service.getUser();
    promise.then(user => {
      setStateLoggedIn(user);
    }).catch(() => {
      setStateLoggedOut();
    });
  } else {
    throw new Error('Service is missing a getUser function.');
  }
}
