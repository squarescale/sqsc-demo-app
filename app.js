const express = require('express');
const config = require('./config/config');
const db = require('./app/models');
const socket_io = require('socket.io');
const amqp = require('amqplib');
const os = require('os');
const underscore = require('underscore');
const superagent = require('superagent');

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

async function getAWSMetaData() {
    try {
      const res = await superagent.get('http://169.254.169.254/latest/dynamic/instance-identity/document');
      return JSON.parse(res.res.text);
    } catch (err) {
      if (err.status === 404) {
        console.log(err.response.request.url);
        console.log('Unable to get AWS metadata at ' + err.response.request.url);
      } else {
        console.log('getAWSMetaData ERROR');
        console.error(err);
      }
      return {}
    }
}

async function getAzureMetaData() {
    try {
      const res = await superagent.get('http://169.254.169.254/metadata/instance?api-version=2020-06-01').set('Metadata', 'true');
      return JSON.parse(res.res.text);
    } catch (err) {
      if (err.status === 404) {
        console.log(err.response.request.url);
        console.log('Unable to get Azure metadata at ' + err.response.request.url);
      } else {
        console.log('getAzureMetaData ERROR');
        console.error(err);
      }
      return {}
    }
}


// TODO: http://169.254.169.254/latest/meta-data/hostname
// => ip-10-0-39-24.eu-west-1.compute.internal

async function start() {
    // System informations
    hostname = os.hostname();
    ipaddress = underscore.chain(os.networkInterfaces()).values().flatten().find({family: 'IPv4', internal: false}).value().address;

    // Setup global informations for this app
    infos = {host: hostname, ip: ipaddress};

    // AWS Platform informations
    getAWSMetaData().then(
      function(res){
        if (Object.keys(res).length > 0) {
          infos.availabilityZone = res.availabilityZone;
          infos.instanceId = res.instanceId;
          infos.instanceType = res.instanceType;
          infos.privateIp = res.privateIp;
          infos.cloudProvider= 'aws';
        }
      }
    );

    // Azure Platform informations
    getAzureMetaData().then(
      function(res){
        if (Object.keys(res).length > 0) {
          infos.availabilityZone = res.compute.location;
          infos.instanceId = res.compute.name;
          infos.instanceType = res.compute.vmSize;
          infos.privateIp = res.network.interface[0].ipv4.ipAddress[0].privateIpAddress;
          infos.cloudProvider= 'azure';
        }
      }
    );

    app = await express();
    require('./config/express')(app, config);
    app.set('infos', infos);

    await initConnections();

    const socketIO = await socket_io();
    app.set('socketIO', socketIO);

    const server = app.listen(config.port);
    socketIO.listen(server);
}

start();
