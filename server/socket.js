var dispatch = require("../server/dispatch");
var debug = require("../shared/debug");

/**
 * When a new user connects, handle it.
 */
var clients = {};
var autoinc = 0;
var first = true;

dispatch.io.on('connection', function(socket) {
	var client = {
		name: "",
		player_id: autoinc,
		is_controller: first,
		room: "room00"
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
		socket.broadcast.to(client.room).emit('move', data);
	});
	
	socket.on('trap', function(data) {
		dispatch.io.emit('trap', data);
	});

	socket.on('enter', function(data) {
		socket.leave(room);
		client.room = data.room;
		socket.join(room);
	})

	socket.on('chat', function(data) {
		data.sender_id = client.player_id;
		socket.broadcast.to(client.room).emit('chat', data);
	})
	
	socket.on('disconnect', function () {
	    // Do nothing.
	});
});
