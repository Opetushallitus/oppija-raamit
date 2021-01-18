;((function () {
    var raamit = window.OppijaRaamit = {
        changeLanguage: function (language) {
            setLangCookie(language, function () {
                if (document.location.href.indexOf("wp") > 0) {
                    var wpPathMatcher = document.location.href.match(/\/wp.?\/(fi|sv|en)\/(.*)/);
                    var wpPath = '';
                    if (wpPathMatcher != null) {
                        wpPath = wpPathMatcher[2]
                    } else {
                        wpPathMatcher = document.location.href.match(/\/wp.?\/(.*)/);
                        if (wpPathMatcher != null && ['fi', 'en', 'sv'].indexOf(wpPathMatcher[1]) < 0) {
                            wpPath = wpPathMatcher[1]
                        }
                    }
                    i18n.setLng(language, function () {
                        if (language == 'en' || getLanguageFromHost() == 'en') {
                            goToLanguageRoot(language); // Switching between fi/sv and en WPs
                        } else {
                            getTranslation(wpPath)
                                .done(function (translation) {
                                    if (translation.status.toLowerCase() == "ok") {
                                        window.location.href = translation.translation.url
                                    } else {
                                        goToLanguageRoot(language)
                                    }
                                })
                                .fail(function () {
                                    goToLanguageRoot(language)
                                })
                        }
                    })
                } else {
                    i18n.setLng(language, function () {
                        if (getLanguageFromHost()) {
                            document.location.href = getHostForLang(document.location.href, language)
                        } else {
                            jQuery.cookie(i18n.options.cookieName, language, {expires: 1800, path: '/'});
                            document.location.reload()
                        }
                    })
                }
            })
        },
        showModalCookieSettings: function () {
          if ($('#cookie-modal-settings').css('display') ==='none') {
            $('#cookie-modal-settings').css('display', 'block');
          } else {
            $('#cookie-modal-settings').css('display', 'none');
          }
        },
        setAcceptedCookies: function () {
          if (document.getElementById('mandatoryCookies').checked) {
            jQuery.cookie('oph-mandatory-cookies-accepted', 'true', { expires: 1800, path: '/' });
          }
          if (document.getElementById('statisticCookies').checked) {
            jQuery.cookie('oph-statistic-cookies-accepted', 'true', { expires: 1800, path: '/' });
          }
          if (document.getElementById('marketingCookies').checked) {
            jQuery.cookie('oph-marketing-cookies-accepted', 'true', { expires: 1800, path: '/' });
          }
          $('#cookie-modal-backdrop').css('display', 'none');
        },
        showCookieText() {
          if ($('#cookie-modal-fulltext').css('display') ==='none') {
            $('#cookie-modal-fulltext').css('display', 'block');
          } else {
            $('#cookie-modal-fulltext').css('display', 'none');
          }
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
            return getHostForLang(rootDirectory, lang) + window.url("oppija-raamit.lang.change.suffix", lang)
        } else {
            return window.url("oppija-raamit.lang.change.full", lang)
        }
    }

    function isDemoEnv() {
        return ["demo-opintopolku.fi", "demo-studieinfo.fi", "demo-studyinfo.fi"].indexOf(window.location.hostname) !== -1;
    }

    function isProductionEnv() {
        return ["opintopolku.fi", "studieinfo.fi", "studyinfo.fi"].indexOf(window.location.hostname) !== -1;
    }

    function setLangCookie(lang, cb) {
        $.ajax(getChangeLangUrl(lang)).done(cb).fail(function () {
            goToLanguageRoot(lang)
        })
    }

    var preDefinedI18n = !(typeof window.i18n == "undefined");
    var rootDirectory = getScriptDirectory();

    function loadFooterLinks(lang) {
        if (!isDemoEnv()) {
          $.ajax(getFooterLinksPath(lang)).done(function (footerLinks) {
              buildFooterLinks(footerLinks.nav)})
            .error(function (err) {
              buildFooterLinks(i18n.t("raamit:footerlinks", {
                returnObjectTrees: true
              }))
            }).always(function () {
              $("html").trigger("oppija-raamit-loaded")
            })
        } else {
            $("html").trigger("oppija-raamit-loaded")
        }
    }

    function updateActiveTopLink() {
      if (window.location.host.indexOf('eperusteet') !== -1 && window.location.host.indexOf('egrunder') !== -1) {
        $('#top-link-eperusteet').addClass('top-link-active');
        return;
      }

      if (window.location.host.indexOf('ehoks') !== -1 && window.location.host.indexOf('epuk') !== -1) {
        $('#top-link-ehoks').addClass('top-link-active');
        return;
      }

      $('#top-link-opintopolku').addClass('top-link-active');
    }

    setTimeout(function () {
        initOphUrls(function () {
            initJQuery(function () {
                initJQueryCookie(function () {
                    initI18n(function () {
                        loadScript(window.navigationMenubar, window.url("oppija-raamit-web.navigation"), function () {
                            $.ajax(window.url("oppija-raamit-web.raamit")).done(function (template) {
                                var language = getInitLang()
                                jQuery.cookie(i18n.options.cookieName, language, {expires: 1800, path: '/'});
                                if (!isDemoEnv()) {
                                    $.ajax(getNaviPath(language))
                                        .done(function (navidata) {
                                            buildNavi(navidata.nav)
                                        })
                                }
                                applyRaamit(template);
                                hideActiveLanguage(language);
                                if (['fi', 'sv'].indexOf(language) > -1) {
                                    updateActiveTopLink()
                                } else {
                                    hideTopLinks()
                                }
                                updateBasket();
                                updateLoginSection();
                                $(".header-system-name").text(getTestSystemName());

                                if (isDemoEnv()) {
                                    hideTopLinks()
                                }

                                loadFooterLinks(language);
                                checkAcceptedCookies();
                            })
                        })
                    })
                })
            })
        })
    }, 0)

    function getWpHost(rootDirectory, lang) {
        var wpHost = document.getElementById('apply-raamit').getAttribute('data-wp-navi-path');
        if (!wpHost) {
            var parser = document.createElement('a');
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
        if (!lang) {
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

    function isEnglish(lang) {
        return lang === "en";
    }

    function getNaviPath(lang) {
        return getWpApiPath("nav", lang);
    }

    function getFooterLinksPath(lang) {
        return getWpApiPath("footerLinks", lang);
    }

    function getWpApiPath(entity, lang) {
        return chooseUrl(isEnglish, [lang],
            chooseUrl(envHasWp, [window.location.hostname],
                window.url("wp.api.en." + entity),
                window.url("wp.test.api.en." + entity)),
            chooseUrl(envHasWp, [window.location.hostname],
                window.url("wp.api." + entity),
                window.url("wp.test.api." + entity)));
    }

    function applyRaamit(template) {
        var $template = $(template).i18n();
        var $body = $("body");
        var $header = $template.find("header").addClass("lang-" + raamit.lang);

        var $footer = $template.find("footer");
        var $head = $("head");

        $body.prepend($header);
        $body.append($footer);

        var cssFiles = ["oppija-raamit.css", "fontello.css"];
        for (var i in cssFiles) {
            var css = cssFiles[i];
            $head.append($('<link rel="stylesheet" type="text/css"/>')
                .attr("href", window.url("oppija-raamit-web.raamit.css") + "/" + css))
        }
        if (isDemoEnv()) {
            addDemoWarning();
        }
    }

    function addDemoWarning() {
        var warningCssUrl = window.url("oppija-raamit-web.demo.warning.css");
        $('head').append('<link rel="stylesheet" type="text/css" href="' + warningCssUrl + '">');

        $.ajax(window.url("oppija-raamit-web.demo.warning")).done(function (data) {
            $("body").append(data);
        });
    }

    function hideMobileNavi() {
        $(".mobile-menu").hide();
        $(".mobile-menu-button").click(function () {
            $(".mobile-menu").slideToggle(250);
            var mb = $(".mobile-menu-button-menu-open");
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
        var naviSelector = "#siteheader nav#full-nav ul";
        var mobileNaviSelector = "#siteheader nav#mobile-nav ul.mobile-menu";
        var $root = $(naviSelector);
        var $mobileRoot = $(mobileNaviSelector);
        var $activeItem = null;
        var $mobileActiveItem = null;
        var level1MenuIndex = 0;
        var mobNaviElems = [];
        naviData.forEach(function (naviItem) {
            level1MenuIndex = level1MenuIndex + 1;
            var subMenuId = "level-1-menu-id-" + level1MenuIndex;
            var $naviItem = $("<li>").addClass("menu-parent").attr("role", "presentation");
            var $naviLink = $("<a>").text(naviItem.title).attr("href", naviItem.link).attr("role", "menuitem").attr("id", subMenuId).attr("aria-haspopup", "true");
            if (document.location.href.indexOf(naviItem.link) > -1) {
                $activeItem = $naviItem
            }
            $naviItem.append($naviLink);
            if (naviItem.subnav) {
                var $subMenu = $("<ul>").addClass("level-2-menu").attr("role", "menu").attr("aria-labelledby", subMenuId).attr("aria-expanded", "false");
                naviItem.subnav.forEach(function (subItem) {
                    var $subItem = $("<li>").addClass("menu-item").attr("role", "presentation");
                    var $subItemLink = $("<a>").text(subItem.title).attr("href", subItem.link).attr("role", "menuitem");
                    $subItem.append($subItemLink);
                    $subMenu.append($subItem)
                });
                $naviItem.append($subMenu)
            }
            $root.append($naviItem);
            var $mobileNaviItem = $("<li>").addClass("menu-parent").attr("role", "presentation");
            var $mobileNaviLink = $("<a>").text(naviItem.title).attr("href", naviItem.link).attr("role", "menuitem").attr("id", subMenuId).attr("aria-haspopup", "true");
            if (document.location.href.indexOf(naviItem.link) > -1) {
                $mobileActiveItem = $mobileNaviItem
            }
            $mobileNaviItem.append($mobileNaviLink);
            mobNaviElems.push($mobileNaviItem)
        });
        if ($activeItem != null) {
            $activeItem.addClass("active")
        }
        if ($mobileActiveItem != null) {
            $mobileActiveItem.addClass("active")
        }
        $mobileRoot.prepend(mobNaviElems);
        window.navigationMenubar(naviSelector);
        hideMobileNavi()
    }

    function getYourEuropeLink() {
      var data = i18n.t("raamit:yourEuropeLink", {
        returnObjectTrees: true
      })
      var $item = $("<li>");
      var $link = $("<a>").text(data.title).attr({href: data.url, target: "_blank"});

      return $item.append($link);
    }

    function buildFooterLinks(footerlinks) {
        var $footerlinkselement = $("#footer-links");
        for (var item in footerlinks) {
            var $item = $("<li>");
            var $link = $("<a>").text(footerlinks[item].title).attr({href: footerlinks[item].url});
            $footerlinkselement.append($item.append($link))
        }
        $footerlinkselement.append(getYourEuropeLink());
    }

    function getScriptDirectory() {
        var scriptPath = document.getElementById('apply-raamit').src;
        return scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);
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
        loadScript(window.jQuery, window.url("oppija-raamit-web.js.jquery"), callback)
    }

    function initJQueryCookie(callback) {
        loadScript(window.jQuery.cookie, window.url("oppija-raamit-web.js.jquery.cookie"), callback)
    }

    function initOphUrls(callback) {
        loadScript(window.url, "/oppija-raamit/js/oph_urls.js/index.js", function () {
            loadScript(undefined, "/oppija-raamit/js/oppija-raamit-web-oph_properties.js", callback)
        })
    }

    function initI18n(callback) {
        loadScript(window.i18n, window.url("oppija-raamit-web.js.i18next"), function () {
            var dictionary = {
                fi: {
                    raamit: {
                        headerAriaLabel: "Navigaatio",
                        loginLink: "Kirjaudu sisään",
                        logoutLink: "Kirjaudu ulos",
                        opintopolkuLink: "Opintopolku",
                        omaOpintopolkuLink: "Oma Opintopolku",
                        eperusteetLink: "ePerusteet",
                        eperusteetUrl: "https://eperusteet.opintopolku.fi/",
                        ehoksLink: "eHOKS",
                        ehoksUrl: "https://opintopolku.fi/ehoks",
                        omatsivutLink: "Oma Opintopolku",
                        omatsivutRedirectLink: "Siirry Oma Opintopolkuun",
                        wordpressRoot: window.url("wp.base"),
                        testEnvWordpressRoot: window.url("wp.test.base.fi"),
                        demoEnvWordpressRoot: window.url("oppija-raamit-web.demo.wordpress.base"),
                        homeLink: {
                            title: "Siirry etusivulle",
                            image: window.url("oppija-raamit-web.raamit.img.opintopolku.large.fi")
                        },
                        yourEuropeLink: {
                          title: "Tämä verkkosivu on osa Euroopan komission Your Europe -portaalia. Löysitkö etsimäsi? Anna palautetta!",
                          image: window.url("oppija-raamit-web.raamit.img.youreurope"),
                          url: window.url("oppija-raamit-web.raamit.youreurope.palaute.fi")
                        },
                        shortlist: {
                            title: "Muistilista"
                        },
                        opetushallitus: {
                            title: "Opetushallitus",
                            image: window.url("oppija-raamit-web.raamit.img.ophLogo.fi"),
                            link: "http://www.oph.fi/etusivu"
                        },
                        opetusministerio: {
                            title: "Opetusministeriö",
                            image: window.url("oppija-raamit-web.raamit.img.okmLogo.fi"),
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
                                url: window.url("wp.mystudyinfo.fi")
                            },
                            description: {
                                title: "Mikä on Opintopolku?",
                                url: window.url("wp.description.fi")
                            },
                            feedback: {
                                title: "Anna palautetta – kysy neuvoa",
                                url: window.url("wp.feedback.fi")
                            },
                            registerDescription: {
                                title: "Rekisteriseloste",
                                url: window.url("wp.registerDescription.fi")
                            },
                            index: {
                                title: "Oppilaitoshakemisto",
                                url: window.url("oppija-raamit-web.index.fi")
                            }
                        },
                        cookie: {
                            info: "Jotta sivuston käyttö olisi sinulle sujuvaa, käytämme evästeitä.",
                            close: "Sulje"
                        },
                        cookieModal: {
                            header: "Evästeet",
                            info: "<p>Evästeet ovat pieniä tekstitiedostoja, joita sivusto tallentaa tietokoneellesi tai mobiililaitteellesi. Se sisältää yksilöllisen, nimettömän tunnisteen, jonka avulla verkkopalvelu tunnistaa sivustolla vierailevat eri selaimet. Evästeillä kerättävillä tiedoilla ei voida tunnistaa yksittäisiä käyttäjiä. Opetushallitus edellyttää, että hyväksyt evästeiden käytön voidaksesi käyttää Opintopolku -verkkopalveluamme.</p>",
                            settings: "Asetukset",
                            agreement: "Sallin seuraavat evästeet:",
                            mandatoryCookies: "Välttämättömät evästeet",
                            statisticCookies: "Tilastointiin liittyvät evästeet",
                            marketingCookies: "Markkinointievästeet",
                            accept: "Hyväksy evästeet",
                            expandCookieText:  "Lue lisää evästeistä",
                            fullCookieText: "<p>Evästeitä ovat:</p><ul><li><strong>Ensimmäisen osapuolen evästeet</strong> tulevat suoraan verkkosivustolta, jolla käyt. Vain tämä sivusto voi lukea ne.</li><li>Lisäksi verkkosivusto saattaa käyttää ulkopuolisia palveluja, jotka lähettävät omia evästeitään. Näitä kutsutaan <strong>kolmannen osapuolen evästeiksi</strong>.</li><li>Pysyvät evästeet ovat tietokoneellesi tallennettavia evästeitä, joita ei poisteta automaattisesti, kun suljet selaimen. Istuntokohtaiset evästeet sen sijaan poistetaan istunnon päättyessä.</li></ul><p>Evästeiden tarkoituksena on, että sivusto säilyttää tietyt valintasi (Opintopolussa esim. muistilista ja kieli) tietyn ajan.</p><p>Näin sinun ei tarvitse tehdä samoja valintoja uudelleen, kun siirryt sivustolla sivulta toiselle saman istunnon aikana.</p><p>Evästeiden avulla voidaan myös kerätä anonymisoituja tietoja siitä, miten käyttäjät sivustolla toimivat. Näiden tietojen perusteella ei voida tunnistaa yksittäistä käyttäjää.</p><p><strong>Mihin evästeitä käytetään Opintopolussa?</strong></p><p>Opintopolussa käytetään valtaosin ensimmäisen osapuolen evästeitä. Ulkopuoliset tahot eivät saa niitä käyttöönsä. Huom! Asetuksen digitaalisesta palveluväylästä mukaan Sinun Eurooppasi -sivustolta sekä verkkosivuilta, joihin em. sivustosta on linkit, kerätään käyttäjien anonymiteetti taaten käyttäjätilastoja sekä laatupalautetta, jotta voidaan parantaa palveluväylän toimintaa. Komissio hyväksyy täytääntöönpanosäädöksiä (implementing acts), joissa säädetään tarkemmin käyttäjätilastojen keräämis- ja vaihtomenetelmästä ja joissa annetaan käyttäjäpalautteen keräämistä ja jakamista koskevat säännöt.</p><p> </p><p>Opintopolussa on käytössä <strong>seuraavia ensimmäisen osapuolen evästeitä</strong>. Niiden tarkoitus on</p><ul><li>mahdollistaa sivuston käytön (esim. todentamisevästeet ja tekniset evästeet)<ul><li>Opetushallitus edellyttää, että hyväksyt evästeiden käytön evästebannerissa, voidaksesi käyttää Opintopolku -verkkopalveluamme.</li><li>todentamisevästeet tallennetaan laitteellesi, kun kirjaudut Oma Opintopolkuun käyttäen Suomi.fi -tunnistautumista.</li></ul></li><li>kerätä analytiikkadataa käyttäjän sivulatauksista Opintopolussa.</li><li>analytiikan evästeitä käytetään ainoastaan kehittämistarkoituksiin pyrkimyksenä parantaa sivuston kaikille käyttäjille tarjottavaa palvelua. Opintopolun analytiikan seurannassa käytetään Matomoa.</li></ul><p>Evästeiden avulla seurataan käyttäjän käyttökokemusta verkkosivustolla. Käyttäjätiedot ovat anonyymeja – <strong>kerätystä tiedosta ei voi tunnistaa käyttäjää henkilökohtaisesti</strong>.</p><p>Näitä tietoja <strong>ei myöskään jaeta minkään ulkopuolisen osapuolen kanssa</strong> eikä niitä käytetä muihin tarkoituksiin.</p><p><strong> </strong></p><p><strong>Opintopolun kolmannen osapuolen evästeet</strong></p><p>Opintopolussa on käytössä YouTube ja Instagram, jotka keräävät kolmannen osapuolen evästeitä. Youtubea käytetään Opintopolun ohje- ja opiskelu/uravideoissa.</p><p>Voidaksesi nähdä tällaisen kolmannen osapuolen sisällön sinun on ensin hyväksyttävä kyseisen palvelun omat käyttöehdot. Tämä koskee myös niiden evästekäytäntöjä, joita Opintopolku ei voi valvoa.</p><p>Jos et käytä ulkopuolisten palveluntarjoajien sisältöä, mitään kolmannen osapuolen evästeitä ei asenneta laitteellesi.</p><p><strong>Evästeiden käytön hallinta</strong></p><p>Evästeitä voi vapaasti <strong>hallita ja/tai poistaa</strong>. Ohjeita löytyy esimerkiksi osoitteesta <a href=\"https://www.aboutcookies.org/\" target=\"_blank\">aboutcookies.org</a>.</p><p><strong> </strong></p><p><strong>Evästeiden poistaminen käyttäjän laitteelta</strong></p><p>Voit poistaa kaikki laitteellasi olevat evästeet tyhjentämällä selaimesi selaushistorian. Tämä toiminto poistaa kaikkien käyttämiesi sivustojen asettamat evästeet. Huomaa kuitenkin, että tällöin saatat menettää myös joitakin tallentamiasi tietoja.</p><p><strong>Sivustokohtaisten evästeiden hallinta</strong></p><p>Sivustokohtaisia evästeitä voi hallita selaimen yksityisyys- ja evästeasetuksista.</p><p><strong>Evästeiden estäminen</strong></p><p>Useimmissa uusissa selaimissa voi estää evästeiden asettamisen laitteelle kokonaan, mutta tällöin voit joutua mukauttamaan joitakin asetuksia aina, kun käyt jollakin sivustolla/sivulla. Jotkin palvelut ja toiminnot eivät välttämättä toimi kunnolla (esim. sisäänkirjautuminen).</p>"
                        },
                        browserUpdateText:"Selaimesi {brow_name} on vanhentunut ja Opintopolun toiminnallisuudet eivät toimi. Päivitä selaimesi turvallisempaan, nopeampaan ja helppokäyttöisempään <a{up_but}>Päivitä selain</a><a{ignore_but}>Hylkää</a>"
                    }
                },
                sv: {
                    raamit: {
                        headerAriaLabel: "Navigation",
                        loginLink: "Logga in",
                        logoutLink: "Logga ut",
                        omatsivutLink: "Min Studieinfo",
                        opintopolkuLink: "Studieinfo",
                        omaOpintopolkuLink: "Min Studieinfo",
                        omatsivutRedirectLink: "Gå till Min Studieinfo",
                        eperusteetLink: "eGrunder",
                        eperusteetUrl: "https://egrunder.studieinfo.fi/",
                        ehoksLink: "ePUK",
                        ehoksUrl: "https://studieinfo.fi/ehoks",
                        wordpressRoot: window.url("wp.base"),
                        testEnvWordpressRoot: window.url("wp.test.base.sv"),
                        demoEnvWordpressRoot: window.url("oppija-raamit-web.demo.wordpress.base"),
                        homeLink: {
                            title: "Gå till framsida",
                            image: window.url("oppija-raamit-web.raamit.img.opintopolku.large.sv")
                        },
                        yourEuropeLink: {
                          title: "Denna webbplats är en del av Europeiska kommissionens portal Your Europe. Hittade du det du sökte? Ge respons!",
                          image: window.url("oppija-raamit-web.raamit.img.youreurope"),
                          url: window.url("oppija-raamit-web.raamit.youreurope.palaute.sv")
                        },
                        shortlist: {
                            title: "Minneslista"
                        },
                        opetushallitus: {
                            title: "Utbildningsstyrelsen",
                            image: window.url("oppija-raamit-web.raamit.img.ophLogo.sv"),
                            link: "http://www.oph.fi/startsidan"
                        },
                        opetusministerio: {
                            title: "Undervisnings- och kulturministeriet",
                            image: window.url("oppija-raamit-web.raamit.img.okmLogo.sv"),
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
                                url: window.url("wp.mystudyinfo.sv")
                            },
                            description: {
                                title: "Vad är Studieinfo?",
                                url: window.url("wp.description.sv")
                            },
                            feedback: {
                                title: "Ge feedback – fråga råd",
                                url: window.url("wp.feedback.sv")
                            },
                            registerDescription: {
                                title: "Registerbeskrivning",
                                url: window.url("wp.registerDescription.sv")
                            },
                            index: {
                                title: "Läroanstaltsregister",
                                url: window.url("oppija-raamit-web.index.sv")
                            }
                        },
                        cookie: {
                            info: "Vi använder oss av cookies för att underlätta användningen av webbplatsen.",
                            close: "Stäng"
                        },
                        cookieModal: {
                            header: "Studieinfos kakpolicy (cookies)",
                            info: "<p>En kaka är en liten textfil som webbläsaren lagrar på din dator eller mobila enhet. Den innehåller en unik, anonym tagg med vilken webbtjänsten kan identifiera olika webbläsare som besöker webbplatsen. Med den information som samlas via kakor kan man inte identifiera enskilda användare.</p><p>Utbildningsstyrelsen förutsätter att du accepterar användningen av kakor då du använder vår Studieinfo webbplats.</p>",
                            settings: "Inställningar",
                            agreement: "Jag godkänner följande kakor:",
                            mandatoryCookies: "Nödvändiga kakor",
                            statisticCookies: "Kakor som anknyter till statistik",
                            marketingCookies: "Kakor som anknyter till marknadsföring",
                            accept: "Godkänn kakor",
                            expandCookieText: "Läs mer om kakorna",
                            fullCookieText: "<p><strong>Olika slags kakor</strong></p><p><strong>Förstapartskakor</strong> samlas in på de webbplatser du besöker. Endast den ifrågavarande webbplatsen kan läsa dem. En webbplats kan dessutom använda sig av utomstående tjänster, som innehåller egna kakor. Dessa benämns <strong>trepartskakor</strong>.</p><p>Kakor som sparas permanent i din dator raderas inte automatiskt då du stänger webbläsaren. Kakor som sparas under en session, raderas däremot då sessionen avslutas.</p><p>Syftet med kakor är att spara de val du gjort på en webbplats (i Studieinfo exempelvis minneslistan och språket) för en viss tid. Du behöver då inte göra samma val på nytt då du bläddar mellan olika sidor under en och samma webbsession.</p><p>Genom kakor kan man också samla in anonyma uppgifter om hur användarna fungerar på en webbplats. Då är det inte möjligt att identifiera en enskild användare.</p><p><strong>Till vad används kakor i Studieinfo?</strong></p><p>I Studieinfo används främst förstapartskakor. Utomstående parter har inte tillgång till uppgifterna. I Studieinfo används följande förstapartskakor, vars uppgifter är att</p><ul><li>möjliggöra användningen av webbplatsen (t.ex. autentiseringskakor och tekniska kakor)<ul><li>Utbildningsstyrelsen förutsätter att du godkänner användningen av kakor för att kunna använda vår webbtjänst</li><li>autentiseringskakor sparas på din dator då du loggar in i Min Studieinfo med Suomi.fi-identifiering.</li></ul></li><li>samla analytisk data om nedladdning av sidor i Studieinfo</li></ul><p>Kakor för analysering används endast för att utveckla webbplatsen. Vid uppföljningen används Matomo.</p><p>Med hjälp av kakor utreds också användarerfarenheten av webbplatsen. Uppgifterna är anonyma och användarna kan inte identifieras. Uppgifterna delas inte till utomstående parter eller används för andra ändamål. OBS! Enligt förordningen om gemensam digital ingång för tillhandahållande av information, förfaranden samt hjälp- och problemlösningstjänster insamlas användarstatistik över och respons från användare med beaktande av användarnas anonymitet från webbplatsen Ditt Europa och från de webbplatser som det länkas till från denna webbplats. Avsikten är att förbättra den digitala ingångens funktion. EU-kommissionen godkänner stadgandena om verkställande, vilka närmare bestämmer om vilken metod som används vid insamlande och delning av användaruppgifter. Samtidigt bestäms om regler för insamlandet och delningen av användarresponsen.</p><p> </p><p><strong>Tredjepartskakor i Studieinfo</strong></p><p>I Studieinfo används YouTube och Instagram, vilka samlar uppgifter i form av tredjepartskakor. Youtube används för instruktionsvideor samt i studie-/karriärvideor.</p><p>För att du ska kunna se trepartsuppgifter bör du först godkänna användarvillkoren för ifrågavarande tjänst. Detta gäller också sådan kakpolicy som Studieinfo inte kan kontrollera. Om du inte använder utomstående tjänsteleverantörers innehåll installeras inte heller tredjepartskakor i din apparat.</p><p><strong>Att kontrollera användningen av kakor</strong></p><p>Du kan fritt kontrollera och eller radera kakor. Du hittar mera anvisningar till exempel på adressen <a href=\"https://www.aboutcookies.org/\" target=\"_blank\">aboutcookies.org</a>.</p><p><strong>Att radera kakor från apparater</strong></p><p>Du kan radera alla kakor på din apparat genom att tömma bläddringshistorian. Denna funktion raderar alla kakor på de webbplatser du har besökt. Observera ändå att då du raderar kakorna, kan du gå miste om vissa uppgifter som du har sparat i din apparat.</p><p><strong>Att kontrollera kakor på olika webbplatser</strong></p><p>Du kan kontrollera kakor på olika webbplatser via webbläsarens inställningar för integritet och kakor.</p><p><strong>Att förhindra användningen av kakor</strong></p><p>I de flesta nya webbläsare kan du förhindra att kakor sparas på din apparat helt och hållet. Då kan du ändå vara tvungen att anpassa vissa inställningar då du besöker olika webbplatser. Dessutom kan vissa tjänster och funktioner fungera bristfälligt (till exempel inloggning).</p>"
                        },
                        browserUpdateText:"Din webbläsare {brow_name} är föråldrad och vissa funktioner i Studieinfo fungerar inte. Uppdatera din webbläsare och gör den säkrare, snabbare och tillgängligare. <a{up_but}>Uppdatera webbläsaren</a><a{ignore_but}>Ignorera</a>"
                    }
                },
                en: {
                    raamit: {
                        headerAriaLabel: "Navigation",
                        loginLink: "Log in",
                        logoutLink: "Log out",
                        omaOpintopolkuLink: "My Studyinfo",
                        omatsivutLink: "My Studyinfo",
                        omatsivutRedirectLink: "Go to My Studyinfo",
                        wordpressRoot: window.url("wp.en"),
                        testEnvWordpressRoot: window.url("wp.en"),
                        demoEnvWordpressRoot: window.url("oppija-raamit-web.demo.wordpress.base"),
                        homeLink: {
                            title: "Go to frontpage",
                            image: window.url("oppija-raamit-web.raamit.img.opintopolku.large.en")
                        },
                        yourEuropeLink: {
                          title: "This website is part of the European Commission's Your Europe portal. Did you find what you were looking for? Give feedback!",
                          image: window.url("oppija-raamit-web.raamit.img.youreurope"),
                          url: window.url("oppija-raamit-web.raamit.youreurope.palaute.en")
                        },
                        shortlist: {
                            title: "My shortlist"
                        },
                        opetushallitus: {
                            title: "Finnish National Board of Education",
                            image: window.url("oppija-raamit-web.raamit.img.ophLogo.en"),
                            link: "http://www.oph.fi/english"
                        },
                        opetusministerio: {
                            title: "Ministry of Education and Culture",
                            image: window.url("oppija-raamit-web.raamit.img.okmLogo.en"),
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
                                url: window.url("wp.mystudyinfo.en")
                            },
                            registerDescription: {
                                title: "Register description",
                                url: window.url("wp.registerDescription.en")
                            },
                            index: {
                                title: "Educational institution index",
                                url: window.url("oppija-raamit-web.index.en")
                            }
                        },
                      cookieModal: {
                        header: "Cookies",
                        info: "<p>A cookie is a small text file saved to the user’s terminal device by the browser. It contains an individual, anonymous identifier that the online service uses to identify the different browsers visiting the website. <strong>The information collected by the cookies cannot be used to identify individual users.</strong></p><p>The Finnish National Agency for Education requires that you accept the use of cookies to be able to use our online service.</p>",
                        settings: "Settings",
                        agreement: "Allow following cookies:",
                        mandatoryCookies: "Mandatory cookies",
                        statisticCookies: "Statistical cookies",
                        marketingCookies: "Marketing cookies",
                        accept: "Accept cookies",
                        expandCookieText:  "Read more about cookies",
                        fullCookieText: "<p>Most of the cookies that the National Agency for Education uses are so called <strong>first party cookies </strong>to improve user experience, these are analytics information (Matomo) and identification to My Studyinfo (available with Finnish banking identification or Finnish electronic ID card).</p><p>The <strong>third party cookies</strong> used in Studyinfo are YouTube and Instragram, these are available in the Finnish and Swedish sites.</p><p>Studyinfo uses session cookies that are removed when the browser is closed. Session cookies are used to remember the choices of language and font size during browsing and for web analytics (Matomo). The information used for web analytics is anonymous and the user cannot be identified. The National Agency for Education does not provide information on cookies to others. Please note! According to the Decree on Single Digital Gateway, Your Europe -portal  collects via linked websites, anonymous analytic information (Matomo) and feedback data in order to improve user experience. European Commission approves implementing acts that provide more information on how the data is collected and the rules relating to</p><p>You can disable cookies by changing the settings in your browser to not allow storage of cookies. Please note, however, that restricting the use of cookies may affect the functioning of the website.</p>"
                      },
                        browserUpdateText:"Your web browser {brow_name}, is out of date and Studyinfo’s functions won’t work. Update your browser for more security, speed and the best experience. <a{up_but}>Update browser</a><a{ignore_but}>Ignore</a>"
                    }
                }
            };

            // Override wp root url for demo environment
            if (isDemoEnv()) {
                dictionary.fi.raamit.wordpressRoot = dictionary.fi.raamit.demoEnvWordpressRoot;
                dictionary.sv.raamit.wordpressRoot = dictionary.sv.raamit.demoEnvWordpressRoot;
                dictionary.en.raamit.wordpressRoot = dictionary.en.raamit.demoEnvWordpressRoot
            }

            if (!preDefinedI18n) {
                i18n.init({
                    lng: getInitLang(),
                    resStore: dictionary,
                    fallbackLng: "fi"
                });
            } else {
                i18n.addResourceBundle("fi", "raamit", dictionary.fi.raamit);
                i18n.addResourceBundle("sv", "raamit", dictionary.sv.raamit);
                i18n.addResourceBundle("en", "raamit", dictionary.en.raamit)
            }
            callback()
        })
    }

    function hideActiveLanguage(activeLang) {
        $('ul.header-language li').each(function () {
            if ($(this).attr("id") === "lang-" + activeLang) {
                $(this).hide()
            }
        })
    }

    function getLanguageFromHost(host) {
        if (!host)
            host = document.location.host;
        var x = host.split('.');
        if (x.length < 2) return null;
        var domain = x[x.length - 2];
        if (domain.indexOf('opintopolku') > -1) {
            return 'fi';
        } else if (domain.indexOf('studieinfo') > -1) {
            return 'sv';
        } else if (domain.indexOf('studyinfo') > -1) {
            return 'en'
        }
        return null
    }

    function getHostForLang(url, lang) {
        var langs = {
            'fi': 'opintopolku',
            'sv': 'studieinfo',
            'en': 'studyinfo'
        };
        var modifiedHost = document.location.host;

        var targetDomain = langs[lang] || langs['fi'];
        modifiedHost = modifiedHost.replace('opintopolku', targetDomain);
        modifiedHost = modifiedHost.replace('studieinfo', targetDomain);
        modifiedHost = modifiedHost.replace('studyinfo', targetDomain);

        var parser = document.createElement('a');
        parser.href = url;
        parser.host = modifiedHost;
        return parser.href
    }

    function getInitLang() {
        if (document.location.href.indexOf("wp") > 0) {
            var regexp = /\/wp.?\/(fi|sv|en)/;
            var match = document.location.href.match(regexp);
            if (match != null && match.length > 0) {
                return match[1]
            }
        }
        var lang = getLanguageFromHost();
        if (lang != null) return lang;
        return readLanguageCookie()
    }

    function readLanguageCookie() {
        var lang = jQuery.cookie(i18n.options.cookieName);
        return lang != null ? lang : "fi"
    }

  function checkAcceptedCookies() {
    if(!readAcceptedMandatoryCookie()){
      $('#cookie-modal-backdrop').css('display', 'block');
    }
  }

  function readAcceptedMandatoryCookie() {
    var accept = jQuery.cookie("oph-mandatory-cookies-accepted");
    return accept != null ? true : false
  }

    function updateBasket() {
        var $count = $(".count");
        updateBasketSize($count);
        setInterval(function () {
            if (basketSizeChanged($count)) {
                updateBasketSize($count)
            }
        }, 500)
    }

    function updateLoginSection() {
        var shibbolethcheckUrl = window.url("oppija-raamit.shibboleth.check");
        $.ajax(shibbolethcheckUrl).done(function () {
            var loggedIn = jQuery.cookie("shibboleth_loggedIn") === "true";
            $(".header-logged-in").toggle(loggedIn);
            $(".header-logged-out").toggle(!loggedIn);

            if (isDemoEnv()) {
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
        var basket = basketContent();
        if (basket) {
            return "(" + basket.length + ")"
        } else {
            return "(0)"
        }
    }

    function basketContent() {
        var basket = jQuery.cookie("basket");
        if (basket) {
            return JSON.parse(decodeURIComponent(basket))
        } else {
            return undefined
        }
    }

    function getTranslation(path) {
        var translationUrl;

        if (path != null && path.length > 0) {
            translationUrl = window.url("wp.api.translate.path", path)
        }
        else {
            translationUrl = window.url("wp.api.translate")
        }
        return $.ajax(translationUrl)
    }

    function goToLanguageRoot(lang) {
        if (getLanguageFromHost()) {
            window.location.href = getWpHost(getHostForLang(getScriptDirectory(), lang || readLanguageCookie()), lang)
        } else {
            var wpRoot = i18n.t("raamit:testEnvWordpressRoot");
            window.location.pathname = wpRoot
        }
    }
})());
