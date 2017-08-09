$(document).ready(function() {
  $('button').bind("click", function() {
    $.ajax({
      url: '/launch',
      success: function(res) {
        console.log('server response is', res);
      }
    });
  });
});
