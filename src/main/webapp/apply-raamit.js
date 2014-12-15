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

  function loadFooterLinks() {
    $.ajax(getFooterLinksPath(rootDirectory)).done(function(footerLinks) {
      buildFooterLinks(footerLinks.nav)
    })
    .error(function(err) {
      buildFooterLinks(i18n.t("raamit:footerlinks", { returnObjectTrees: true }))
    })
    .always(function() {
      $("html").trigger("oppija-raamit-loaded")
    })
  }

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
              $(".header-system-name").text(getTestSystemName())
              naviAjax.done(function(navidata) {
                buildNavi(navidata.nav)
              })
              loadFooterLinks()
            })
          })
        })
      })
    })
  }, 0)

  function envHasWp(url) {
    return url.match(/(\/test-oppija|((\.|\/)(opintopolku|studieinfo|studyinfo)))/) != null
  }

  function getWpHost(rootDirectory) {
    var wpHost = document.getElementById('apply-raamit').getAttribute('data-wp-navi-path')
    if (!wpHost) {
      var parser = document.createElement('a')
      parser.href = rootDirectory
      wpHost = envHasWp(rootDirectory) ? parser.protocol + "//" + parser.hostname : "https://testi.opintopolku.fi"
    }
    return wpHost + i18n.t("raamit:wordpressRoot")
  }

  function getTestSystemName() {
    var location = window.location.href
    if (location.indexOf("/opintopolku.fi") > 0) {
      return ""
    } else if (location.indexOf("/testi.opintopolku.fi") > 0) {
      return "QA"
    } else if (location.indexOf("/test-oppija.oph.ware.fi") > 0) {
      return "Reppu"
    } else if (location.indexOf("/itest-oppija.oph.ware.fi") > 0) {
      return "Luokka"
    } else if (location.indexOf("/localhost") > 0) {
      return "Localhost"
    }
  }

  function getNaviPath(rootDirectory) {
    return getWpHost(rootDirectory) + "/api/nav/json_nav/"
  }

  function getFooterLinksPath(rootDirectory) {
    return getWpHost(rootDirectory) + "/api/menus/footer_links/"
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
      var $link = $("<a>").text(footerlinks[item].title).attr({ href: footerlinks[item].url })
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
              image: raamitDirectory + "/img/opintopolku_large-fi.png"
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
              image: raamitDirectory + "/img/OPH_logo-fi.png",
              link: "http://www.oph.fi/etusivu"
            },
            opetusministerio: {
              title: "Opetusministeriö",
              image: raamitDirectory + "/img/OKM_logo-fi.png",
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
                url: "/wp/fi/oma-opintopolku-palvelu/"
              },
              description: {
                title: "Mikä on Opintopolku?",
                url: "/wp/fi/opintopolku/tietoa-palvelusta/"
              },
              feedback: {
                title: "Anna palautetta – kysy neuvoa",
                url: "/wp/fi/opintopolku/anna-palautetta-kysy-neuvoa/"
              },
              registerDescription: {
                title: "Rekisteriseloste",
                url: "/wp/fi/rekisteriseloste/"
              },
              index: {
                title: "Oppilaitoshakemisto",
                url: "/fi/hakemisto/oppilaitokset/A"
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
              image: raamitDirectory + "/img/opintopolku_large-sv.png"
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
              image: raamitDirectory + "/img/OPH_logo-sv.png",
              link: "http://www.oph.fi/startsidan"
            },
            opetusministerio: {
              title: "Undervisnings- och kulturministeriet",
              image: raamitDirectory + "/img/OKM_logo-sv.png",
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
                url: "/wp/sv/min-studieinfo-tjansten/"
              },
              description: {
                title: "Vad är Studieinfo?",
                url: "/wp/sv/studieinfo-2/vad-ar-studieinfo/"
              },
              feedback: {
                title: "Ge feedback – fråga råd",
                url: "/wp/sv/studieinfo-2/tes5/"
              },
              registerDescription: {
                title: "Registerbeskrivning",
                url: "/wp/sv/registerbeskrivning/"
              },
              index: {
                title: "Läroanstaltsregister",
                url: "/sv/hakemisto/oppilaitokset/A"
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
              image: raamitDirectory + "/img/opintopolku_large-en.png"
            },
            mobileVersion: {
              style: "display:none;"
            },
            shortlist:{
              title: "My shortlist"
            },
            opetushallitus: {
              title: "Finnish National Board of Education",
              image: raamitDirectory + "/img/OPH_logo-en.png",
              link: "http://www.oph.fi/english"
            },
            opetusministerio: {
              title: "Ministry of Education and Culture",
              image: raamitDirectory + "/img/OKM_logo-en.png",
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
              mystudyinfo: {
                title: "My Studyinfo -service",
                url: "/wp2/en/my-studyinfo-service/"
              },
              registerDescription: {
                title: "Register description",
                url: "/wp2/en/register"
              },
              index: {
                title: "Educational institution index",
                url: "/en/hakemisto/oppilaitokset/"
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

  function getLanguageFromHost(host) {
    var x = host.split('.')
    if (x.length < 2) return null
    switch (x[x.length - 2]) {
      case 'opintopolku': return 'fi'
      case 'studieinfo': return 'sv'
      case 'studyinfo': return 'en'
    }
    return null
  }

  function getInitLang() {
      if(document.location.href.indexOf("wp") > 0){
          var regexp = /\/wp.?\/(fi|sv|en)/
          var match = document.location.href.match(regexp)
          if(match != null && match.length > 0) {
              return match[1]
          }
      } else {
        var lang = getLanguageFromHost(document.location.host)
        if (lang != null) return lang
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

  function userLoggedIn() {
    var cookies = jQuery.cookie()
    for (var key in cookies) {
      if (key.indexOf('_shibsession_') > -1) {
        return true
      }
    }
    return false
  }

  function updateLoginSection() {
    var loggedIn = userLoggedIn()
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
