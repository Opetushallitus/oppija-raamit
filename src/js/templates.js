import urls from './urls';

export function getHeader(lang, suffix) {
  return fetchAsync(urls.header(lang, suffix || ''))
}
export function getModal(domain, lang) {
  return fetchAsync(domain + urls.cookieModal(lang))
}
export function getModalNoSdg(domain, lang) {
  return fetchAsync(domain + urls.cookieModalNoSdg(lang))
}
export function getFooter(lang) {
  return fetchAsync(urls.footer(lang))
}

async function fetchAsync(url) {
  let response = await fetch(url);
  let text = await response.text();
  return text;
}
