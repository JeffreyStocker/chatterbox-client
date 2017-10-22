// YOUR CODE HERE:
//note use encodeURIComponent or escape
//url. http://parse.sfm6.hackreactor.com/
$(document).ready(function () {
  app.init();
  
  $('#postMessage').on('click', function () {
    // console.log ('i run');
    app.send(app.makeMessage());
  });
  
  
  $('.button').on('click', function () {
    // console.log ('ME!');
  });
  
  // $('.username').on('click', function () {
  //   console.log ('click')
  //   // app.clearMessages();
  //   // app.usernames.forEach ((user) =>{
  //   //   app.renderMessage(message);
  //   // });
  //   var data = this.data('userName')
  //   console.log (data)
  //   // $('.username').find('[data-userName="' + )
  // });
  
  $('#get').on('click', function () {
    app.clearMessages();
    
    app.fetch();
  });
  
  $('#roomSelect').change(function () {
    app.clearMessages();
    var selectedRoom = $( '#roomSelect option:selected' ).val();
    var roomData = app.messages.roomname[selectedRoom] || [];
    console.log (roomData);
    for (var i = 0; i < roomData.length; i++) {
      app.renderMessage(roomData[i]);
    }

  });
  
  // WIP put current user next to 'post message'
  // $('username').innerhtml = '';

});



var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  currentUser: '',
  usernames: new Set(), 
  roomnames: new Set(),
  rawData: undefined, 
  messages: {
    username: {'bob': []},
    roomname: {testing: [] }
  }, 
  friends: new Set(),
  // testMessage: { /// this works!!
  //   username: 'bob RULES',
  //   text: 'bob is lost',
  //   roomname: 'IN SPACE'
  // },
  
};

app.init = function () {
  // app.send()
  app.fetch();
  app.getUserName();
};

// app.cycleThroughMessages = function (data, callback) {
//   //to be writting helper function that loops through each 
//   //object in the data then calls the callback on it
//   // data.results.forEach ()
//   callback (username, roomname, messageNode);
// };


////////////////////////
/// Helper functions
/////////////////////// 

app.clearWebPage = function () {
  app.clearMessages();
  app.clearRoomSelect();
};



app.test = function () {
  // app.send()
  document.write('%24');
};


app.sortMessages = function (rawData) {
  _.each(rawData.results, (message) => {
    var user = message.username || 'anonymous';
    var room = message.roomname || '';
    app.usernames.add (user);
    app.roomnames.add (room);
    if (!app.messages.username[user]) {
      app.messages.username[user] = [];
    }
    if (!app.messages.roomname[room]) {
      app.messages.roomname[room] = [];
    }
    app.messages.username[user].push (message);
    app.messages.roomname[room].push (message);
    
  });
};


app.getUserName = function () {
  var userName = window.location.search.split('=');
  userName = userName.pop();
  ////note: will need to modify when there is more information in the search bar
  return userName;
};


app.makeMessage = function () {
  console.log($('#userMessage'));
  var message = {
    username: this.getUserName(),
    text: $('#userMessage').val(),
    // text: $('#userMessage').value,
    roomname: $('roomSelect option:selected').val()
  };
  console.log(message);
  return message;
};

app.clickOnUserNameAndOnlyShowMessagesFromThatUser = function () {
  $('.username').on('click', function () {
    app.clearMessages();
    console.log ($(this).text());
    var userWanted = $(this).text();
    ////// below WIP
    data.results.forEach ((message) =>{
      // console.log (`${storedThis} ||| ${user}`)
      var user = message.username;
      if (userWanted === user) {
        console.log ('i');
        app.renderMessage(message);
      }
    });
  });
};


app.clickOnUserNameAddFriends = function () {
  $('.username').on('click', function () {
    // app.clearMessages();
    var user = $(this).text();
    app.friends.add(user);
    
    $node = $(this);
    nodeDataTag = $node.attr('data-username');
    $('div[data-username = ' + nodeDataTag + ']').toggleClass('friend');
    // $('.username').attr(nodeDataTag).toggleClass('friend');
    // $('.username').data(nodeDataTag).toggleClass('friend');
    // $()
    console.log (nodeDataTag);
    // console.log (data);
  });
};

app.boldFriends = function () {
  
};
  
app.updateRoomNames = function () {
  //app.roomnames;
  //still want to sort the list of rooms
  // console.log(app.roomnames);
  app.roomnames.forEach ((room) => {
    // if (room === '') { 
    //   return;
    // }
    // console.log(room);
    room = escape(room);
    var selectNode = $(`<option value = "${room}"> ${room} </option>`);
  //   // console.log(selectNode);
    $('#roomSelect').append(selectNode);
  });
  
};

////////////////////////
/// IO from Server
/////////////////////// 

app.send = function (value) {
  $.ajax({
    type: 'POST',
    url: app.server,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(value), 
    
    success: function (response) {
      console.log ('POST: ', response);
    },
    error: function (response) {
      console.log ('POST ERROR: ', response);
    } 
  });
};



app.fetch = function () {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    success: function(data) {
      console.log('POST: ', data);
      app.rawData = data;
      app.parseMessages(data);
      app.sortMessages(data);
      app.updateRoomNames();
      app.clickOnUserNameAddFriends();
    },
    error: function (data) {
      console.log ('POST ERROR: ', data);
    } 
  });    
};

////////////////////////
/// HTML Functions
/////////////////////// 

app.clearMessages = function () {
  $('#chats').html('');
};

app.clearRoomSelect = function () {
  
  $('#roomSelect').html('');
  
};


app.parseMessages = function (data) {
  data.results.forEach ((message) => {
    app.renderMessage(message);
  });
};


// app.renderMessage = function (message) {  
//   var user = escape(message.username || 'anonymous');
//   var text = encodeURIComponent(message.text || ''); 
//   var roomname = encodeURIComponent(message.roomname || 'default');
//   // var user = message.username || 'anonymous';
//   // var text = message.text || ''; 
//   // var roomname = message.roomname || 'default';
  
//   var chatMessage = $(`<div class = "chat">
//     <div class = "username"> ${user} </div>
//     <div class = "message" > ${text} </div>
//     <div>`);
//   // output.innerhtml = message.text;
//   $('#chats').append(chatMessage);
// };


app.renderMessage = function (message) {  
  var chatNode = $('<div class = "chat"><div>');
  var data = encodeURIComponent(message.username || 'anonymous');

  var textNode = $('<div class = "message"></div>');
  textNode.append(document.createTextNode(message.text || ''));
  
  var usernameNode = $(`<div data-userName = ${data} class = "username"></div>`);
  // var usernameNode = $('<div class = "username"></div>');
  usernameNode.append(document.createTextNode(message.username || 'anonymous'));
  
  // var roomnameNode = $('<div class = "roomname" ></div>');
  // roomnameNode.append(document.createTextNode(message.roomname || 'default'));
  
  chatNode.append(usernameNode);
  chatNode.append(textNode);
  // chatNode.append(username);

  $('#chats').append(chatNode);
};


app.renderRoom = function (room) {
  //depreciated
  var output = $('<span></span>');
  output.innerhtml = room;
  $('#roomSelect').prepend(output);
};


