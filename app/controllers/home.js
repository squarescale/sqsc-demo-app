const express = require('express');
const router = express.Router();

const processingQueueName = process.env.PROCESSING_QUEUE_NAME || "processingQueue";

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
  let app = req.app;
  let taskMessage;
  for (let currentY = 0; currentY < parseInt(params.height); currentY += parseInt(params.stepY)) {
    for (let currentX = 0; currentX < parseInt(params.width); currentX += parseInt(params.stepX)) {
      taskMessage = getTaskMessage(params, currentX, currentY);
      app.get('rabbitMQChannel').sendToQueue(processingQueueName, taskMessage);
      console.log(`app - [x] Sent new task ${taskMessage}`);
      app.get('socketIO').emit('compute_task_created');
    }
  }
  res.sendStatus(200);
});

function getTaskMessage(params, currentX, currentY) {

  return Buffer.from(JSON.stringify({
    x: parseFloat(params.x),
    y: parseFloat(params.y),
    scaleX: parseFloat(params.scaleX),
    scaleY: parseFloat(params.scaleY),
    width: parseInt(params.width),
    height: parseInt(params.height),
    startX: currentX,
    startY: currentY,
    stepX : parseInt(params.stepX) || 10,
    stepY : parseInt(params.stepY) || 10,
    iter: parseInt(params.maxIteration) || 10
  }));
}
