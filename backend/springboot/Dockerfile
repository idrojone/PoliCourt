FROM maven:3.9.6-eclipse-temurin-17 

WORKDIR /app

COPY . . 

RUN mvn -DskipTests clean package

CMD java -jar target/*.jar