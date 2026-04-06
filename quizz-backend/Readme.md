# Quizz App – Backend (Spring Boot)

Ein REST-API-Backend für eine mehrsprachige Quiz-Anwendung. Entwickelt mit **Spring Boot**, **JPA/Hibernate** und einer relationalen Datenbank. Das Backend verwaltet Spieler, Kategorien, Fragen und Spielsitzungen und bietet eine intelligente Fragenverteilung über den `SmartGameService`.

---

## Inhaltsverzeichnis

- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [Datenmodell](#datenmodell)
- [API-Endpunkte](#api-endpunkte)
- [Services](#services)
- [CSV-Import](#csv-import)
- [Konfiguration](#konfiguration)
- [Verwendung](#verwendung)

---

## Technologien

- **Java 17**
- **Spring Boot 3.2.4**
- **Spring Data JPA / Hibernate**
- **MySQL** (via `mysql-connector-j`)
- **Gradle 8.7** (Build-Tool)
- **Docker** (Multi-Stage Build)
- **Lombok** (optional)
- Frontend-CORS freigegeben für `http://localhost:4200` (Angular)

---

## Projektstruktur

```
src/main/java/com/guita/Quizz/
├── QuizzApplication.java          # Einstiegspunkt der Anwendung
│
├── config/
│   ├── SeedConfig.java            # Automatischer CSV-Import beim Start
│   └── WebConfig.java             # CORS-Konfiguration für Angular
│
├── controller/
│   ├── AdminController.java       # CSV-Import manuell auslösen
│   ├── CategoryController.java    # Kategorien abrufen & Verfügbarkeit prüfen
│   ├── GameController.java        # Spiel starten & Antworten einreichen
│   ├── PlayerController.java      # Spieler verwalten
│   └── SmartGameController.java   # Intelligentes Spiel starten
│
├── dto/
│   ├── AnswerSubmissionDto.java
│   ├── CategoryDto.java
│   ├── CategoryQuestionCountDto.java
│   ├── CreatePlayerRequest.java
│   ├── GameQuestionDto.java
│   ├── GameResultDto.java
│   ├── QuestionAvailabilityResponse.java
│   ├── QuestionResultDto.java
│   ├── SmartGameConfigResponse.java
│   ├── StartGameRequest.java
│   ├── StartGameResponse.java
│   └── SubmitAnswersRequest.java
│
├── entity/
│   ├── Answer.java                # @Embeddable – Antworttext
│   ├── Category.java              # Kategorie mit Sprache
│   ├── Game.java                  # Spielsitzung
│   ├── GameQuestion.java          # Frage innerhalb einer Sitzung + gewählte Antwort
│   ├── Language.java              # Enum: DE, EN, FR
│   ├── Player.java                # Spieler
│   └── Question.java              # Frage mit 4 Antworten + korrektem Index
│
├── repository/
│   ├── CategoryRepository.java
│   ├── GameQuestionRepository.java
│   ├── GameRepository.java
│   ├── PlayerRepository.java
│   └── QuestionRepository.java
│
└── service/
    ├── CategoryService.java
    ├── GameService.java           # Klassisches Spiel
    ├── ImportService.java         # CSV-Import-Logik
    ├── PlayerService.java
    ├── QuestionService.java
    └── SmartGameService.java      # Intelligente Fragenverteilung

src/main/resources/
├── application.properties
└── data/
    ├── Wissenstest_sample200.csv      # Fragen auf Deutsch
    ├── Wissenstest_sample200_EN.csv   # Fragen auf Englisch
    └── Wissenstest_sample200_FR.csv   # Fragen auf Französisch
```

---

## Datenmodell

```
Player ──< Game >── GameQuestion >── Question >── Answer (embedded)
                                                       │
                                                  Category (+ Language)
```

| Entity | Beschreibung |
|---|---|
| `Player` | Spieler mit eindeutigem Name |
| `Category` | Themenkategorie, sprachgebunden (`DE`/`EN`/`FR`) |
| `Question` | Frage mit 4 Antworten und korrektem Index (0-basiert) |
| `Answer` | Eingebetteter Antworttext (`@Embeddable`) |
| `Game` | Spielsitzung: Spieler, Sprache, Start/Ende, Punktzahl |
| `GameQuestion` | Verbindung Game ↔ Question + gewählte Antwort + Korrektheit |

---

## API-Endpunkte

Alle Endpunkte sind unter `/api/` erreichbar (Präfix je nach `application.properties`).

### Spieler `/players`
| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/players` | Alle Spieler abrufen |
| `GET` | `/players/{id}` | Spieler nach ID |
| `GET` | `/players/by-name?name=` | Spieler nach Name |
| `POST` | `/players` | Spieler anlegen / aktualisieren |
| `DELETE` | `/players/{id}` | Spieler löschen |
| `DELETE` | `/players` | Alle Spieler löschen |

### Kategorien `/categories`
| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/categories` | Alle Kategorien |
| `GET` | `/categories/by-language?lang=DE` | Nach Sprache filtern |
| `GET` | `/categories/by-language-dto?lang=DE` | Als DTO-Liste |
| `POST` | `/categories/check-availability?lang=DE&requestedPerCategory=5` | Frageverfügbarkeit prüfen |

### Spiel `/game`
| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/game/start` | Neues Spiel starten |
| `POST` | `/game/{gameId}/submit` | Antworten einreichen & Ergebnis erhalten |

### Intelligentes Spiel `/smart-game`
| Methode | Pfad | Beschreibung |
|---|---|---|
| `POST` | `/smart-game/start` | Spiel mit adaptiver Fragenverteilung starten |

### Admin `/admin`
| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/admin/ping` | Verbindungstest |
| `POST` | `/admin/import-csv?lang=DE` | CSV für eine Sprache importieren |
| `POST` | `/admin/import-all` | CSV für alle Sprachen importieren |

---

## Services

### `GameService`
Startet ein klassisches Spiel: lädt Kategorien, wählt Fragen zufällig aus, erstellt eine `Game`-Instanz und gibt alle Fragen zurück. Bei `submitAnswers` werden Antworten ausgewertet und ein `GameResultDto` zurückgegeben.

### `SmartGameService`
Intelligente Variante: analysiert die Frageverfügbarkeit pro Kategorie. Falls nicht genug Fragen vorhanden sind, verteilt der Service die verfügbaren Fragen **fair und adaptiv** auf alle Kategorien. Die Antwort enthält mehrsprachige Statusmeldungen (`messageDe`, `messageEn`, `messageFr`).

### `ImportService`
Liest CSV-Dateien aus `src/main/resources/data/` und persistiert Fragen mit ihren Kategorien. Unterstützt DE, EN, FR. Wird beim Start automatisch ausgeführt, wenn die Datenbank leer ist (`SeedConfig`).

---

## CSV-Import

### Format (Semikolon-getrennt)

```
index;Frage;Antwort1;Antwort2;Antwort3;Antwort4;KorrekteAntwort(1-4);Kategorie
```

**Beispiel:**
```
1;Was ist die Hauptstadt von Frankreich?;London;Paris;Berlin;Madrid;2;Geographie
```

### Automatischer Import beim Start
`SeedConfig` prüft beim Hochfahren, ob die Datenbank leer ist, und importiert dann automatisch alle drei CSV-Dateien.

### Manueller Import über API
```
POST /admin/import-csv?lang=DE
POST /admin/import-all
```

---

## Build & Konfiguration

### `build.gradle`
```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.4'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.guita'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.mysql:mysql-connector-j'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
```

### `application.properties` (Beispiel MySQL)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quizzdb
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.servlet.context-path=/api
```

### CORS
Das Backend erlaubt Anfragen von `http://localhost:4200` (Angular-Frontend) für alle `/api/**`-Endpunkte.

---

## Docker

Das Projekt verwendet einen **Multi-Stage Docker Build**:

```dockerfile
# BUILD STAGE
FROM gradle:8.7-jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN gradle bootJar -x test --no-daemon

# RUN STAGE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

### Image bauen & starten
```bash
# Image bauen
docker build -t quizz-backend .

# Container starten
docker run -p 8080:8080 quizz-backend
```

### Mit docker-compose (empfohlen, mit MySQL)
```yaml
services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/quizzdb
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: yourpassword
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
      MYSQL_DATABASE: quizzdb
    ports:
      - "3306:3306"
```

---

## Verwendung (lokal ohne Docker)

1. Projekt in **IntelliJ IDEA** öffnen.
2. `application.properties` mit MySQL-Verbindungsdaten befüllen.
3. Anwendung starten:
```bash
./gradlew bootRun
```
4. Beim ersten Start werden die CSV-Dateien automatisch importiert.
5. API erreichbar unter: `http://localhost:8080/api/`

> Zum Testen der API empfiehlt sich **Postman** oder **Swagger UI** (falls konfiguriert).