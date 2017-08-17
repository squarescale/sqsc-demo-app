FROM node:8.4

ENV NODE_ENV production

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN set -ex \
  && apt-get update \
  && apt-get install -y git python libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

# Install NPM app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Install BOWER dependencies
RUN echo '{ "allow_root": true }' > /root/.bowerrc
COPY .bowerrc .
COPY bower.json .
RUN npm install bower@latest -g
RUN bower install

EXPOSE 3000
CMD [ "npm", "start" ]
