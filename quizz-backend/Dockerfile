# ---------- BUILD STAGE ----------
FROM gradle:8.7-jdk17-alpine AS build
WORKDIR /app

COPY . .
RUN gradle bootJar -x test --no-daemon

# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
