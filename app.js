const express = require('express');
const config = require('./config/config');
const db = require('./app/models');
const amqp = require('amqplib');
const socket_io = require('socket.io');

const processingQueueName = process.env.PROCESSING_QUEUE_NAME || 'processingQueue';
const readingQueueName = process.env.READING_QUEUE_NAME || 'readingQueue';
const rabbitMQUrl = process.env.RABBITMQ_HOST || 'rabbitmq.localhost';

async function start() {
  try {
    // Initialise DB
    await db.sequelize.sync({
      force: true
    });

    // Initialise RabbitMQ channel
    const connection = await amqp.connect(`amqp://` + rabbitMQUrl);

    // Add reading queue results process
    const channel = await connection.createChannel();
    await channel.assertQueue(readingQueueName, {
      durable: true
    });
    await channel.consume(readingQueueName, consumeQueue, {
      noAck: false
    });

    process.once('SIGINT', () => connection.close());

    // Initialise Socket-IO
    const socketIO = await socket_io();

    const app = express();

    // Loading app
    app.set("rabbitMQChannel", channel);
    app.listen(config.port, function() {
      socketIO.listen(this);
      require('./config/express')(app, config);
    });

    async function consumeQueue(msg) {
      var entityId = msg.content.toString();
      console.log(" [x] Received '%s'", entityId);
      db.Response.find({
          where: {
            id: parseInt(entityId)
          }
        })
        .then(function(response) {
          socketIO.emit("newResponse", response);
          console.log(" [->] Emit '%s'", response);
        });
    }
  } catch (e) {
    console.warn(e);
  }
}

start();
