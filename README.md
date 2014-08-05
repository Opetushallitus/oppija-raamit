## oppija-raamit

### Käyttö

Oppija-raamit otetaan käyttöön yhdellä script-tägillä:

    <script id="apply-raamit" type="text/javascript" src="https://opintopolku.fi/oppija-raamit/apply-raamit.js"></script>

Tiedostossa `src/main/webapp/index.html` on esimerkkiapplikaatio, joka käyttää oppija-raameja.

Käynnistä esimerkkiapplikaatio näin:

    ./run.sh

    open http://localhost:8099/oppija-raamit/


### Kehitysohjeet

CSS-tiedosto generoidaan less-fileistä käyttäen gulpia. Asenna lokaalit NPM-paketit:

    npm install

Käännä LESS-tiedostot CSS:ksi:

    node_modules/gulp/bin/gulp.js compile

Tai laita watch käyntiin:

    node_modules/gulp/bin/gulp.js

CSS-tiedosto menee myös versionhallintaan, ainakin toistaiseksi.

### TODO

- suorituskyky (wordpressin hitauden taklaus cachella, mahdollisesti oppija-raamit-materiaalin konkatenointi yhdeksi javascript-tiedostoksi)
- css on ripattu koulutusinformaatiosta
- navigation.js on ruma klöntti, joka ripattu koulutusinformaatiosta, johon se on puolestaan ripattu internetistä. Toisaalta, se toimii.
