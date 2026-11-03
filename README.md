# Sachkunde 34a Coach – öffentliche Pflichtseiten

Die Website liegt ausschließlich bei STRATO unter
[keelantic.com/apps/34a-coach/](https://keelantic.com/apps/34a-coach/).

## Öffentliche Seiten

- Startseite: https://keelantic.com/apps/34a-coach/
- Datenschutz: https://keelantic.com/apps/34a-coach/datenschutz/
- Nutzungsbedingungen: https://keelantic.com/apps/34a-coach/nutzungsbedingungen/
- Support: https://keelantic.com/apps/34a-coach/support/
- Konto löschen: https://keelantic.com/apps/34a-coach/konto-loeschen/

## Prüfen

```sh
npm test
npm run check:live
```

Die Validierung prüft Inhalte, deutsche Dokumentstruktur, Canonical-URLs,
Indexierbarkeit, Links, doppelte IDs, HTTPS-/404-Konfiguration, Sitemap und
Google-Eigentums-Tag. GitHub Actions führt ausschließlich diese Validierung aus.
Es gibt keinen automatischen Upload und keine Weiterleitungsseiten.

## Bei STRATO manuell hochladen

Im HTTPS-Dateimanager ist das Ziel ausschließlich `/keelantic/apps/34a-coach/`.
Die Domain `keelantic.com` zeigt auf `/keelantic`.

Nur diese neun Dateien einschließlich ihrer Unterordner hochladen:

- `index.html`
- `datenschutz/index.html`
- `nutzungsbedingungen/index.html`
- `support/index.html`
- `konto-loeschen/index.html`
- `404.html`
- `.htaccess`
- `assets/styles.css`
- `sitemap.xml`

Repository-, Skript-, Workflow- und Dokumentationsdateien nicht hochladen.
Die bestehende Hauptwebsite, ihr Impressum, ihre `.htaccess` und die Root-robots.txt
dürfen nicht überschrieben oder gelöscht werden. Ein zusätzlicher Dateizugang
oder GitHub-Zugangsdaten sind für den manuellen Upload nicht erforderlich.

## robots.txt der Hauptdomain

Keine robots.txt in diesem App-Unterordner ablegen. Diese Zeile kann in der
vorhandenen Root-Datei ergänzt werden:

```text
Sitemap: https://keelantic.com/apps/34a-coach/sitemap.xml
```

Der STRATO-AVV besteht seit 9. Juni 2026. Hosting-Anbieter ist STRATO GmbH,
Serverstandort Deutschland.
