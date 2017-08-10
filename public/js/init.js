$(document).ready(function() {
  $('button').bind("click", function() {
    var start = new Date();
    $.ajax({
      url: '/launch',
      statusCode: {
        200: function(res) {
          $("#sending_result").append(new Date()-start+" mlls to send all 1000 messages");
        }
      }
    });
  });

  var socket = io();
  socket.on('newResponse', function (data) {
    console.log(data);
    $("#getting_result").append("<li>"+data+"</li>");
  });
});
