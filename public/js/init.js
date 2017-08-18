$(document).ready(function() {
  // var $loader = $('#loader').show();
  let mandelData = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    width: 900,
    height: 600,
    iter: 100000
  };

  // TO TEST
  // function loadImg() {
  //   $('mandelImg').hide();
  //   // $loader.show();
  //   $.get('/image', mandelData)
  //     .done(function(data) {
  //       $('#img_results').prepend('<img id="theImg" src="'+data+'" />')
  //       // $loader.hide(500);
  //     })
  //     .fail(function() {
  //       // $loader.hide(500);
  //     });
  // }
  //
  // loadImg();
  // END !! TO TEST

  // $('body').on('click', '#img_result', function(e) {
  //
  //   var offX = ((e.offsetX / mandelData.width) - 0.5) * 2.0,
  //     offY = ((e.offsetY / mandelData.height) - 0.5) * 2.0,
  //     newX = (offX * mandelData.scaleX) + mandelData.x,
  //     newY = (offY * mandelData.scaleY) + mandelData.y;
  //   $.extend(mandelData, {
  //     x: newX,
  //     y: newY,
  //     scaleX: mandelData.scaleX * 0.5,
  //     scaleY: mandelData.scaleY * 0.5
  //   });

    // TODO
    // loadImg();
  // });

  let ctx = document.getElementById('result').getContext('2d');
  let start, end;
  let stats = {
    computeTaskCreated: 0,
    computeTaskRemaining: 0,
    computeTime: 0,
    containers: {},
    computeSpeed: 0
  };

  $('button').bind("click", function() {
    start = new Date().getTime();
    $('#stats').removeClass('hidden');
    $('#containersStats tbody').empty();

    $('button').attr('disabled', 'disabled');

    $.ajax({
      url: '/launch',
      statusCode: {
        200: function(res) {
          $("#sending_results").append("<li> Sending 10 new messages </li>");
        }
      }
    });
  });
  
  const socket = io();

  socket.on('compute_task_created', () => {
    stats.computeTaskCreated++;
    $('#computeTaskCount').text(stats.computeTaskCreated);
    stats.computeTaskRemaining++;
    $('#computeTaskRemaining').text(stats.computeTaskRemaining);
  });

  socket.on('newResponse', function(data) {
    let image = new Image();
    image.src = data.result;

    image.onload = () => ctx.drawImage(image, 0, 0, data.stepX, data.stepY, data.step, 0, data.stepX, data.stepY);
  
    if (!stats.containers[data.container]) {
      stats.containers[data.container] = 0;
    }
    stats.containers[data.container]++;
    updateContainersStats();

    stats.computeTaskRemaining--;
    $('#computeTaskRemaining').text(stats.computeTaskRemaining);

    if (stats.computeTaskRemaining === 0) {
      end = new Date().getTime();
      stats.computeTime = end - start;
      $('.time').text(`${stats.computeTime} ms`);
      $('button').removeAttr('disabled');

      stats.computeSpeed = 60 * 1000 * stats.computeTaskCreated / stats.computeTime;
      $('#computeSpeed').text(stats.computeSpeed.toFixed(0));
    }
  });

  function updateContainersStats() {
    $('#containersStats tbody').empty();
    Object.entries(stats.containers).forEach(([containerId, count]) => {
      $('#containersStats tbody').append(`<tr><td>${containerId}</td><td>${count}</td></tr>`)
    });
  }
});
