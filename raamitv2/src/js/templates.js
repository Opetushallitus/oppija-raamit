import urls from './urls';

export function getHeader() {
  return fetchAsync(urls.header)
}

export function getFooter() {
  return fetchAsync(urls.footer)
}

async function fetchAsync(url) {
  let response = await fetch(url);
  let text = await response.text();
  return text;
}
