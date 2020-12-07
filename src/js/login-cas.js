import {setStateLoggedIn} from './dom';
import {getLanguage} from './language';


export function login(valtuudet) {
  const omaOpintopolkuService = `${window.location.protocol}//${window.location.hostname}/oma-opintopolku`;
  window.location.replace(`/cas-oppija/login?valtuudet=${valtuudet}&locale=${getLanguage()}&service=${omaOpintopolkuService}`);
}

export function logout() {
  window.location.replace('/cas-oppija/logout');
}

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
  console.log("Setting user attributes ", attributes)
  return {
    impersonator: attributes.impersonatorPersonName,
    name: attributes.personName
  };
}
