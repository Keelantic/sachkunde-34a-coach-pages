# Sachkunde 34a Coach – öffentliche Pflichtseiten

Statische, barrierearme Informationen für die iOS-/Android-App. Die feste öffentliche Basis ist
[https://keelantic.com/apps/34a-coach/](https://keelantic.com/apps/34a-coach/).

## Dateien und Prüfung

- `index.html`, `datenschutz/`, `nutzungsbedingungen/`, `support/`, `konto-loeschen/`
- `404.html`, `.htaccess`, `assets/styles.css`, `sitemap.xml`
- `legacy-pages/`: sechs eigenständige Weiterleitungsseiten für die bisherigen GitHub-Adressen
- `scripts/`: Validierung, explizite Upload-Dateiliste, Build und öffentliche Live-Prüfung

```sh
npm test
npm run build
npm run build:legacy
npm run serve
```

Die Vorschau liegt unter `http://127.0.0.1:4173/apps/34a-coach/`. Schmale Breite, 200 % Zoom,
Light/Dark und Tastaturnavigation prüfen. Die Validierung prüft weiterhin Inhalte, deutsche
Dokumentstruktur, Canonical-URLs, Indexierbarkeit, Linkziele und doppelte IDs; zusätzlich 404,
HTTPS-Konfiguration, Sitemap, Eigentums-Tag und jede alte Weiterleitungsseite.

`npm run build` kopiert ausschließlich die neun Website-Dateien nach `dist/strato/`, einschließlich
`.htaccess`. Keine Repository-, Workflow-, Skript-, Paket-, README- oder Agent-Dateien werden
veröffentlicht. Es wird **keine robots.txt** ausgeliefert.

## STRATO-Ziel und eigener Zugang

Die Hauptdomain zeigt im geprüften Hosting-Paket auf `/keelantic`.
Der öffentliche Pfad `/apps/34a-coach/` liegt deshalb im Dateimanager unter
`/keelantic/apps/34a-coach/`. Die bestehende Website, ihr Impressum, ihre `.htaccess`
und ihre robots.txt dürfen weder ersetzt noch gelöscht werden.

Unter **Datenbanken und Webspace → SFTP & SSH → Neu anlegen** einen eigenen Zugang vom Typ
**SFTP** erstellen. Als Stammverzeichnis exakt `/keelantic/apps/` auswählen. STRATO
beschränkt diesen Benutzer auf das Verzeichnis und seine Unterordner. Benutzername und Server
werden im Kundenbereich angezeigt; das Passwort legt ausschließlich die Inhaberin selbst fest.
Kein Hauptzugang und kein SSH-Terminalzugriff sind nötig. Der Unterordner `34a-coach` muss
vor dem ersten automatischen Upload bereits existieren.

Innerhalb dieses eingeschränkten Zugangs lautet das feste Upload-Ziel **`/34a-coach/`**.
Dies ist kein Upload in das Webspace-Stammverzeichnis: Der SFTP-Benutzer sieht `/apps/` als `/`.
Eine andere Benutzerwurzel ist mit diesem Workflow nicht zulässig.

In **GitHub → Settings → Environments → strato-production → Environment secrets** selbst setzen:

| Secret                    | Inhalt                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `STRATO_SFTP_HOST`        | Der im STRATO-SFTP-Bereich angezeigte Servername, ohne Protokoll oder Pfad.                                                                                                                                                          |
| `STRATO_SFTP_USER`        | Der automatisch erzeugte Benutzername des auf `/keelantic/apps/` eingeschränkten Zugangs.                                                                                                                                            |
| `STRATO_SFTP_PASSWORD`    | Das selbst gesetzte Passwort dieses Benutzers. Nicht im Chat oder in Dateien weitergeben.                                                                                                                                            |
| `STRATO_SFTP_PORT`        | `22`                                                                                                                                                                                                                                 |
| `STRATO_SFTP_KNOWN_HOSTS` | Der zum Server gehörende, anhand von STRATOs Angaben überprüfte öffentliche SSH-Hostschlüssel im OpenSSH-known_hosts-Format. Bei Port 22 beginnt die Zeile mit dem Servernamen, gefolgt von Schlüsseltyp und öffentlichem Schlüssel. |

Passwörter und private Schlüssel gehören nicht in dieses Repository. Der zusätzliche öffentliche
Hostschlüssel verhindert, dass der Upload einen unbekannten Server ungeprüft akzeptiert.
Die Upload-Action ist auf den Commit von `wlixcc/SFTP-Deploy-Action` v1.2.6 festgelegt.
Sie läuft ausschließlich mit SFTP, festem Ziel, eingeschalteter Serverprüfung und
`delete_remote_files: false`. Es gibt keinen Remote-Löschschritt oder Mirror mit Löschoption.

## Automatischer Ablauf und Erstumzug

Pull Requests gegen `main` prüfen nur. Ein Push auf `main` führt erst `npm test` aus, baut die
Dateiliste und lädt per SFTP hoch. Vorher werden die öffentlichen Hauptseite-, Impressum- und
Root-robots.txt-Antworten gehasht; danach müssen diese unverändert sein. Alle fünf App-Seiten,
CSS, Links, Sitemap, HTTP→HTTPS und eigene 404 müssen funktionieren.

Erst nach erfolgreicher Live-Prüfung veröffentlicht der folgende Job ausschließlich
`dist/github-redirects/` über den bestehenden GitHub-Pages-Dienst. Jede alte Seite hat eine
Meta-Weiterleitung, Canonical, `noindex,follow` und einen sichtbaren Link zum jeweiligen neuen
Ziel. Die alte 404 verweist auf die neue Startseite. Die alten Adressen werden nicht gelöscht.

Für eine einmalige Erstveröffentlichung über den angemeldeten STRATO-HTTPS-Dateimanager kann
anschließend der manuelle Workflow-Modus `verify-and-publish-redirects` verwendet werden. Er
benötigt keine SFTP-Secrets, prüft die neue Website und veröffentlicht die alten Weiterleitungen
nur bei Erfolg. `deploy` ist der normale SFTP-Modus. Vor Veröffentlichung beide Stände prüfen.

## robots.txt der Hauptdomain

Die vorhandene Datei **nicht überschreiben**. Die Inhaberin kann darin diese Zeile ergänzen:

```text
Sitemap: https://keelantic.com/apps/34a-coach/sitemap.xml
```

## Konsolen- und App-Einträge nach Freigabe

| Stelle                                                                 | Neue Adresse / Änderung                                                                                                                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Store Connect: Datenschutz                                         | `https://keelantic.com/apps/34a-coach/datenschutz/`                                                                                                                                   |
| App Store Connect: Support                                             | `https://keelantic.com/apps/34a-coach/support/`                                                                                                                                       |
| App Store Connect: eigene Nutzungsbedingungen, falls verwendet         | `https://keelantic.com/apps/34a-coach/nutzungsbedingungen/`                                                                                                                           |
| Google Play: Datenschutz                                               | `https://keelantic.com/apps/34a-coach/datenschutz/`                                                                                                                                   |
| Google Play: externer Kontolöschweg                                    | `https://keelantic.com/apps/34a-coach/konto-loeschen/`                                                                                                                                |
| Google Auth Platform: Startseite                                       | `https://keelantic.com/apps/34a-coach/`                                                                                                                                               |
| Google Auth Platform: Datenschutz / Nutzungsbedingungen                | Die jeweiligen Unterseiten oben; autorisierte Domain `keelantic.com` ergänzen, bestehende Auth-Domains erhalten.                                                                      |
| Firebase: öffentliche Anmelde-/Projektangaben und ggf. Website-Domains | Neue Website verwenden; OAuth-Client-IDs und bestehende App-Anmeldekonfiguration nicht ersetzen.                                                                                      |
| Search Console                                                         | Domain-Property `keelantic.com` mit demselben berechtigten Google-Konto anlegen/prüfen; den dafür erzeugten DNS-TXT-Wert bei STRATO ergänzen, vorhandene TXT-/Mail-Einträge erhalten. |
| EAS / App-Repository                                                   | Vier `EXPO_PUBLIC_*_URL`-Werte in `.env.example`, Build-Profilen und ggf. vorhandenen EAS-Umgebungsvariablen abgleichen; erst nach Freigabe live umstellen.                           |

Der am 3. November 2026 gelesene STRATO-Kundenbereich bestätigt einen bereits am 9. Juni 2026
abgeschlossenen AVV. Es wurde kein Vertrag neu abgeschlossen. Die Hosting-Angaben verwenden
entsprechend dem aktuellen STRATO-Impressum **STRATO GmbH**, Serverstandort Deutschland.
