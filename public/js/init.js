$(document).ready(function() {
  let mandelbrotData;
  let isComputing = false;
  
  function getInitialMandelbrotParameters() {
    return {
      x: 0,
      y: 0,
      scaleX: 1.5,
      scaleY: 1,
      width: 900,
      height: 600
    };
  }

  const initialMaxIteration = 1000;
  const initialStepX = 50;
  const initialStepY = 50;

  function resetParameters() {
    mandelbrotData = getInitialMandelbrotParameters();

    $('input#maxIteration').val(initialMaxIteration);
    $('input#stepX').val(initialStepX);
    $('input#stepY').val(initialStepY);
  }

  resetParameters();

  const ctx = document.getElementById('result').getContext('2d');
  let start, end;
  let stats;
  let sessionResults = [];

  const UUID = Math.floor(Date.now());

  function launchComputation() {
    $('button').attr('disabled', 'disabled');
    $('.error').addClass('hidden');

    stats = initStats();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 900, 600);

    let params = {};
    params.maxIteration = $('input#maxIteration').val();
    params.stepX = $('input#stepX').val();
    params.stepY = $('input#stepY').val();
    params.clientToken = UUID;

    $.extend(params, mandelbrotData);
    isComputing = true;
    $.ajax({
      method: 'POST',
      url: '/launch',
      data: params,
      error: (req, status, error) => {
        $('.error').removeClass('hidden');
        $('.error').text('Remote server not responding');
        $('button').removeAttr('disabled');
        isComputing = false;
      }
    });
  }

  $('button#launchBtn').bind("click", function() {
    if (!isComputing) {
      launchComputation();
    }
  });

  $('button#resetBtn').bind("click", function() {
    if (!isComputing) {
      resetParameters();

      launchComputation();
    }
  });

  $('body').on('click', 'canvas#result', function(e) {
    if (!isComputing) {
      let offX = ((e.offsetX / mandelbrotData.width) - 0.5) * 2.0,
        offY = ((e.offsetY / mandelbrotData.height) - 0.5) * 2.0,
        newX = (offX * mandelbrotData.scaleX) + mandelbrotData.x,
        newY = (offY * mandelbrotData.scaleY) + mandelbrotData.y;
      $.extend(mandelbrotData, {
        x: newX,
        y: newY,
        scaleX: mandelbrotData.scaleX * 0.5,
        scaleY: mandelbrotData.scaleY * 0.5
      });
  
      launchComputation();
    }
  });

  const socket = io();

  socket.on('compute_task_created', (data) => {
    if(data.clientToken != UUID){
      return;
    }
    if (stats.computeTaskCreated === 0) {
      stats.startTime = new Date().getTime();
      $('#stats').removeClass('hidden');
      $('#containersStats tbody').empty();
    }
    stats.computeTaskCreated++;
    $('#computeTaskCount').text(stats.computeTaskCreated);
    stats.computeTaskRemaining++;
    $('#computeTaskRemaining').text(stats.computeTaskRemaining);
  });

  socket.on('compute_task_result', function(data) {
    if(data.clientToken != UUID){
      return;
    }
    let image = new Image();
    image.src = data.result;

    image.onload = () => ctx.drawImage(image, 0, 0, data.stepX, data.stepY, data.startX, data.startY, data.stepX, data.stepY);
  
    if (!stats.containers[data.container]) {
      stats.containers[data.container] = 0;
    }
    stats.containers[data.container]++;
    updateContainersStats();

    stats.computeTaskRemaining--;
    $('#computeTaskRemaining').text(stats.computeTaskRemaining);

    stats.computeTime = new Date().getTime() - stats.startTime;
    $('.time').text(`${stats.computeTime} ms`);

    
    if (stats.computeTaskRemaining === 0) {
      $('button').removeAttr('disabled');
      
      stats.computeSpeed = 1000 * 900 * 600 / stats.computeTime;
      $('#computeSpeed').text(stats.computeSpeed.toLocaleString('fr', {maximumFractionDigits: 0}));

      stats.maxIteration = data.iter;

      addNewResult(stats);

      isComputing = false;
    }
  });

  function initStats() {
    return {
      startTime: null,
      maxIteration: null,
      computeTaskCreated: 0,
      computeTaskRemaining: 0,
      computeTime: 0,
      containers: {},
      computeSpeed: 0
    };
  }

  function updateContainersStats() {
    $('#containersStats tbody').empty();
    idx = 0;
    maxl = Object.entries(stats.containers).length;
    Object.entries(stats.containers).forEach(([containerId, count]) => {
      $('#containersStats tbody').append(`
        <tr>
          <td>${maxl - idx}</td>
          <td>${containerId}</td>
          <td>${count}</td>
        </tr>`);
      idx++;
    });
  }

  function addNewResult(stats) {
    sessionResults.push(stats);
    $('#sessionResults').removeClass('hidden');
    $('table#results tbody').prepend(`
        <tr>
          <td>${Object.entries(sessionResults).length}</td>
          <td>${new Date(stats.startTime).toLocaleTimeString()}</td>
          <td>${stats.maxIteration}</td>
          <td>${stats.computeTaskCreated}</td>
          <td>${Object.entries(stats.containers).length}</td>
          <td>${stats.computeTime}</td>
          <td>${stats.computeSpeed.toLocaleString('fr', {maximumFractionDigits: 0})}</td>
        </tr>`);
  }
});
