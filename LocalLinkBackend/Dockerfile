#FROM ubuntu:latest
FROM eclipse-temurin:21-jdk-focal AS build
LABEL authors="monicapopuri"

# --- STAGE 1: BUILD STAGE ---
# Use a full JDK image to build the application and compile Java code.

# Set the working directory inside the container
WORKDIR /app

# Copy the build configuration files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy the source code
COPY src src

# Execute the Maven package command (this downloads dependencies and builds the JAR)
RUN ./mvnw clean package -DskipTests

# --- STAGE 2: RUNTIME STAGE ---
# Use a minimalist JRE (Java Runtime Environment) image for the final, lightweight container.
FROM eclipse-temurin:21-jre-alpine

# Set the working directory
WORKDIR /app

# Expose the port your Spring Boot app runs on (default is 8080)
EXPOSE 8081

# Copy the executable JAR from the 'build' stage into this final image
# We assume the name of the built JAR is 'target/locallink-backend-0.0.1-SNAPSHOT.jar'
# You may need to replace the filename below with your actual JAR file name.
COPY --from=build /app/target/*.jar app.jar

# Define the command to run when the container starts
ENTRYPOINT ["java", "-jar", "target/locallink-backend-0.0.1-SNAPSHOT.jar"]