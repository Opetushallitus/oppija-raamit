## oppija-raamit

### Käyttö

Oppija-raamit otetaan käyttöön lisäämällä script-tägi

    <script id="apply-raamit" type="text/javascript" src="https://opintopolku.fi/oppija-raamit/apply-raamit.js"></script>
    
Lisäksi raamit vaativat niitä käyttävää palvelua toteuttamaan seuraavat funktiot.

    Raamit.login()
    Raamit.logout()
    Raamit.getUser()

Käynnistä esimerkkiapplikaatio näin:

    npm install
    npm start
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

