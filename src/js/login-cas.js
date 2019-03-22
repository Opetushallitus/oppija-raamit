import {setStateLoggedIn} from './dom';

export function login() {
  window.location.replace('/cas-oppija/login');
}

export function logout() {
  window.location.replace('/cas-oppija/logout');
}

export function getUser() {
  const service = `${window.location.protocol}//${window.location.hostname}/oppija-raamit`;
  fetch(`/cas-oppija/user/current/attributes?service=${service}`, { credentials: 'same-origin' })
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
