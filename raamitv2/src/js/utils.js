export function parseHtml(html) {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.cloneNode(true);
}
