# Getting started

Make sure you have `npm`, `gulp` and `bower` installed
Run: `gulp` to run the local server at `localhost:3000`, the gulp tasks include live reloading for views, css in public/css and restarting the server for changes to app.js or js in routes/

# Testing

Tests are written with mocha.

  - Install: npm install -g mocha
  - Run: mocha or npm test

# Documentation
  - Sequelize is a based ORM for Node.js : http://docs.sequelizejs.com/

# Deploy on SquareScale

This app nedds to be deployed along:
  - https://github.com/squarescale/sqsc-demo-worker
  - `rabbitmq` docker image

Mandatory common environment variables to add:
  - `PROCESSING_QUEUE_NAME`: any name
  - `READING_QUEUE_NAME`: any name
  - `NODE_ENV`: `production`
  - `COMMON_DB_USERNAME`: copy value of common `DB_USERNAME`
  - `COMMON_DB_PASSWORD`: copy value of common `DB_PASSWORD`
  - `COMMON_DB_NAME`: copy value of common `DB_NAME`
  - `RABBITMQ_HOST`: url of rabbitmq service in the cluster, usually `rabbitmq.service.consul`
