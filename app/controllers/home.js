const express = require('express');
const router = express.Router();

const processingQueueName = process.env.PROCESSING_QUEUE_NAME || "processingQueue";

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

router.post('/launch', function(req, res) {
  let params = req.body;
  console.log(params)
  let app = req.app;
  let taskMessage;
  for (var i = 0; i < imageWidth / params.stepX; i++) {
    taskMessage = getTaskMessage(params, i);
    app.get('rabbitMQChannel').sendToQueue(processingQueueName, taskMessage);
    console.log(`app - [x] Sent new task ${taskMessage}`);
    app.get('socketIO').emit('compute_task_created');
  }
  res.sendStatus(200);
});

function getTaskMessage(params, partIndex) {

  return Buffer.from(JSON.stringify({
    x: parseFloat(params.x),
    y: parseFloat(params.y),
    scaleX: parseFloat(params.scaleX),
    scaleY: parseFloat(params.scaleY),
    width: parseInt(params.width),
    height: parseInt(params.height),
    step: partIndex * parseInt(params.stepX),
    stepX : parseInt(params.stepX) || 10,
    stepY : parseInt(params.stepY) || imageHeight,
    iter: parseInt(params.maxIteration) || 10
  }));
}
