# ---------- Build Stage ----------
FROM maven:3.9.11-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml & download dependencies
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Copy source & build jar
COPY src ./src
RUN mvn -q -DskipTests clean package

# ---------- Run Stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy jar from first stage
COPY --from=build /app/target/*.jar app.jar

# App port inside container
EXPOSE 8081

# Use prod profile
ENV SPRING_PROFILES_ACTIVE=prod

# Start backend
ENTRYPOINT ["java", "-jar", "app.jar"]
