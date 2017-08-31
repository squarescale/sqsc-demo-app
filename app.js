const express = require('express');
const config = require('./config/config');
const db = require('./app/models');
const socket_io = require('socket.io');
const amqp = require('amqplib');

const Response = db.Response;

const processingQueueName = process.env.PROCESSING_QUEUE_NAME || 'processingQueue';
const readingQueueName = process.env.READING_QUEUE_NAME || 'readingQueue';
const rabbitMQUrl = process.env.RABBITMQ_HOST || 'rabbitmq.localhost';

let channel, app;

async function handleQueueConnection() {
  const connection = await amqp.connect(`amqp://` + rabbitMQUrl);
  console.log('app - Connected to AMQP');
  process.once('SIGINT', () => {
    if (connection) {
      connection.close();
    }
  });

  connection.on('error', (error) => console.error(error));
  connection.on('close', () => {
    console.log('app - Connection to AMQP closed. Retrying...');
    setTimeout(initConnections, 1000);
  });

  return await connection.createChannel();
}

async function handleDatabaseConnection() {
  await db.sequelize.sync({alter: true});
}

async function initQueues(channel) {
  await channel.prefetch(1);

  await channel.assertQueue(processingQueueName, {
    durable: true
  });
  
  await channel.assertQueue(readingQueueName, {
    durable: true
  });
}

async function initConnections() {
  try {
    await handleDatabaseConnection();
    
    channel = await handleQueueConnection();
    await initQueues(channel);
    if (app) {
      app.set('rabbitMQChannel', channel);
      
      async function consumeQueue(msg) {
        const entityId = msg.content.toString();
        console.log(`app - [x] Received info that task ${entityId} is done`);
        const response = await db.Response.findById(parseInt(entityId));
        console.log(`app - [->] Send result of task ${response.id} to web client`);
        app.get('socketIO').emit("compute_task_result", response);
        channel.ack(msg);
      }
  
      channel.consume(readingQueueName, consumeQueue, { noAck: false });
    }
  } catch (err) {
    console.error("app - [ERROR] "+err.message);
    setTimeout(initConnections, 1000);
  }
}

async function start() {
    app = await express();
    require('./config/express')(app, config);

    await initConnections();

    const socketIO = await socket_io();
    app.set('socketIO', socketIO);

    const server = app.listen(config.port);
    socketIO.listen(server);
}

start();
