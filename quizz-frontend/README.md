# Quizz App – Frontend (Angular)

Eine mehrsprachige Quiz-Webanwendung entwickelt mit **Angular 17+** (Standalone Components). Das Frontend kommuniziert mit dem Spring Boot Backend über eine REST-API und unterstützt die Sprachen Deutsch, Englisch und Französisch.

---

## Inhaltsverzeichnis

- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [Seitenübersicht & Routing](#seitenübersicht--routing)
- [Services](#services)
- [Docker](#docker)
- [Verwendung](#verwendung)

---

## Technologien

- **Angular 17+** (Standalone Components, keine NgModules)
- **TypeScript**
- **Angular Router** – clientseitiges Routing mit Fallback auf `index.html`
- **HttpClient** – REST-API-Kommunikation mit dem Backend
- **Angular Animations**
- **Node.js 20** (Build-Umgebung)
- **nginx** (Produktions-Webserver + Reverse Proxy)
- **Docker** (Multi-Stage Build)

---

## Projektstruktur

```
quizz-frontend/
├── src/
│   ├── main.ts                        # Bootstrap der Anwendung
│   └── app/
│       ├── app.component.ts           # Root-Component (RouterOutlet)
│       ├── app.config.ts              # App-Konfiguration (Router, HttpClient, Animations)
│       ├── app.routes.ts              # Routendefinitionen
│       │
│       ├── components/
│       │   ├── layout/                # Layout-Komponenten (Header, Footer, etc.)
│       │   ├── shared/                # Wiederverwendbare Komponenten
│       │   └── pages/
│       │       ├── landing-page/      # Startseite
│       │       ├── player-setup-page/ # Spieler anlegen / auswählen
│       │       ├── category-selection-page/  # Kategorien wählen
│       │       ├── game-config-page/  # Spielkonfiguration (Fragenanzahl, Sprache)
│       │       ├── quizz-page/        # Quizfragen & Antworten
│       │       │   ├── quiz-page.component.ts   (9.7 KB)
│       │       │   ├── quiz-page.component.html (4 KB)
│       │       │   └── quiz-page.component.css  (7 KB)
│       │       ├── results-page/      # Ergebnisanzeige
│       │       └── pipes/             # Angular Pipes
│       │
│       ├── models/                    # TypeScript Interfaces / Datenmodelle
│       │
│       └── services/
│           ├── api/                   # API-Service(s) für Backend-Kommunikation
│           ├── game-state.service.ts  # Globaler Spielzustand (4 KB)
│           ├── language.service.ts    # Sprachverwaltung (DE/EN/FR)
│           └── translation.service.ts # Übersetzungen laden & bereitstellen
│
├── nginx.conf                         # nginx-Konfiguration (SPA + Reverse Proxy)
├── Dockerfile                         # Multi-Stage Build
└── package.json
```

---

## Seitenübersicht & Routing

| Route | Komponente | Beschreibung |
|---|---|---|
| `/` | `LandingPageComponent` | Startseite mit Sprachauswahl |
| `/player` | `PlayerSetupPageComponent` | Spieler anlegen oder auswählen |
| `/categories` | `CategorySelectionPageComponent` | Themenkategorien auswählen |
| `/config` | `GameConfigPageComponent` | Fragenanzahl & Spielmodus konfigurieren |
| `/quiz` | `QuizPageComponent` | Fragen beantworten |
| `/results` | `ResultsPageComponent` | Ergebnis & Auswertung anzeigen |
| `**` | → `/` | Alle unbekannten Routen → Startseite |

---

## Services

### `GameStateService`
Verwaltet den globalen Spielzustand (Spieler-ID, gewählte Kategorien, Sprache, laufendes Spiel, Antworten). Wird zwischen den Seiten geteilt.

### `LanguageService`
Speichert und liefert die aktuell gewählte Sprache (`DE`, `EN`, `FR`). Wird beim Start der App initialisiert.

### `TranslationService`
Lädt die Übersetzungsdaten für die aktuelle Sprache vom Backend oder aus lokalen Ressourcen und stellt sie allen Komponenten bereit.

### `api/`
Enthält die HTTP-Services für die Kommunikation mit dem Spring Boot Backend (`/api/`-Endpunkte):
- Spieler anlegen / abrufen
- Kategorien laden & Verfügbarkeit prüfen
- Spiel starten (klassisch & smart)
- Antworten einreichen & Ergebnis abrufen

---

## Docker

Das Projekt verwendet einen **Multi-Stage Docker Build** mit nginx als Produktionsserver.

```dockerfile
# BUILD STAGE
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# RUN STAGE
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/*/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx-Konfiguration (`nginx.conf`)

```nginx
server {
  listen 80;
  root /usr/share/nginx/html/browser;
  index index.html;

  # SPA Fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Reverse Proxy → Spring Boot Backend
  location /api/ {
    proxy_pass http://backend:8080/;
  }
}
```

> Das nginx-Routing leitet alle `/api/`-Anfragen direkt an den Backend-Container (`backend:8080`) weiter. Dadurch ist kein separater CORS-Aufwand im Produktionsbetrieb nötig.

### Image bauen & starten
```bash
docker build -t quizz-frontend .
docker run -p 80:80 quizz-frontend
```

---

## Verwendung (lokal ohne Docker)

### Voraussetzungen
- **Node.js 20+**
- **Angular CLI**: `npm install -g @angular/cli`

### Installation & Start
```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
ng serve
```

Die App ist erreichbar unter: `http://localhost:4200`

> Das Backend muss unter `http://localhost:8080` laufen, damit die API-Aufrufe funktionieren.