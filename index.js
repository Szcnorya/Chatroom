var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var path = require('path');

// Routing
app.use(express.static(path.join(__dirname, 'public')));

var UserCount = 0

//New connection comes
io.on('connection', function(socket){
	isNew = true;
	socket.on('message',function(msgbody){
		io.emit('message',{
			username : socket.username,
			msg : msgbody,
			time : new Date().getTime()
		});
	});

	socket.on('new user',function(username){
		if(isNew){
			isNew = false
			socket.username = username;
			UserCount += 1;
			io.emit("new user",{
				username : socket.username,
				time : new Date().getTime(),
				UserCount : UserCount
			});
		}
		else{
			return;
		}
	});

	socket.on('user leave',function(){
		if(isNew){
			return;
		}
		else{
			UserCount -= 1;
			io.emit('user leave',{
				username : socket.username,
				time : new Date().getTime(),
				UserCount : UserCount
			});
		}
	});
	}
);


http.listen(8889, function(){
  console.log('listening on *:8889');
});

