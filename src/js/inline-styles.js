export function applyInlineStyles(rootSelector) {
  const elementsWithDataStyleAttribute = document.querySelectorAll(`${rootSelector} [data-inline-style]`)
  elementsWithDataStyleAttribute.forEach(elem => {
    const inlineStyle = elem.getAttribute("data-inline-style")
    elem.style.cssText = inlineStyle
    elem.removeAttribute("data-inline-style")
  })
}
