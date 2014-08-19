;((function() {
  var raamit = window.OppijaRaamit = {
    changeLanguage: function(language) {
      jQuery.cookie("i18next", language, { expires: 1800, path: '/' }); document.location.reload()
    }
  }

  var preDefinedI18n = !(typeof window.i18n == "undefined")
  var rootDirectory = getScriptDirectory();
  var raamitDirectory = rootDirectory + "oppija-raamit"

  setTimeout(function() {
    initJQuery(function() {
      initJQueryCookie(function() {
        initI18n(function() {
          var naviAjax = $.ajax(getNaviPath(rootDirectory))
          loadScript(window.navigationMenubar, rootDirectory + "js/navigation.js", function() {
            $.ajax(raamitDirectory + "/oppija-raamit.html").done(function(template) {
              applyRaamit(template)
              naviAjax.done(function(navidata) {
                buildNavi(navidata.nav)
                updateBasket()
                updateLoginSection()
                $("html").trigger("oppija-raamit-loaded")
              })
            })
          })
        })
      })
    })
  }, 0)

  function getNaviPath(rootDirectory) {
    var wpHost = document.getElementById('apply-raamit').getAttribute('data-wp-navi-path')
    if(!wpHost) {
      var parser = document.createElement('a')
      parser.href = rootDirectory
      wpHost = (rootDirectory.indexOf("opintopolku") > 0 || rootDirectory.indexOf("ware.fi") > 0) ? parser.protocol + "//" + parser.hostname : "https://testi.opintopolku.fi"
    }
    return wpHost + i18n.t("raamit:wordpressRoot") + "/api/nav/json_nav/"
  }

  function applyRaamit(template) {
    var $template = $(template).i18n()
    $template.find("img").each(function() {
      $(this).attr("src", raamitDirectory + "/img/" + $(this).attr("src"))
    })
    var $body = $("body")
    var $header = $template.find("header").addClass("lang-" + raamit.lang)


    var $footer = $template.find("footer")
    var $head = $("head")


    $body.prepend($header)
    $body.append($footer)

    var cssFiles = ["oppija-raamit.css", "fontello.css"];
    for (var i in cssFiles) {
      var css = cssFiles[i]
      $head.append($('<link rel="stylesheet" type="text/css"/>').attr("href", raamitDirectory + "/css/" + css))
    }
  }

  function buildNavi(naviData) {
    var naviSelector = "#siteheader nav ul"
    var $root = $(naviSelector)
    naviData.forEach(function(naviItem) {
      var $naviItem = $("<li>").addClass("menu-parent").attr("aria-haspopup", "true")
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
          raamit: {
            loginLink: "Kirjaudu sisään",
            logoutLink: "Kirjaudu ulos",
            omatsivutLink: "Oma Opintopolku",
            wordpressRoot: "/wp/fi",
            homeLink: {
              title: "Siirry etusivulle",
              image: "opintopolku_large-fi.png"
            },
            mobileVersion: {
              title: "Erityisoppilaitosten koulutukset tekstiversiona",
              link: "/m/index.html"
            },
            shortlist:{
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
          raamit: {
            loginLink: "Logga in",
            logoutLink: "Logga ut",
            omatsivutLink: "Min Studieinfo",
            wordpressRoot: "/wp/sv",
            homeLink: {
              title: "Gå till framsida",
              image: "opintopolku_large-sv.png"
            },
            mobileVersion: {
              title: "Specialläroanstalternas utbildningar som textversion",
              link: "/m/index_sv.html"
            },
            shortlist:{
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
          raamit: {
            loginLink: "Log in",
            logoutLink: "Log out",
            omatsivutLink: "My Studyinfo",
            wordpressRoot: "/wp2/en",
            homeLink: {
              title: "Go to frontpage",
              image: "opintopolku_large-en.png"
            },
            shortlist:{
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
      if(!preDefinedI18n) {
          i18n.init({
              resStore: dictionary,
              fallbackLng: "fi"
          });
      } else {
          i18n.addResourceBundle("fi", "raamit", dictionary.fi.raamit)
          i18n.addResourceBundle("sv", "raamit", dictionary.sv.raamit)
          i18n.addResourceBundle("en", "raamit", dictionary.en.raamit)
      }
      callback()
    })
  }

  function updateBasket() {
    var $count = $(".count")
    updateBasketSize($count)
    setInterval(function() {
      if(basketSizeChanged($count)) {
        updateBasketSize($count)
      }
    }, 500)
  }

  function updateLoginSection() {
    var loggedIn = jQuery.cookie("auth") != null
    $(".header-logged-in").toggle(loggedIn)
    $(".header-logged-out").toggle(!loggedIn)
  }

  function updateBasketSize($elem) {
    $elem.text(basketSize())
  }

  function basketSizeChanged($elem) {
    return $elem.text() != basketSize()
  }

  function basketSize() {
    var basket = basketContent()
    if (basket) {
      return "(" + basket.length + ")"
    } else {
      return "(0)"
    }
  }

  function basketContent() {
    var basket = jQuery.cookie("basket")
    if (basket) {
      return JSON.parse(decodeURIComponent(basket))
    } else {
      return undefined
    }
  }

})())