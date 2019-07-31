FROM node:8.4-stretch

RUN apt-get update && apt-get install -y dnsutils bind9-host ca-certificates curl wget --no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

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
