import {getHeader, getFooter} from './js/templates';
import {parseHtml} from "./js/utils";

(function applyRaamit() {
  const header = getHeader();
  const footer = getFooter();
  // .addClass("lang-" + raamit.lang) to header

  Promise.all([header, footer]).then(function(values) {
    let body = document.body;
    body.appendChild(parseHtml(values[1]));
    body.insertBefore(parseHtml(values[0]), body.firstChild);
  });

  /*
  const cssFiles = ["oppija-raamit.css", "fontello.css"];
  for (var i in cssFiles) {
    var css = cssFiles[i];
    var $head = $("head");
    $head.append($('<link rel="stylesheet" type="text/css"/>')
      .attr("href", window.url("oppija-raamit-web.raamit.css") + "/" + css))
  }
  if (isDemoEnv()) {
    addDemoWarning();
  }
  */
})();
