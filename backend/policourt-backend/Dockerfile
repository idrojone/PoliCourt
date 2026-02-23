# Dockerfile multi-stage para la API Spring Boot de PoliCourt

# etapa de build usando JDK 21 e instalando Maven manualmente
FROM eclipse-temurin:21-jdk-jammy as builder
WORKDIR /build

# instalar maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# copiar pom y src para poder cachear dependencias
COPY pom.xml ./
COPY src ./src

# construir jar fat
RUN mvn clean package -DskipTests -q

# etapa de runtime
FROM eclipse-temurin:21-jdk-jammy as runtime
WORKDIR /app

# instalar maven también en runtime para poder ejecutar migraciones
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# copiar jar generado
COPY --from=builder /build/target/*.jar app.jar

# copiar archivos de proyecto necesarios para ejecutar mvn flyway:migrate
COPY pom.xml ./
# incluir solo resources que usa flyway (aplicación y migraciones)
COPY src/main/resources ./src/main/resources

# copiar ejecutables y scripts necesarios
COPY wait-for-it.sh ./
COPY wait_and_migrate.sh ./

# permisos
RUN chmod +x wait-for-it.sh wait_and_migrate.sh

EXPOSE 4001

# entrypoint espera DB, migra y arranca el jar
ENTRYPOINT ["./wait_and_migrate.sh"]
