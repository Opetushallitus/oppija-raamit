## oppija-raamit

### Käyttö

Oppija-raamit otetaan käyttöön lisäämällä script-tägi

**Shibboleth**

    <script id="apply-raamit" type="text/javascript" src="/oppija-raamit/js/apply-raamit.js"></script>

**CAS**

    <script id="apply-raamit" type="text/javascript" src="/oppija-raamit/js/apply-raamit-cas.js"></script>

Lisäksi raamit vaativat niitä käyttävää palvelua toteuttamaan seuraavat funktiot.
(vain Shibboleth).

    Service.login()  -- Kutsutaan kun raamien "kirjaudu sisään" nappia painetaan.
    Service.logout() -- Kutsutaan kun raamien "kirjaudu ulos" nappia painetaan.
    Service.getUser() -- Kutsutaan raamien latauksen yhteydessä.

Näiden lisäksi löytyy myös seuraavat vapaavalintaiset hookit.

    Service.changeLanguage(language) -- Kutsutaan kun raamien kielinappeja painetaan.

Raamien kielinapit asettavat `lang`-cookien arvoilla `fi`, `sv` ja `en`.
Raamit ilmoittavat käyttäjälle kekseistä ja hyväksyntä tallennetaan cookieen `oph-cookies-accepted`.

Raamit käyttävät Source Sans Pro -fonttia, jos se löytyy (jos ei löydy, fallback on "sans-serif").
Jos halutaan Source Sans Pro -fontti, raameja käyttävän sivuston pitää itse ladata se (painot regular 400, semibold 600 ja bold 700).

Normaalisti raamit lisätään body-elementin alkuun ja loppuun. Tarvittaessa raameja käyttävä sivusto voi
määritellä muun paikan DOM-puussa käyttämällä id="oppija-raamit-header-here" ja/tai id="oppija-raamit-footer-here".

**Evästemodaali**

Evästemodaali otetaan käyttöön lisäämällä script-tagi:

    <script id="apply-modal" type="text/javascript" src="/oppija-raamit/js/apply-modal.js"></script>

Oletuksena modaali päättelee kielen domainista (opintopolku/studyinfo/studieinfo), mutta sille voidaan tarvittaessa määrittää kieli lang-parametrilla:

    <script id="apply-modal" type="text/javascript" lang="sv" src="/oppija-raamit/js/apply-modal.js"></script>

Evästemodaalista on kaksi eri versiota: EU-komission SDG (Single Digital Gateway) -asetuksen mukaisilla infoteksteillä varustettu versio, sekä suppeampi, joka on tarkoitettu sivustoille, joissa SDG-analytiikkadataa ei kerätä.

Oletuksena näytetään SDG-tekstit. Suppeamman version saa käyttöön määrittelemällä sdg-parametrin arvoksi "false":

    <script id="apply-modal" type="text/javascript" sdg="false" src="/oppija-raamit/js/apply-modal.js"></script>

Normaalisti evästemodaali lisätään headerin jälkeen, mutta tarvittaessa voidaan määritellä muu paikka sivulla käyttämällä id="oppija-raamit-modal-here".

Käynnistä esimerkkiapplikaatio näin:

    npm install
    npm run templates && npm start
    open http://localhost:8080

### Kehitysohjeet

Projekti käyttää raamien paketointiin webpack nimistä rakennustyökalua.
Kirjoitushetkellä OPH:lla ei ole mitään järkevää paikkaa tarjoilla staattisia tiedostoja.
Sen vuoksi projekti käyttää Spring Boottia ja tiedostopolut voivat olla vähän rumia.

Javascript ja CSS tiedostot on tehty käyttäen uusia ES ja CSS ominaisuuksia ja ne käännetään babelilla yhteensopivaan muotoon.
Html-pohjat ajetaan i18n prosessorin lävitse ja niistä muodostetaan omat kieliversionsa. Ne siis käännetään jo valmiiksi.

    src/js <-- Javascript
    src/locales <-- Lokalisaatiot
    src/templates <-- Lokalisaatioavaimet sisältävät html-pohjat
    src/styles <-- Tyylitiedostot
    src/main/java <-- Spring Boot applikaatio
    src/main/resources/public <-- Tuotannossa jaettavat staattiset tiedostot (generoidaan)

