var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  amqp = require('amqplib/callback_api');

module.exports = function(app) {
  app.use('/', router);
};

var channel = null;
var intervalId;

amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, function(err, conn) {
  conn.createChannel(function(err, ch) {
    channel = ch;
  });
});

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'SquareScale demo'
  });
});

router.get('/launch', function(req, res) {
  console.time("sendMessages");
  for (var i = 0; i < 1000; i++) {
    publishNewMessage();
  }
  console.timeEnd("sendMessages")

  res.send(200);
});

function publishNewMessage() {
  var q = "ProcessingQueue";
  channel.assertQueue(q, {
    durable: false
  });
  // Note: on Node 6 Buffer.from(msg) should be used
  channel.sendToQueue(q, new Buffer(Math.random()));
  console.log(" [x] Sent " + Math.random() + "]");
}
