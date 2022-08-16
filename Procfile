web: java $JAVA_OPTS -Xmx256m -jar target/*.jar --spring.profiles.active=prod,heroku,no-liquibase --management.security.enabled=false
release: cp -R src/main/resources/config config && ./mvnw -ntp liquibase:update -Pprod,heroku
