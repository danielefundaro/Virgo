FROM maven:3.9.1-eclipse-temurin-20 AS MAVEN_BUILD

WORKDIR /app

COPY . .

RUN mvn clean install -U -DskipTests

FROM tomcat:10.1.8-jdk17-temurin-jammy

RUN rm -r /usr/local/tomcat/webapps.dist
COPY --from=MAVEN_BUILD /app/target/virgo.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080 8443

ENTRYPOINT ["catalina.sh", "run"]
