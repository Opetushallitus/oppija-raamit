import urls from './urls';

export function getHeader(lang) {
  return fetchAsync(urls.header(lang))
}

export function getFooter(lang) {
  return fetchAsync(urls.footer(lang))
}

async function fetchAsync(url) {
  let response = await fetch(url);
  let text = await response.text();
  return text;
}
