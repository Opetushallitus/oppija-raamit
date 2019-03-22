import {setStateLoggedIn, setStateLoggedOut} from './dom';

export function login() {
  if (typeof Service.login === 'function') {
    const user = Service.login();
    setTimeout(() => {
      setStateLoggedIn(user);
    }, 1000);
  } else {
    throw new Error('Service is missing a login function.');
  }
}

export function logout() {
  if (typeof Service.logout === 'function') {
    Service.logout();
    setTimeout(() => {
      setStateLoggedOut();
    }, 1000);
  } else {
    throw new Error('Service is missing a logout function.');
  }
}

export function getUser() {
  if (typeof Service.getUser === 'function') {
    const promise = Service.getUser();
    promise.then(user => {
      setStateLoggedIn(user);
    }).catch(err => {
      console.error(err);
      setStateLoggedOut();
    });
  } else {
    throw new Error('Service is missing a getUser function.');
  }
}
