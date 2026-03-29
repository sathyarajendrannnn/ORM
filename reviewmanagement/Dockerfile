# Stage 1: Build the application
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application, skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the generated jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render assigns a random PORT, or defaults to 10000. 
# We explicitly set the port so Spring Boot knows where to bind.
ENV PORT=10000
EXPOSE 10000

# Run the Spring Boot application and override server.port
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
