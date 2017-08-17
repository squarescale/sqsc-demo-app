const async = require('async');

const express = require('express');
const config = require('./config/config');
const db = require('./app/models');
const socket_io = require('socket.io');
const amqp = require('amqplib');

const Response = db.Response;

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
    process.once('SIGINT', () => connection.close());

    // Add reading queue results process
    const channel = await connection.createChannel();
    await channel.assertQueue(readingQueueName, {
      durable: true
    });
    await channel.consume(readingQueueName, consumeQueue, {
      noAck: true
    });

    // Initialise Socket-IO
    const socketIO = await socket_io();

    // Loading app
    const app = await express();
    await app.set("rabbitMQChannel", channel);
    app.listen(config.port, function() {
      socketIO.listen(this);
      require('./config/express')(app, config);
    });

    async function consumeQueue(msg) {
      var entityId = msg.content.toString();
      console.log(" [x] Received '%s'", entityId);
      const response = await db.Response.findById(parseInt(entityId));
      console.log(" [->] Emit '%s'", response.id);
      socketIO.emit("newResponse", response);
    }
  } catch (e) {
    console.warn(e);
  }
}

// try to initialise db connection
async.retry({
    times: 10,
    interval: function(retryCount) {
      return 50 * Math.pow(2, retryCount);
    },
    errorFilter: function(err) {
      console.warn(err.errno === 'ECONNREFUSED' ? "Retry to connect" : "All connections are established");
      return err.errno === 'ECONNREFUSED'; // only retry on a specific error
    }
  },
  start);
