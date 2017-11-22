$(function(){

  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  var socket = io();

  var username;
  var $window = $(window);
  var $loginPage = $(".login.page");
  var $chatPage = $(".chat.page");
  var $inputMessage = $('.inputMessage');
  var $usernameInput = $('.usernameInput');
  var $currentInput = $usernameInput.focus();
  var $messages = $('.messages');

  function log(logMsg){
    var $ele = $('<span class="log"/>').text(logMsg)
    AddMessageElement($('<div/>').append($ele))
  }
  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      // Tell the server your username
      socket.emit('new user', username);
    }
  }

  function sendMessage(){
    message = cleanInput($inputMessage.val().trim());
    if(message){
      socket.emit('message',message);
    }
  }

  function AddNewMessage(username,msg,time){
    time = moment(time).local().format("(MM.DD)HH:mm:ss");

    var $timeDiv = $('<span class="chattime"/>')
      .text(time);
    var $usernameDiv = $('<span class="username"/>')
      .text(username+':').css('color', getUsernameColor(username));
    var $messageBodyDiv = $('<span class="msgbody">')
      .text(msg);

    var $messageDiv = $('<div class="messageEntry"/>')
      .append($timeDiv,$usernameDiv, $messageBodyDiv);

    AddMessageElement($messageDiv);
  }

  function AddMessageElement(ele){
    var $ele = $(ele);
    $messages.append($ele);
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html();
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        $inputMessage.val('');
      } else {
        setUsername();
      }
    }
  });

  socket.on('message',function(data){
  	// console.log("Received")
    AddNewMessage(data.username,data.msg,data.time);
  })

  socket.on('new user',function(data){
    var time = moment(data.time).local().format("HH:mm:ss");
    log(data.username+" joined the chatroom at "+time+'.')
    log(data.UserCount+' people in the room now.')
  });

  socket.on('user leave',function(data){
    var time = moment(data.time).local().format("HH:mm:ss");
    log(data.username+" leave the chatroom at "+time+'.')
    log(data.UserCount+' people in the room now.')
  });
});