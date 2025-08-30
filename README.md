# Joel Starter App (PWA)

Eine kleine, installierbare Web‑App (PWA) für **Notizen**, mit **Suche**, **Darkmode** und **Offline‑Unterstützung**.

## Schnellstart (lokal)
1. ZIP entpacken.
2. Einen lokalen Server starten (Service Worker braucht https/localhost):
   - Mit Python: `python3 -m http.server 5173` und dann `http://localhost:5173` öffnen.
   - Oder VS Code „Live Server“ Erweiterung.
3. App im Browser öffnen und „Zum Home‑Bildschirm hinzufügen“ (Installieren).

## Deployment (kostenlos)
- **GitHub Pages**, **Netlify** oder **Vercel**: Projekt hochladen, als statische Seite veröffentlichen.
- Danach kannst du die App direkt auf dem Handy installieren.

## Funktionen
- ✍️ Notizen anlegen, bearbeiten (inline) und löschen
- 🔎 Live‑Suche (Titel & Inhalt)
- 🌓 Darkmode (merkt sich die Einstellung)
- 📤 Export / 📥 Import (JSON)
- 📶 Offline‑fähig dank Service Worker
- 📱 Installierbar (Manifest + Icons)

## Anpassungsideen
- Kategorien/Labels & Farben
- Passwort/Pin‑Sperre (nur lokal)
- Bild‑Uploads (Base64, IndexedDB)
- Synchronisation (wenn du später ein Backend willst: Firebase, Supabase, Appwrite etc.)

---

Made for Joel ✨
