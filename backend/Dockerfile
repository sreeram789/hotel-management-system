# Multi-stage build for Spring Boot backend
FROM maven:3.9-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8081

# Set environment variables (will be overridden by docker-compose)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/hotel_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=sreeram000

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]


#cd "c:\Users\asus\Desktop\fullstack full"
#docker-compose build
#docker-compose up -d