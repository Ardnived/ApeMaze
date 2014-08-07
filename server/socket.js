var dispatch = require("../server/dispatch");
var avatar = require("../server/avatar");
var debug = require("../shared/debug");

/**
 * When a new user connects, handle it.
 */
var clients = {};
var autoinc = 0;
var first = true;
var chat_messages = [];

dispatch.io.on('connection', function(socket) {
	var client = {
		name: "",
		player_id: autoinc,
		is_controller: first,
		room: "room00",
		ready: true,
	};
	first = false;
	autoinc++;
	
	clients[socket] = client;

	debug.dispatch("Received Game Connection. Player ID:", clients[socket].player_id);
	
	// ------------------
	socket.join(client.room);

	socket.emit('meta', { 
		player_id: client.player_id,
		is_controller: client.is_controller
	});

	socket.on('meta', function(data) {
		client.name = data.name;
	});
	
	socket.on('move', function(data) {
		avatar.x = data.x;
		avatar.y = data.y;
		avatar.direction = data.direction;
		socket.broadcast.to(client.room).emit('move', data);
	});

	socket.on('stop', function(data){
		socket.broadcast.to(client.room).emit('stop', data)
	});
	
	socket.on('trap', function(data) {
		dispatch.io.to(client.room).emit('trap', data);
	});

	socket.on('gameover', function(data) {
		dispatch.io.to(client.room).emit('gameover', data);
		for(var i=0; i<clients.length; i++){
			clients[i].ready = false
		}
	})

	socket.on('enter', function(data) {
		socket.leave(room);
		client.room = data.room;
		socket.join(room);
	})

	socket.on('chat', function(data) {
		data.sender_id = client.player_id;
		data.send_date = (new Date()).toString();
		chat_messages.push(data);
		while(chat_messages.length>20)
			chat_messages.shift();
		socket.broadcast.to(client.room).emit('chat', data);
	})
	// Send the most recent messages to the player on login
	socket.emit('chats', chat_messages);
	
	socket.on('disconnect', function () {
		delete clients[socket]

		var allReady = true;
		for(var key in clients){
			if(!clients[key].ready)
				allReady = false;
		}
	});

	socket.on('ready', function(){
		client.ready = true;

		var allReady = true;
		for(var key in clients){
			if(!clients[key].ready)
				allReady = false;
		}

		if(allReady){
			dispatch.io.to(client.room).emit('reset')
		}
	})
});
