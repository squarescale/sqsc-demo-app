$(document).ready(function() {
  $('button').bind("click", function() {
    var start = new Date();
    $.ajax({
      url: '/launch',
      statusCode: {
        200: function(res) {
          $("#sending_result").append("<li> Sending 10 new messages </li>");
        }
      }
    });
  });

  var socket = io();
  socket.on('newResponse', function(data) {
    console.log(data);
    $("#getting_result").append("<li> Container :"+data.container+" - Result : "+ data.result+" </li>");
  });
});
