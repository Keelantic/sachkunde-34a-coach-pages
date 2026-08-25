# Sachkunde 34a Coach – öffentliche Pflichtseiten

Statische, barrierearme Informationsseiten für Datenschutz, Nutzungsbedingungen, Support und den
externen Kontolöschweg der iOS- und Android-App. Dieses Repository enthält bewusst keinen
App-Quellcode, keine Firebase-Konfiguration und keine internen Release-Unterlagen.

## Veröffentlichung

GitHub Actions validiert alle Pflichtseiten und veröffentlicht den Stand von `main` über GitHub
Pages. Die produktive Fallback-URL lautet:

`https://keelantic.github.io/sachkunde-34a-coach-pages/`

Vor einem Merge muss `npm test` erfolgreich sein. Betreiber- und Kontaktdaten entsprechen dem
bereits öffentlich zugänglichen Keelantic-Impressum. Inhaltliche und rechtliche Owner-Freigaben
werden außerhalb dieses technischen Repositories dokumentiert.

## Local review

```sh
npm test
npm run serve
```

Open `http://127.0.0.1:4173/` and verify at narrow width, 200% zoom, Light/Dark mode and keyboard
navigation.

## Intended stable paths

- `/nutzungsbedingungen/`
- `/datenschutz/`
- `/support/`
- `/konto-loeschen/`

Diese Pfade werden in der App auf folgende Variablen abgebildet:

- `EXPO_PUBLIC_TERMS_URL`
- `EXPO_PUBLIC_PRIVACY_URL`
- `EXPO_PUBLIC_SUPPORT_URL`
- `EXPO_PUBLIC_ACCOUNT_DELETION_URL`

Die Kontolöschseite enthält neben dem In-App-Verfahren einen externen, überwachten Anfrageweg und
erläutert gelöschte sowie gegebenenfalls aufbewahrte Daten und die getrennte Store-Kündigung.
