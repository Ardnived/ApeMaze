var dispatch = require("../server/dispatch");
var debug = require("../shared/debug");

/**
 * When a new user connects, handle it.
 */
var clients = {};
var autoinc = 0;

dispatch.io.on('connection', function(socket) {
	clients[socket] = {
		name: "",
		player_id: autoinc
	};
	autoinc++;
	
	debug.dispatch("Received Game Connection. Player ID:", clients[socket].player_id);
	
	// ------------------
	var room = "room00";
	socket.join(room);

	socket.emit('meta', { player_id: clients[socket].player_id });
	socket.on('meta', function(data) {
		clients[socket].name = data.name;
	});
	
	socket.on('move', function(data) {
		socket.broadcast.to(room).emit('move', data);
	});
	
	socket.on('stop', function(data) {
		socket.broadcast.to(room).emit('stop', data);
	});

	socket.on('enter', function(data) {
		socket.leave(room);
		room = data.room;
		socket.join(room);
	})

	socket.on('chat', function(data) {
		socket.broadcast.to(room).emit('chat', data);
	})
	
	socket.on('disconnect', function () {
	    // Do Nothing?
	});
});
