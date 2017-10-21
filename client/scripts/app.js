// YOUR CODE HERE:
//note use encodeURIComponent or escape
//url. http://parse.sfm6.hackreactor.com/
$(document).ready(function () {
  app.init();
  
  $('#postMessage').on('click', function () {
    console.log ('i run');
    // app.send(app.makeMessage());
  });
  
  
  $('.button').on('click', function () {
    // console.log ('ME!');
  });
  
  
  $('username').innerhtml = '';

});

var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};

app.init = function () {
  // app.send()
  app.fetch();
  app.getUserName();
};

app.getUserName = function () {
  var userName = window.location.search.split('=');
  userName = userName.pop();
  ////note: will need to modify when there is more information in the search bar
  return userName;
};

// app.test = function () {
//   // app.send()
//   document.write('%24');
// };

app.makeMessage = function () {
  var message = {
    username: this.getUserName(),
    text: $('#userMessage').value,
    roomname: $('roomSelect').value
  };
  console.log(message);
  return message;
};

app.send = function (value) {
  // var testMessage = {. /// this works!!
  //   username: 'bob RULES',
  //   text: 'bob is lost',
  //   roomname: 'IN SPACE'
  // };
  
  $.ajax({
    type: 'POST',
    url: app.server,
    data: value, 
    success: function (data) {
      console.log ('POST: ', data);
    },
    error: function (data) {
      console.log ('POST ERROR: ', data);
    } 
  });
  
};



app.fetch = function () {
  $.ajax({
    // url: 'http://parse.sfm6.hackreactor.com/',
    url: app.server,
    type: 'GET',
    success: function(data) {
      console.log('POST: ', data);
      app.parseMessages(data);
    },
    error: function (data) {
      console.log ('POST ERROR: ', data);
    } 
  });
};

app.fetch = function () {
  $.ajax({
    // url: 'http://parse.sfm6.hackreactor.com/',
    url: app.server,
    type: 'GET',
    success: function(data) {
      console.log('POST: ', data);
      app.parseMessages(data);
    },
    error: function (data) {
      console.log ('POST ERROR: ', data);
    } 
  });
};

app.clearMessages = function () {
  $('#chats').html('');
};

app.parseMessages = function (data) {
  data.results.forEach ((message) => {
    app.renderMessage(message);
  });
};

app.renderMessage = function (message) {
  
  
  // var user = escape(message.username || 'anonymous');
  // var text = encodeURIComponent(message.text || ''); 
  // var roomname = encodeURIComponent(message.roomname || 'default');
  
  
  var user = message.username || 'anonymous';
  var text = message.text || ''; 
  var roomname = message.roomname || 'default';
  
  
  var chatMessage = $(`<div class = "chat">
    <div class = "username"> ${user} </div>
    <div class = "message" > ${text} </div>
    <div>`);
  
  // output.innerhtml = message.text;
  $('#chats').prepend(chatMessage);
};


app.renderRoom = function (room) {
  var output = $('<span></span>');
  output.innerhtml = room;
  $('#roomSelect').prepend(output);
};
