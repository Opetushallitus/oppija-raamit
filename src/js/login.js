import {setStateLoggedIn, setStateLoggedOut} from './dom';

export function login() {
  if (Service.login === 'function') {
    const promise = Service.login();
    promise.then(user => {
      setStateLoggedIn(user);
    }).catch(error => {
      // Show error message to user?
    })
  } else {
    throw new Error('Service is missing a login function.');
  }
}

export function logout() {
  if (Service.logout === 'function') {
    const promise = Service.logout();
    promise.then(() => {
      setStateLoggedOut();
    }).catch(error => {
      // Show error message to user?
    });
  } else {
    throw new Error('Service is missing a logout function.');
  }
}

export function getUser() {
  if (Service.getUser === 'function') {
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
