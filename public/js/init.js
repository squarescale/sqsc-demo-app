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

  var socket = io();
  socket.on('newResponse', function(data) {
    console.log(data.container);
    $('#img_results').append('<img id="theImg" src="'+data.result+'" />')

    // var image = new Image;
    // image.onload = checkload;
    // image.src = data.base64;
    //
    // var canvas = $('canvas');
    // var context = canvas.getContext('2d');
    // context.drawImage(image, data.step, 0, 900, 600);
    //
    // var combined = new Image;
    // combined.src = canvas.toDataURL('data/gif');
    // $("#img_results").appendChild(combined);

    // console.log(data);
    // $("#getting_result").append("<li> Container :" + data.container + " - Result : " + data.result + " </li>");
  });
});
