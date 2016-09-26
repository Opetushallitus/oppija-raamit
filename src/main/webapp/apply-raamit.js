;((function() {
  var raamit = window.OppijaRaamit = {
    changeLanguage: function(language) {
      setLangCookie(language, function() {
        if(document.location.href.indexOf("wp") > 0){
          var wpPathMatcher = document.location.href.match(/\/wp.?\/(fi|sv|en)\/(.*)/)
          var wpPath = '';
          if (wpPathMatcher != null) {
            wpPath = wpPathMatcher[2]
          } else {
            wpPathMatcher = document.location.href.match(/\/wp.?\/(.*)/)
            if (wpPathMatcher != null && ['fi', 'en', 'sv'].indexOf(wpPathMatcher[1]) < 0) {
              wpPath = wpPathMatcher[1]
            }
          }
          i18n.setLng(language, function() {
            if(language == 'en' || getLanguageFromHost() == 'en'){
              goToLanguageRoot(language); // Switching between fi/sv and en WPs
            } else {
              getTranslation(wpPath)
              .done(function(translation) {
                if(translation.status.toLowerCase() == "ok") {
                  window.location.href = translation.translation.url
                } else {
                  goToLanguageRoot(language)
                }
              })
              .fail(function() {
                goToLanguageRoot(language)
              })
            }
          })
        } else {
          i18n.setLng(language, function() {
            if (getLanguageFromHost()) {
              document.location.href = getHostForLang(document.location.href, language)
            } else {
              jQuery.cookie(i18n.options.cookieName, language, { expires: 1800, path: '/' })
              document.location.reload()
            }
          })
        }
      })
    }
  }

  function chooseUrl(predicate, args, onTrue, onFalse) {
    if (predicate.apply(this, args)) {
      return onTrue;
    }
    return onFalse;
  }

  function envHasWp(hostname) {
    if (hostname === "localhost" ||
        hostname === "itest-oppija.oph.ware.fi") {
      return false;
    }
    return true;
  }

  function getChangeLangUrl(lang) {
    if (getLanguageFromHost()) {
      return getHostForLang(rootDirectory, lang) + window.url("oppija-raamit.lang.change", lang)
    } else {
      return window.url("oppija-raamit.lang.change", lang)
    }
  }

  function isDemoEnv() {
    return ["demo.opintopolku.fi", "demo.studieinfo.fi","demo.studyinfo.fi"].indexOf(window.location.hostname) !== -1;
  }

  function isProductionEnv() {
    return ["opintopolku.fi", "studieinfo.fi","studyinfo.fi"].indexOf(window.location.hostname) !== -1;
  }

  function setLangCookie(lang, cb) {
    $.ajax(getChangeLangUrl(lang)).done(cb).fail(function() {
      goToLanguageRoot(lang)
    })
  }

  var preDefinedI18n = !(typeof window.i18n == "undefined")
  var rootDirectory = getScriptDirectory();

  function loadFooterLinks() {
    if (!isDemoEnv()) {
      $.ajax(getFooterLinksPath()).done(function(footerLinks) {
        buildFooterLinks(footerLinks.nav)
      }).error(function(err) {
        buildFooterLinks(i18n.t("raamit:footerlinks", {
          returnObjectTrees : true
        }))
      }).always(function() {
        $("html").trigger("oppija-raamit-loaded")
      })
    } else {
      $("html").trigger("oppija-raamit-loaded")
    }
  }

  function updateActiveTopLink() {
    if (window.location.host.indexOf('eperusteet') !== -1 && window.location.host.indexOf('egrunder') !== -1) {
      $('#top-link-eperusteet').addClass('top-link-active');
    } else {
      $('#top-link-opintopolku').addClass('top-link-active');
    }
  }

  setTimeout(function() {
    initJQuery(function() {
      initJQueryCookie(function() {
        initI18n(function() {
          loadScript(window.navigationMenubar, window.url("oppija-raamit.navigation"), function() {
            $.ajax(window.url("oppija-raamit.raamit")).done(function(template) {
              var language = getInitLang()
              jQuery.cookie(i18n.options.cookieName, language, { expires: 1800, path: '/' })
              if(!isDemoEnv()) {
                $.ajax(getNaviPath())
                .done(function(navidata) {
                  buildNavi(navidata.nav)
                })
              }
              applyRaamit(template)
              hideActiveLanguage(language)
              if (['fi', 'sv'].indexOf(language) > -1) {
                updateActiveTopLink()
              } else {
                hideTopLinks()
              }
              updateBasket()
              updateLoginSection()
              $(".header-system-name").text(getTestSystemName())

              if(isDemoEnv()) {
                $('#top-link-eperusteet').hide();
              }

              loadFooterLinks()
            })
          })
        })
      })
    })
  }, 0)

  function getWpHost(rootDirectory, lang) {
    var wpHost = document.getElementById('apply-raamit').getAttribute('data-wp-navi-path')
    if (!wpHost) {
      var parser = document.createElement('a')
      if (envHasWp(window.location.hostname)) {
        parser.href = getHostForLang(rootDirectory, lang || getLanguageFromHost())
      } else {
        parser.href = getHostForLang("https://testi.opintopolku.fi", lang || getLanguageFromHost())
      }
      wpHost = parser.protocol + "//" + parser.hostname
    }
    return wpHost + checkForLanguageMatchingWp(i18n.t("raamit:wordpressRoot"), lang);
  }
  
  //Check due to ajax fail in IE9
  function checkForLanguageMatchingWp(wp, lang) {
      if(!lang){
          lang = getInitLang();
      }
      if (lang == "en" && wp == "/wp/") {
          return "/wp2/";
      } else if (lang != "en" && wp == "/wp2/en/") {
          return "/wp/";
      }
      return wp;
  }

  function getTestSystemName() {
    if (isProductionEnv()) {
      return ""
    } else if (isDemoEnv()) {
        return "DEMO"
    } else {
        return window.location.hostname
    }
  }

  function getNaviPath() {
    return chooseUrl(envHasWp, [window.location.hostname],
        window.url("wordpress.api.nav"),
        window.url("wordpress.test.api.nav"));
    }

  function getFooterLinksPath() {
    return chooseUrl(envHasWp, [window.location.hostname],
        window.url("wordpress.api.footerLinks"),
        window.url("wordpress.test.api.footerLinks"));
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
      $head.append($('<link rel="stylesheet" type="text/css"/>')
          .attr("href", window.url("oppija-raamit.raamit.css.base") + css))
    }
    if (isDemoEnv()){
        addDemoWarning();
    }
  }

  function addDemoWarning() {
      var warningCssUrl = window.url("oppija-raamit.demo.warning.css")
      $('head').append('<link rel="stylesheet" type="text/css" href="' + warningCssUrl + '">');

      $.ajax(window.url("oppija-raamit.demo.warning")).done(function(data) {
          $("body").append(data);
      });
  }
  
  function hideMobileNavi() {
    $(".mobile-menu").hide();
    $(".mobile-menu-button").click(function() {
        $(".mobile-menu").slideToggle(250);
        var mb = $(".mobile-menu-button-menu-open")
        if (mb.length) {
            mb.removeClass("mobile-menu-button-menu-open")
        } else {
            $(".mobile-menu-button").addClass("mobile-menu-button-menu-open")
        }
    });
  }

  function hideTopLinks() {
    $('.top-links-bar').hide()
  }

  function buildNavi(naviData) {
    var naviSelector = "#siteheader nav#full-nav ul"
    var mobileNaviSelector = "#siteheader nav#mobile-nav ul.mobile-menu"
    var $root = $(naviSelector)
    var $mobileRoot = $(mobileNaviSelector)
    var $activeItem = null
    var $mobileActiveItem = null
    var level1MenuIndex = 0
    var mobNaviElems = []
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
      var $mobileNaviItem = $("<li>").addClass("menu-parent").attr("role", "presentation");
      var $mobileNaviLink = $("<a>").text(naviItem.title).attr("href", naviItem.link).attr("role", "menuitem").attr("id", subMenuId).attr("aria-haspopup", "true");
      if(document.location.href.indexOf(naviItem.link) > -1) {
          $mobileActiveItem = $mobileNaviItem
      }
      $mobileNaviItem.append($mobileNaviLink)
      mobNaviElems.push($mobileNaviItem)
    })
    if($activeItem != null) {
        $activeItem.addClass("active")
    }
    if($mobileActiveItem != null) {
        $mobileActiveItem.addClass("active")
    }
    $mobileRoot.prepend(mobNaviElems)
    window.navigationMenubar(naviSelector)
    hideMobileNavi()
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
    loadScript(window.jQuery, window.url("oppija-raamit.js.jquery"), callback)
  }

  function initJQueryCookie(callback) {
    loadScript(window.jQuery.cookie, window.url("oppija-raamit.js.jquery.cookie"), callback)
  }

  function initI18n(callback) {
    loadScript(window.i18n, window.url("oppija-raamit.js.i18next"), function() {
      var dictionary = {
        fi: {
          raamit: {
            headerAriaLabel: "Navigaatio",
            loginLink: "Kirjaudu sisään",
            logoutLink: "Kirjaudu ulos",
            opintopolkuLink: "Opintopolku",
            eperusteetLink: "ePerusteet",
            eperusteetUrl: "https://eperusteet.opintopolku.fi/",
            omatsivutLink: "Oma Opintopolku",
            wordpressRoot: window.url("wordpress.base"),
            testEnvWordpressRoot: window.url("wordpress.test.base.fi"),
            demoEnvWordpressRoot: window.url("oppija-raamit.demo.wordpress.base"),
            homeLink: {
              title: "Siirry etusivulle",
              image: window.url("oppija-raamit.raamit.img.opintopolku.large.fi")
            },
            shortlist:{
              title: "Muistilista"
            },
            opetushallitus: {
              title: "Opetushallitus",
              image: window.url("oppija-raamit.raamit.img.ophLogo.fi"),
              link: "http://www.oph.fi/etusivu"
            },
            opetusministerio: {
              title: "Opetusministeriö",
              image: window.url("oppija-raamit.raamit.img.okmLogo.fi"),
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
                url: window.url("wordpress.mystudyinfo.fi")
              },
              description: {
                title: "Mikä on Opintopolku?",
                url: window.url("wordpress.description.fi")
              },
              feedback: {
                title: "Anna palautetta – kysy neuvoa",
                url: window.url("wordpress.feedback.fi")
              },
              registerDescription: {
                title: "Rekisteriseloste",
                url: window.url("wordpress.registerDescription.fi")
              },
              index: {
                title: "Oppilaitoshakemisto",
                url: window.url("oppija-raamit.index.fi")
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
            opintopolkuLink: "Studieinfo",
            eperusteetLink: "eGrunder",
            eperusteetUrl: "https://egrunder.studieinfo.fi/",
            wordpressRoot: window.url("wordpress.base"),
            testEnvWordpressRoot: window.url("wordpress.test.base.sv"),
            demoEnvWordpressRoot: window.url("oppija-raamit.demo.wordpress.base"),
            homeLink: {
              title: "Gå till framsida",
              image: window.url("oppija-raamit.raamit.img.opintopolku.large.sv")
            },
            shortlist:{
              title: "Minneslista"
            },
            opetushallitus: {
              title: "Utbildningsstyrelsen",
              image: window.url("oppija-raamit.raamit.img.ophLogo.sv"),
              link: "http://www.oph.fi/startsidan"
            },
            opetusministerio: {
              title: "Undervisnings- och kulturministeriet",
              image: window.url("oppija-raamit.raamit.img.okmLogo.sv"),
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
                url: window.url("wordpress.mystudyinfo.sv")
              },
              description: {
                title: "Vad är Studieinfo?",
                url: window.url("wordpress.description.sv")
              },
              feedback: {
                title: "Ge feedback – fråga råd",
                url: window.url("wordpress.feedback.sv")
              },
              registerDescription: {
                title: "Registerbeskrivning",
                url: window.url("wordpress.registerDescription.sv")
              },
              index: {
                title: "Läroanstaltsregister",
                url: window.url("oppija-raamit.index.sv")
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
            wordpressRoot: window.url("wordpress.base.en"),
            testEnvWordpressRoot: window.url("wordpress.base.en"),
            demoEnvWordpressRoot: window.url("oppija-raamit.demo.wordpress.base"),
            homeLink: {
              title: "Go to frontpage",
              image: window.url("oppija-raamit.raamit.img.opintopolku.large.en")
            },
            shortlist:{
              title: "My shortlist"
            },
            opetushallitus: {
              title: "Finnish National Board of Education",
              image: window.url("oppija-raamit.raamit.img.ophLogo.en"),
              link: "http://www.oph.fi/english"
            },
            opetusministerio: {
              title: "Ministry of Education and Culture",
              image: window.url("oppija-raamit.raamit.img.okmLogo.en"),
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
                url: window.url("wordpress.mystudyinfo.en")
              },
              registerDescription: {
                title: "Register description",
                url: window.url("wordpress.registerDescription.en")
              },
              index: {
                title: "Educational institution index",
                url: window.url("oppija-raamit.index.en")
              }
            }
          }
        }
      }

      // Override wp root url for demo environment
      if(isDemoEnv()){
          dictionary.fi.raamit.wordpressRoot = dictionary.fi.raamit.demoEnvWordpressRoot
          dictionary.sv.raamit.wordpressRoot = dictionary.sv.raamit.demoEnvWordpressRoot
          dictionary.en.raamit.wordpressRoot = dictionary.en.raamit.demoEnvWordpressRoot
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
    if(!host)
        host = document.location.host;
    var x = host.split('.')
    if (x.length < 2) return null
    switch (x[x.length - 2]) {
      case 'opintopolku': return 'fi'
      case 'studieinfo': return 'sv'
      case 'studyinfo': return 'en'
    }
    return null
  }

  function getHostForLang(url, lang) {
      var langs = {
          'fi': 'opintopolku',
          'sv': 'studieinfo',
          'en': 'studyinfo'
      }
      var parser = document.createElement('a')
      parser.href = url
      var x = parser.host.split('.')
      x[x.length-2] = langs[lang] || langs['fi']
      parser.host = x.join('.')
      return parser.href
  }

  function getInitLang() {
      if(document.location.href.indexOf("wp") > 0){
          var regexp = /\/wp.?\/(fi|sv|en)/
          var match = document.location.href.match(regexp)
          if(match != null && match.length > 0) {
              return match[1]
          }
      }
      var lang = getLanguageFromHost()
      if (lang != null) return lang
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
    var shibbolethcheckUrl = getScriptDirectory() + 'shibbolethcheck'
    if (getLanguageFromHost()) {
        shibbolethcheckUrl = getHostForLang(shibbolethcheckUrl, readLanguageCookie())
    }
    $.ajax(shibbolethcheckUrl).done(function() {
      var loggedIn = jQuery.cookie("shibboleth_loggedIn") === "true"
      $(".header-logged-in").toggle(loggedIn)
      $(".header-logged-out").toggle(!loggedIn)

      if(isDemoEnv()) {
        $('.header-login-section').hide();
      }

    })
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
    var translationUrl;

    if (path != null && path.length > 0) {
      translationUrl = window.url("wordpress.api.translate.path", path)
    }
    else {
      translationUrl = window.url("wordpress.api.translate")
    }
    return $.ajax(translationUrl)
  }

  function goToLanguageRoot(lang) {
    if (getLanguageFromHost()) {
      window.location.href = getWpHost(getHostForLang(getScriptDirectory(), lang || readLanguageCookie()), lang)
    } else {
      var wpRoot = i18n.t("raamit:testEnvWordpressRoot")
      window.location.pathname = wpRoot
    }
  }
})())
