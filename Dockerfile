FROM maven:3.5-alpine

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JHIPSTER_SLEEP=0 \
    JAVA_OPTS="" \
    PATH=/root/.yarn/bin:$PATH

# Install Yarn
RUN set -ex \
  && apk update \
  && apk add yarn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Building app source
RUN  ./mvnw package -Pprod \
  && cp target/*.war /app.war

EXPOSE 8080 5701/udp
CMD echo "The application will start in ${JHIPSTER_SLEEP}s..." \
    && sleep ${JHIPSTER_SLEEP} \
    && java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /app.war
