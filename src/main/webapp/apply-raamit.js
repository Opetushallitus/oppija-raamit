;((function() {
  var raamit = window.OppijaRaamit = {
    changeLanguage: function(language) {
      jQuery.cookie(i18n.options.cookieName, language, { expires: 1800, path: '/' })
      if(document.location.href.indexOf("wp") > 0){
        var wpPathMatcher = document.location.href.match(/\/wp.?\/(fi|sv|en)\/(.*)/)
        i18n.setLng(language, function() {
          if(wpPathMatcher == null) {
            goToLanguageRoot()
          }
          else {
            getTranslation(wpPathMatcher[2])
            .done(function(translation) {
                if(translation.status.toLowerCase() == "ok") {
                  window.location.href = translation.translation.url
                } else {
                  goToLanguageRoot()
                }
            })
            .fail(function() {
                goToLanguageRoot()
              })
          }
        })
      } else {
          document.location.reload()
      }
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
              hideActiveLanguage(getInitLang())
              updateBasket()
              updateLoginSection()
              naviAjax.done(function(navidata) {
                buildNavi(navidata.nav)
              })
              buildFooterLinks(i18n.t("raamit:footerlinks", { returnObjectTrees: true }))
              $("html").trigger("oppija-raamit-loaded")
            })
          })
        })
      })
    })
  }, 0)

  function getWpHost(rootDirectory) {
    var wpHost = document.getElementById('apply-raamit').getAttribute('data-wp-navi-path')
    if (!wpHost) {
      var parser = document.createElement('a')
      parser.href = rootDirectory
      wpHost = (rootDirectory.indexOf("opintopolku") > 0 || rootDirectory.indexOf("/test-oppija") > 0) ? parser.protocol + "//" + parser.hostname : "https://testi.opintopolku.fi"
    }
    return wpHost + i18n.t("raamit:wordpressRoot")
  }

  function getNaviPath(rootDirectory) {
    return getWpHost(rootDirectory) + "/api/nav/json_nav/"
  }

  function applyRaamit(template) {
    var $template = $(template).i18n()
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
    var $activeItem = null
    var level1MenuIndex = 0
    naviData.forEach(function(naviItem) {
      level1MenuIndex = level1MenuIndex + 1;
      var subMenuId = "level-1-menu-id-" + level1MenuIndex;
      var $naviItem = $("<li>").addClass("menu-parent").attr("role", "presentation");
      var $naviLink = $("<a>").text(naviItem.title).attr("href", naviItem.link).attr("role", "menuitem").attr("id", subMenuId).attr("aria-haspopup", "true");
      if(document.location.href.indexOf(naviItem.link) > -1) {
          $activeItem = $naviItem
      }
      $naviItem.append($naviLink)
      if (naviItem.subnav) {
        var $subMenu = $("<ul>").addClass("level-2-menu").attr("role", "menu").attr("aria-labelledby", subMenuId).attr("aria-expanded", "false");
        naviItem.subnav.forEach(function(subItem) {
          var $subItem = $("<li>").addClass("menu-item").attr("role", "presentation")
          var $subItemLink = $("<a>").text(subItem.title).attr("href", subItem.link).attr("role", "menuitem")
          $subItem.append($subItemLink)
          $subMenu.append($subItem)
        })
        $naviItem.append($subMenu)
      }
      $root.append($naviItem)
    })
    if($activeItem != null) {
        $activeItem.addClass("active")
    }
    window.navigationMenubar(naviSelector)
  }

  function buildFooterLinks(footerlinks) {
    var $footerlinkselement = $("#footer-links")
    for (var item in footerlinks) {
      var $item = $("<li>")
      var $link = $("<a>").text(footerlinks[item].title).attr({ href: footerlinks[item].link })
      $footerlinkselement.append($item.append($link))
    }
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
            headerAriaLabel: "Navigaatio",
            loginLink: "Kirjaudu sisään",
            logoutLink: "Kirjaudu ulos",
            omatsivutLink: "Oma Opintopolku",
            wordpressRoot: "/wp/fi",
            homeLink: {
              title: "Siirry etusivulle",
              image: "/oppija-raamit/oppija-raamit/img/opintopolku_large-fi.png"
            },
            mobileVersion: {
              title: "Erityisoppilaitosten koulutukset tekstiversiona",
              link: "/m/index.html"
            },
            shortlist:{
              title: "Muistilista"
            },
            opetushallitus: {
              title: "Opetushallitus",
              image: "/oppija-raamit/oppija-raamit/img/OPH_logo-fi.png",
              link: "http://www.oph.fi/etusivu"
            },
            opetusministerio: {
              title: "Opetusministeriö",
              image: "/oppija-raamit/oppija-raamit/img/OKM_logo-fi.png",
              link: "http://www.minedu.fi/OPM/"
            },
            footerAriaLabel: "Tietoa palvelusta",
            footerNote: "Koulutuksen järjestäjät ja korkeakoulut ylläpitävät tietoja koulutuksistaan Opintopolussa. Tietojen oikeellisuuden voit tarkistaa kyseisestä oppilaitoksesta tai korkeakoulusta.",
            copyright: "Copyright © 2014 Opetushallitus",
            languages: {
              ariaLabel: "Valitse kieli",
              fi: "Suomeksi",
              sv: "På svenska",
              en: "In English"
            },
            footerlinks: {
              mystudyinfo: {
                title: "Oma Opintopolku-palvelu",
                link: "/wp/fi/oma-opintopolku-palvelu/"
              },
              description: {
                title: "Mikä on Opintopolku?",
                link: "/wp/fi/opintopolku/tietoa-palvelusta/"
              },
              feedback: {
                title: "Anna palautetta – kysy neuvoa",
                link: "/wp/fi/opintopolku/anna-palautetta-kysy-neuvoa/"
              },
              registerDescription: {
                title: "Rekisteriseloste",
                link: "/wp/fi/rekisteriseloste/"
              },
              index: {
                title: "Oppilaitoshakemisto",
                link: "/fi/hakemisto/oppilaitokset/A"
              }
            }
          }
        },
        sv: {
          raamit: {
            headerAriaLabel: "Navigation",
            loginLink: "Logga in",
            logoutLink: "Logga ut",
            omatsivutLink: "Min Studieinfo",
            wordpressRoot: "/wp/sv",
            homeLink: {
              title: "Gå till framsida",
              image: "/oppija-raamit/oppija-raamit/img/opintopolku_large-sv.png"
            },
            mobileVersion: {
              title: "Specialläroanstalternas utbildningar som textversion",
              link: "/m/index_sv.html"
            },
            shortlist:{
              title: "Minneslista"
            },
            opetushallitus: {
              title: "Utbildningsstyrelsen",
              image: "/oppija-raamit/oppija-raamit/img/OPH_logo-sv.png",
              link: "http://www.oph.fi/startsidan"
            },
            opetusministerio: {
              title: "Undervisnings- och kulturministeriet",
              image: "/oppija-raamit/oppija-raamit/img/OKM_logo-sv.png",
              link: "http://www.minedu.fi/OPM/?lang=sv"
            },
            footerAriaLabel: "Serviceinformation",
            footerNote: "Utbildningsanordnarna och högskolorna uppdaterar själva uppgifterna om sina utbildningar i Studieinfo. Du kan kontrollera att uppgifterna är riktiga av läroanstalten eller högskolan.",
            copyright: "Copyright © 2014 Utbildningsstyrelsen",
            languages: {
              ariaLabel: "Välja språk",
              fi: "Suomeksi",
              sv: "På svenska",
              en: "In English"
            },
            footerlinks: {
              mystudyinfo: {
                title: "Min Studieinfo-tjänsten",
                link: "/wp/sv/min-studieinfo-tjansten/"
              },
              description: {
                title: "Vad är Studieinfo?",
                link: "/wp/sv/studieinfo-2/vad-ar-studieinfo/"
              },
              feedback: {
                title: "Ge feedback – fråga råd",
                link: "/wp/sv/studieinfo-2/tes5/"
              },
              registerDescription: {
                title: "Registerbeskrivning",
                link: "/wp/sv/registerbeskrivning/"
              },
              index: {
                title: "Läroanstaltsregister",
                link: "/sv/hakemisto/oppilaitokset/A"
              }
            }
          }
        },
        en: {
          raamit: {
            headerAriaLabel: "Navigation",
            loginLink: "Log in",
            logoutLink: "Log out",
            omatsivutLink: "My Studyinfo",
            wordpressRoot: "/wp2/en",
            homeLink: {
              title: "Go to frontpage",
              image: "/oppija-raamit/oppija-raamit/img/opintopolku_large-en.png"
            },
            mobileVersion: {
              style: "display:none;"
            },
            shortlist:{
              title: "My shortlist"
            },
            opetushallitus: {
              title: "Finnish National Board of Education",
              image: "/oppija-raamit/oppija-raamit/img/OPH_logo-en.png",
              link: "http://www.oph.fi/english"
            },
            opetusministerio: {
              title: "Ministry of Education and Culture",
              image: "/oppija-raamit/oppija-raamit/img/OKM_logo-en.png",
              link: "http://www.minedu.fi/OPM/?lang=en"
            },
            footerAriaLabel: "Service information",
            footerNote: "The education providers and higher education institutions maintain their study programme information on Studyinfo. You can check the validity of the information directly from the educational institution or the higher education institution.",
            copyright: "Copyright @ 2014 Finnish National Board of Education",
            languages: {
              ariaLabel: "Choose language",
              fi: "Suomeksi",
              sv: "På svenska",
              en: "In English"
            },
            footerlinks: {
              registerDescription: {
                title: "Register description",
                link: "/wp2/en/register"
              },
              index: {
                title: "Educational institution index",
                link: "/en/hakemisto/oppilaitokset/"
              }
            }
          }
        }
      }

      if(!preDefinedI18n) {
          i18n.init({
              lng: getInitLang(),
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

  function hideActiveLanguage(activeLang) {
    $('ul.header-language li').each(function () {
      if($(this).attr("id") === "lang-" + activeLang){
        $(this).hide()
      }
    })
  }

  function getInitLang() {
      if(document.location.href.indexOf("wp") > 0){
          var regexp = /\/wp.?\/(fi|sv|en)/
          var match = document.location.href.match(regexp)
          if(match != null && match.length > 0) {
              return match[1]
          }
      }
      return readLanguageCookie()
  }

  function readLanguageCookie() {
      var lang = jQuery.cookie(i18n.options.cookieName)
      return lang != null ? lang : "fi"
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
    var loggedIn = jQuery.cookie("shibboleth_loggedIn") === "true"
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

  function getTranslation(path) {
    var translationUrl = getWpHost(getScriptDirectory()) + "/?json=translate.translate_page&path=" + path
    return $.ajax(translationUrl)
  }

  function goToLanguageRoot() {
    var wpRoot = i18n.t("raamit:wordpressRoot")
    window.location.pathname = wpRoot
  }
})())
