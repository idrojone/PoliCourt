FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /workspace

# Copy everything and build the project
COPY . .
RUN mvn -DskipTests clean package

# --- Final image ---
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy the shaded jar (or the built artifact) from the build stage
COPY --from=build /workspace/target/*.jar app.jar

# Copy helper scripts
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
COPY springboot.sh /app/springboot.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh /app/springboot.sh

EXPOSE 4002

# Start app with bash so wait-for-it (bash) runs with compatible shell
CMD ["bash", "/app/springboot.sh"]