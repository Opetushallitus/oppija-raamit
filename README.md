## oppija-raamit

### Käyttö

Oppija-raamit otetaan käyttöön yhdellä script-tägillä:

    <script type="text/javascript" src="https://opintopolku.fi/oppija-raamit/apply-raamit.js"></script>

Tiedostossa `src/main/webapp/index.html` on esimerkkiapplikaatio, joka käyttää oppija-raameja.

Käynnistä esimerkkiapplikaatio näin:

    mvn tomcat6:run

    open http://localhost:8099/oppija-raamit/

### TODO

- suorituskyky (wordpressin hitauden taklaus cachella, mahdollisesti oppija-raamit-materiaalin konkatenointi yhdeksi javascript-tiedostoksi)
- css on ripattu koulutusinformaatiosta
- navigation.js on ruma klöntti, joka ripattu koulutusinformaatiosta, johon se on puolestaan ripattu internetistä. Toisaalta, se toimii.
