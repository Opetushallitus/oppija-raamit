import urls from './urls';

export function getHeader(lang, suffix) {
  return fetchAsync(urls.header(lang, suffix || ''))
}

export function getFooter(lang) {
  return fetchAsync(urls.footer(lang))
}

async function fetchAsync(url) {
  let response = await fetch(url);
  let text = await response.text();
  return text;
}
