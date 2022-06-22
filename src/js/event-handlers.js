const mkSelector = selectorKey => id => `[${selectorKey}='${id}']`;

/**
 *
 * Kytkee Raamien koodiin event listenerit. Tämä toteutus tukee raameja tiukalla CSP-asetuksella käytettynä.
 * @returns Viitteet elementtien tapahtumienkuuntelijoihin ja tapahtuman tyyppiin
 * @param {Record<string, [string, EventListenerOrEventListenerObject]>} handlers Tapahtumankäsittelijät
 * @param {string} selectorKey Avain, jolla etsitään komponenttejä DOM:sta. Oletuksena data-event-id
 */
export function registerEventHandlers(handlers = {}, selectorKey = "data-event-id") {
  const selector = mkSelector(selectorKey)
  Object.keys(handlers).map(id => {
    const [eventType, handler] = handlers[id]
    const elem = document.querySelector(selector(id))
    if(elem) {
      document.querySelector(selector(id)).addEventListener(eventType, handler)
    } else {
      console.error(`Could not find element ${selector(id)} from the DOM`)
    }
  })
}
