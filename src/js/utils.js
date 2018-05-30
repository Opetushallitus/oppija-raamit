export function parseHtml(html) {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.cloneNode(true);
}

export function createDomain(lang) {
  const origin = document.location.origin;
  const domains = {
    fi: 'opintopolku.fi',
    sv: 'studieinfo.fi',
    en: 'studyinfo.fi'
  };

  if (origin.includes('https://')) {
    const domainPrefix = origin.replace(/opintopolku.fi|studyinfo.fi|studieinfo.fi/g, '');
    const domainSuffix = domains[lang];
    return domainPrefix + domainSuffix;
  }
  return '';
}
