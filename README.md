## oppija-raamit

### Käyttö

Oppija-raamit otetaan käyttöön yhdellä script-tägillä:

    <script id="apply-raamit" type="text/javascript" src="https://opintopolku.fi/oppija-raamit/apply-raamit.js"></script>

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

    src/main/src/js <-- Javascript
    src/main/locales <-- Lokalisaatiot
    src/main/templates <-- Lokalisaatioavaimet sisältävät html-pohjat
    src/main/styles <-- Tyylitiedostot
