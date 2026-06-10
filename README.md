# ⚽ MMM-FIFAWorldCupDashboard

Ein hochmodernes FIFA World Cup Dashboard Modul für MagicMirror² im TV-Broadcast-Stil.

Optimiert für 27" Full HD Displays im Fullscreen Mode.

---

## ⚙️ Installation

'''cd ~/MagicMirror/modules
git clone https://github.com/wiiare/MMM-FIFAWorldCupDashboard.git
cd MMM-FIFAWorldCupDashboard
npm install

---

# 🌍 Features

## 📊 Gruppenphase (FIFA Tabellenstil)
- Darstellung aller Gruppen A–L
- Sortierung nach Platzierung
- FIFA-typische Tabellenstruktur
- Spalten:
  - # (Rank)
  - Team (mit Flagge)
  - S (Spiele)
  - GD (Tordifferenz)
  - P (Punkte)
- Top 2 Teams visuell hervorgehoben
- Flaggen automatisch via flagcdn

---

## 📅 Nächste Spiele (Next Matches)
- Anzeige der kommenden Spiele
- Home & Away Teams mit Flaggen
- VS mittig positioniert
- Datum + Uhrzeit rechts
- Saubere FIFA Broadcast Darstellung

---

## 🔴 Live Spiele
- Live Score Anzeige
- Automatische Status-Erkennung (in_progress)
- Echtzeit Score Updates
- Flaggen beider Teams sichtbar

---

## 📰 RSS News Feed
- Integration von kicker WM Feed
- Quelle:
https://newsfeed.kicker.de/news/wm
- Live News im Dashboard Bereich

---

## 🏆 Knockout Phase (Turnierbaum)
- Automatische Anzeige der KO-Runde:
  - R32
  - R16
  - Viertelfinale
  - Halbfinale
  - Finale
- Turnierbaum Layout (Tree View)
- FIFA-ähnliche Darstellung
- Aktivierung:
  - KO-Ansicht erscheint 2 Tage vor Start

---

## 🔁 Automatischer Seitenwechsel
- Seite 1: Gruppen + Matches + News
- Seite 2: Knockout Turnierbaum
- Wechselintervall: 20 Sekunden
- KO-Seite nur aktiv wenn Startzeit erreicht

---

## 🎨 FIFA Broadcast Design
- Dunkles Stadion-Blau Theme
- Neon Cyan Akzente
- TV Studio Look
- Klare Typografie für Entfernungssicht
- Optimiert für Wohnzimmer Displays

---

## 🏳️ Flaggen System
Flaggen werden über flagcdn geladen:

https://flagcdn.com/w20/{country-code}.png

Beispiele:
- Brazil → br
- Germany → de
- Mexico → mx

---

## 📡 Datenquellen

FIFA Matches:
https://play.fifa.com/json/bracket_predictor/rounds.json

FIFA Teams:
https://play.fifa.com/json/bracket_predictor/squads.json

---

## 🧠 Datenstruktur

Match Objekt:
{
  "homeName": "Brazil",
  "awayName": "Germany",
  "homeScore": 2,
  "awayScore": 1,
  "status": "scheduled | in_progress",
  "date": "2026-06-13T20:00:00+01:00"
}

---

Team Objekt:
{
  "id": 3,
  "name": "Brazil",
  "abbr": "BRA",
  "group": "c",
  "groupPoints": 6,
  "groupGoalsDifference": 4,
  "groupPlayed": 3
}

---

## 🐳 Docker Support

volumes:
  - ./modules:/opt/magic_mirror/modules

---


## 📦 Dependencies

npm install axios
npm install xml2js

---

## ⚙️ MagicMirror Config

{
    module: "MMM-FIFAWorldCupDashboard",
    position: "fullscreen_above",
    config: {
        updateInterval: 30000,
        testMode: false,
        showRSS: true,
        rssUrl: "https://newsfeed.kicker.de/news/wm"
    }
}

---

## 🧪 Test Mode

config: {
    testMode: true
}

---

## 📺 Layout (27 Zoll optimiert)

- 4 Spalten Gruppen Grid
- FIFA Tabellen Design
- VS zentral im Match Layout
- Datum rechts außen
- Live Scores prominent

---

## 🔥 Rendering Logik

- Daten via Socket Notification
- Auto Refresh
- Seitenwechsel alle 20 Sekunden
- KO aktiv 48h vor Start

---

## 🛠 Troubleshooting

Keine Daten:
- Internet prüfen
- FIFA API erreichbar

Flaggen fehlen:
- ISO Code prüfen

Axios Fehler:
npm install axios

---

## 👨‍💻 Author

MagicMirror² Community Module

---

## 📜 License

MIT
