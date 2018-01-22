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

This app needs to be deployed along:
  - https://github.com/squarescale/sqsc-demo-worker
  - `rabbitmq` docker image

Mandatory common environment variables to add:
  - `PROCESSING_QUEUE_NAME`: any name
  - `READING_QUEUE_NAME`: any name
  - `NODE_ENV`: `production`
  - `PROJECT_DB_USERNAME`: already provided by Squarescale
  - `PROJECT_DB_PASSWORD`: already provided by Squarescale   
  - `PROJECT_DB_NAME`: already provided by Squarescale
  - `RABBITMQ_HOST`: url of rabbitmq service in the cluster, usually `rabbitmq.service.consul`
