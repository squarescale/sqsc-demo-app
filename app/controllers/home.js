const express = require('express');
const router = express.Router();
const db = require('../models');
const amqp = require('amqplib');

const processingQueueName = process.env.PROCESSING_QUEUE_NAME || "processingQueue";

let channel;

module.exports = function(app) {
  app.use('/', router);
  channel = app.get("rabbitMQChannel");
};

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'SquareScale demo'
  });
});

router.get('/launch', function(req, res) {
  for (var i = 0; i < 1; i++) {
    publishNewMessage();
  }
  res.sendStatus(200);
});

function random(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

async function publishNewMessage() {
  await channel.assertQueue(processingQueueName, {
    durable: true
  });
  let msg = Buffer.from(random(0, 1000).toString());
  channel.sendToQueue(processingQueueName, msg);
  console.log(" [x] Sent %s", msg);
}
