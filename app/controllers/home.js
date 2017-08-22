const express = require('express');
const router = express.Router();

const processingQueueName = process.env.PROCESSING_QUEUE_NAME || "processingQueue";

const precision = 100;
const computeWidth = 10;
const imageWidth = 900;
const imageHeight= 600;


module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'SquareScale demo'
  });
});

router.get('/launch', function(req, res) {
  let app = req.app;
  let taskMessage;
  for (var i = 0; i < imageWidth / computeWidth; i++) {
    taskMessage = getTaskMessage(i * computeWidth);
    app.get('rabbitMQChannel').sendToQueue(processingQueueName, taskMessage);
    console.log(`app - [x] Sent new task ${taskMessage}`);
    app.get('socketIO').emit('compute_task_created');
  }
  res.sendStatus(200);
});

function getTaskMessage(col) {

  return Buffer.from(JSON.stringify({
    x: 0,
    y: 0,
    scaleX: 1.5,
    scaleY: 1,
    width: imageWidth,
    height: imageHeight,
    step: col,
    stepX : computeWidth,
    stepY : imageHeight,
    iter: precision
  }));
}
