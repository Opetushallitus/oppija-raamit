;((function() {

  var rootDirectory = getScriptDirectory();
  var raamitDirectory = rootDirectory + "oppija-raamit"
  var wordPressHost = (rootDirectory.indexOf("localhost") > 0) ? "https://testi.opintopolku.fi" : ""

  initJQuery(function() {
    initJQueryCookie(function() {
      initI18n(function() {
        var naviUrl = wordPressHost + i18n.t("wordpressRoot") + "/api/nav/json_nav/"
        var naviAjax = $.ajax(naviUrl)
        loadScript(window.navigationMenubar, rootDirectory + "/js/navigation.js", function() {
          $.ajax(raamitDirectory + "/oppija-raamit.html").done(function(template) {
            applyRaamit(template)
            naviAjax.done(function(navidata) {
              buildNavi(navidata.nav)
            })
          })
        })
      })
    })
  });

  function applyRaamit(template) {
    var $template = $(template).i18n()
    $template.find("img").each(function() {
      $(this).attr("src", raamitDirectory + "/img/" + $(this).attr("src"))
    })
    var $body = $("body")
    var $header = $template.find("header")

    var $footer = $template.find("footer")
    var $head = $("head")


    $body.prepend($header)
    $body.append($footer)

    var cssFiles = ["bootstrap.css", "oppija-raamit.css"];
    for (var i in cssFiles) {
      var css = cssFiles[i]
      $head.append($('<link rel="stylesheet" type="text/css"/>').attr("href", raamitDirectory + "/css/" + css))
    }
  }

  function buildNavi(naviData) {
    var naviSelector = "#siteheader nav ul"
    var $root = $(naviSelector)
    naviData.forEach(function(naviItem) {
      var $naviItem = $("<li>").addClass("menu-parent").attr("aria-haspopup", "true").attr("title", naviItem.title)
      var $naviLink = $("<a>").text(naviItem.title).attr("href", naviItem.link)
      $naviItem.append($naviLink)
      if (naviItem.subnav) {
        var $subMenu = $("<ul>").addClass("level-2-menu")
        naviItem.subnav.forEach(function(subItem) {
          var $subItem = $("<li>").addClass("menu-item")
          var $subItemLink = $("<a>").text(subItem.title).attr("href", subItem.link)
          $subItem.append($subItemLink)
          $subMenu.append($subItem)
        })
        $naviItem.append($subMenu)
      }
      $root.append($naviItem)
    })
    window.navigationMenubar(naviSelector)
  }

  function getScriptDirectory() {
    var scriptPath = document.getElementById( 'apply-raamit').src;
    return scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 );
  }

  function loadScript(expected, src, callback) {
    if (typeof expected == "undefined") {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.onload = callback;
      script.src = src;
      document.getElementsByTagName('head')[0].appendChild(script);
    } else {
      callback()
    }
  }


  function initJQuery(callback) {
    loadScript(window.jQuery, rootDirectory + "js/lib/jquery-1.9.1.min.js", callback)
  }

  function initJQueryCookie(callback) {
    loadScript(window.jQuery.cookie, rootDirectory + "js/lib/jquery.cookie.js", callback)
  }

  function initI18n(callback) {
    loadScript(window.i18n, rootDirectory + "js/lib/i18next-1.7.3.js", function() {
      var dictionary = {
        fi: {
          translation: {
            wordpressRoot: "/wp/fi",
            homeLink: {
              title: "Siirry etusivulle",
              image: "opintopolku_large-fi.png"
            },
            checklist:{
              title: "Muistilista"
            },
            registerDescription: {
              title: "Rekisteriseloste",
              link: "/wp/fi/rekisteriseloste/"
            },
            siteMap: {
              title: "Hakemisto",
              link: "/fi/hakemisto/oppilaitokset/A"
            },
            opetushallitus: {
              title: "Opetushallitus",
              image: "OPH_logo-fi.png",
              link: "http://www.oph.fi/etusivu"
            },
            opetusministerio: {
              title: "Opetusministeriö",
              image: "OKM_logo-fi.png",
              link: "http://www.minedu.fi/OPM/"
            },
            footerNote: "Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja koulutuksistaan Opintopolussa. Tietojen oikeellisuuden voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta.",
            copyright: "Copyright © 2014 Opetushallitus",
            languages: {
              fi: "Suomeksi",
              sv: "På svenska",
              en: "In English"
            }
          }
        },
        sv: {
          translation: {
            wordpressRoot: "/wp/sv",
            homeLink: {
              title: "Gå till framsida",
              image: "opintopolku_large-sv.png"
            },
            checklist:{
              title: "Minneslista"
            },
            registerDescription: {
              title: "Registerbeskrivning",
              link: "/wp/sv/registerbeskrivning/"
            },
            siteMap: {
              title: "Index",
              link: "/sv/hakemisto/oppilaitokset/A"
            },
            opetushallitus: {
              title: "Utbildningsstyrelsen",
              image: "OPH_logo-sv.png",
              link: "http://www.oph.fi/startsidan"
            },
            opetusministerio: {
              title: "Undervisnings- och kulturministeriet",
              image: "OKM_logo-sv.png",
              link: "http://www.minedu.fi/OPM/?lang=sv"
            },
            footerNote: "Utbildningsanordnarna och högskolorna uppdaterar själva uppgifterna om sina utbildningar i Studieinfo. Du kan kontrollera att uppgifterna är riktiga av läroanstalten eller högskolan.",
            copyright: "Copyright © 2014 Utbildningsstyrelsen",
            languages: {
              fi: "Suomeksi",
              sv: "På svenska",
              en: "In English"
            }
          }
        },
        en: {
          translation: {
            wordpressRoot: "/wp2/en",
            homeLink: {
              title: "Go to frontpage",
              image: "opintopolku_large-en.png"
            },
            checklist:{
              title: "My shortlist"
            },
            registerDescription: {
              title: "Register description",
              link: "/wp2/en/register"
            },
            siteMap: {
              title: "Educational institution index",
              link: "/en/hakemisto/oppilaitokset/"
            },
            opetushallitus: {
              title: "Finnish National Board of Education",
              image: "OPH_logo-en.png",
              link: "http://www.oph.fi/english"
            },
            opetusministerio: {
              title: "Ministry of Education and Culture",
              image: "OKM_logo-en.png",
              link: "http://www.minedu.fi/OPM/?lang=en"
            },
            footerNote: "The education providers and higher education institutions maintain their study programme information on Studyinfo. You can check the validity of the information directly from the educational institution or the higher education institution.",
            copyright: "Copyright @ 2014 Finnish National Board of Education",
            languages: {
              fi: "Suomeksi",
              sv: "På svenska",
              en: "In English"
            }
          }
        }
      }
      i18n.init({ resStore: dictionary });
      $.i18n.init({
        lng: jQuery.cookie("i18next") || "fi",
        resStore: dictionary
      })
      window.changeLanguage = function(language) {
        jQuery.cookie("i18next", language); document.location.reload()
      }
      callback()
    })
  }

})())