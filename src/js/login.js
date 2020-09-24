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
/*
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
}*/

export function getUser() {
  const service = `${window.location.protocol}//${window.location.hostname}/oppija-raamit`;
  fetch(`/cas-oppija/user/current/attributes?service=${service}`, {
    headers: new Headers({'Caller-Id': '1.2.246.562.10.00000000001.oppija-raamit'}),
    credentials: 'same-origin' })
    .then(okResponseToJson)
    .then(attributesToUser)
    .then(setStateLoggedIn);
}

function okResponseToJson(response) {
  if (!response.ok) {
    throw new Error(response);
  }
  return response.json();
}

function attributesToUser(attributes) {
  return {
    impersonator: attributes.impersonatorPersonName,
    name: attributes.personName
  };
}
