## oppija-raamit

### Käyttö

Oppija-raamit otetaan käyttöön lisäämällä script-tägi

    <script id="apply-raamit" type="text/javascript" src="/oppija-raamit/js/apply-raamit.js"></script>
    
Lisäksi raamit vaativat niitä käyttävää palvelua toteuttamaan seuraavat funktiot.

    Service.login()  -- Kutsutaan kun raamien "kirjaudu sisään" nappia painetaan.
    Service.logout() -- Kutsutaan kun raamien "kirjaudu ulos" nappia painetaan.
    Service.getUser() -- Kutsutaan raamien latauksen yhteydessä.
    
Näiden lisäksi löytyy myös seuraavat vapaavalintaiset hookit.
    
    Service.changeLanguage(language) -- Kutsutaan kun raamien kielinappeja painetaan.
    
Raamien kielinapit asettavat `lang`-cookien arvoilla `fi`, `sv` ja `en`.
Raamit ilmoittavat käyttäjälle kekseistä ja hyväksyntä tallennetaan cookieen `oph-cookies-accepted`.


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

