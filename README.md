# QuizzGame – Mehrsprachige Quiz-Webanwendung

Eine vollständige Webanwendung für interaktive Quiz-Spiele mit mehrsprachiger Unterstützung (DE/EN/FR). Das Projekt besteht aus einem **Angular-Frontend**, einem **Spring Boot-Backend** und einer **MySQL-Datenbank**, vollständig containerisiert mit **Docker Compose**.

---

## Inhaltsverzeichnis

- [Architektur](#architektur)
- [Projektstruktur](#projektstruktur)
- [Schnellstart mit Docker](#schnellstart-mit-docker)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Services](#services)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Dokumentation](#dokumentation)

---

## Architektur

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Network: quizznet             │
│                                                          │
│  ┌──────────────┐     /api/     ┌──────────────────┐    │
│  │   Frontend   │ ──────────▶  │     Backend       │    │
│  │  Angular 17  │  (nginx      │  Spring Boot 3    │    │
│  │  nginx:80    │  proxy)      │  Gradle / Java 17 │    │
│  └──────────────┘              └────────┬─────────┘    │
│       :8083                             │               │
│                                         ▼               │
│                              ┌──────────────────┐       │
│                              │      MySQL 8.0   │       │
│                              │   mysql_data vol │       │
│                              └──────────────────┘       │
│                                                          │
│                              ┌──────────────────┐       │
│                              │     Adminer      │       │
│                              │   DB-Verwaltung  │       │
│                              └──────────────────┘       │
│                                   :8082                  │
└─────────────────────────────────────────────────────────┘
```

| Service | Technologie | Port |
|---|---|---|
| **Frontend** | Angular 17 + nginx | `8083` |
| **Backend** | Spring Boot 3 + Gradle | `8080` |
| **Datenbank** | MySQL 8.0 | intern |
| **Adminer** | Adminer (DB-UI) | `8082` |

---

## Projektstruktur

```
QuizzGame/
├── .github/                   # GitHub Actions / CI-CD
├── quizz-backend/             # Spring Boot Backend
│   ├── src/
│   ├── build.gradle
│   └── Dockerfile
├── quizz-frontend/            # Angular Frontend
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml         # Gesamte Container-Orchestrierung
├── .env.example               # Vorlage für Umgebungsvariablen
└── README.md
```

---

## Schnellstart mit Docker

### 1. Repository klonen
```bash
git clone https://github.com/<dein-username>/QuizzGame.git
cd QuizzGame
```

### 2. Umgebungsvariablen konfigurieren
```bash
cp .env.example .env
```
Öffne `.env` und passe die Werte an (Passwörter, Datenbankname):
```env
MYSQL_ROOT_PASSWORD=sicheres_passwort
MYSQL_DATABASE=quizzdb
MYSQL_USER=quizzuser
MYSQL_PASSWORD=sicheres_passwort
```

### 3. Alle Container starten
```bash
docker compose up --build
```

### 4. Anwendung aufrufen

| Dienst | URL |
|---|---|
| 🌐 **Frontend** | http://localhost:8083 |
| ⚙️ **Backend API** | http://localhost:8080/api |
| 🗄️ **Adminer** (DB) | http://localhost:8082 |

> Beim ersten Start importiert das Backend automatisch alle Fragen aus den CSV-Dateien, sobald die Datenbank leer ist.

### Container stoppen
```bash
docker compose down

# Mit Datenverlust (Datenbank zurücksetzen):
docker compose down -v
```

---

## Umgebungsvariablen

Kopiere `.env.example` nach `.env` und passe die Werte an. Die Datei `.env` wird **nicht** ins Git eingecheckt.

```env
# MySQL
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password

# Backend (Spring Boot)
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/your_database?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SERVER_PORT=8080

# Ports
ADMINER_PORT=8082
BACKEND_PORT=8080
FRONTEND_PORT=8083

# Docker Network
NETWORK_NAME=quizznet
```

---

## Services

### Frontend (`quizz-frontend`)
- **Angular 17** Standalone Components
- Seiten: Landing, Spieler, Kategorien, Konfiguration, Quiz, Ergebnis
- Mehrsprachig: DE / EN / FR
- nginx leitet `/api/`-Anfragen als Reverse Proxy an das Backend weiter
- Build: `node:20-alpine` → `nginx:alpine`

### Backend (`quizz-backend`)
- **Spring Boot 3.2.4** mit Gradle
- REST-API unter `/api/`
- Automatischer CSV-Import beim Start (600 Fragen in 3 Sprachen)
- Intelligente Fragenverteilung via `SmartGameService`
- Build: `gradle:8.7-jdk17-alpine` → `eclipse-temurin:17-jre-alpine`

### Datenbank (`mysql`)
- **MySQL 8.0** mit persistentem Volume `mysql_data`
- Healthcheck verhindert, dass Backend startet bevor DB bereit ist

### Adminer
- Grafische Datenbankverwaltung
- Erreichbar unter http://localhost:8082
- Verbindung: Host `mysql`, User/Passwort aus `.env`

---

## Startreihenfolge (automatisch)

```
mysql (healthy)
    └──▶ adminer
    └──▶ backend (healthy)
              └──▶ frontend
```

---

## Lokale Entwicklung

### Backend lokal starten
```bash
cd quizz-backend
./gradlew bootRun
```
→ API unter `http://localhost:8080/api`

### Frontend lokal starten
```bash
cd quizz-frontend
npm install
ng serve
```
→ App unter `http://localhost:4200`

> Für lokale Entwicklung muss eine MySQL-Instanz laufen und `application.properties` entsprechend konfiguriert sein.

---

## Dokumentation

| Komponente | README |
|---|---|
| Backend | [`quizz-backend/README.md`](quizz-backend/README.md) |
| Frontend | [`quizz-frontend/README.md`](quizz-frontend/README.md) |