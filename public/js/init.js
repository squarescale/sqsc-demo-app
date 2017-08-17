$(document).ready(function() {
  // var $loader = $('#loader').show();
  mandelData = {
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

  $('button').bind("click", function() {
    $.ajax({
      url: '/launch',
      statusCode: {
        200: function(res) {
          $("#sending_results").append("<li> Sending 10 new messages </li>");
        }
      }
    });
  });
  
  let ctx = document.getElementById('result').getContext('2d');

  var socket = io();
  socket.on('newResponse', function(data) {
    let image = new Image();
    image.src = data.result;

    image.onload = () => ctx.drawImage(image, 0, 0, data.stepX, data.stepY, data.step, 0, data.stepX, data.stepY);
  });
});
