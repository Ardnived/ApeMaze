var dispatch = require("./server/dispatch");
//var logic = require("./server/logic");
var debug = require("./shared/debug");

// Initialize the server.
dispatch.start(8081, 8082);
//Alvin
/**
 * When a new user connects, handle it.
 */
var clients = {};
var autoinc = 0;

var game = dispatch.io.of('/game').on('connection', function(socket) {
	clients[socket] = {
		name: "",
		player_id: autoinc
	};
	autoinc++;
	
	debug.dispatch("Received Game Connection. Player ID:", clients[socket].player_id);
	
	socket.emit('meta', { player_id: clients[socket].player_id });
	socket.on('meta', function(data) {
		clients[socket].name = data.name;
	});
	
	socket.on('move', function(data) {
		game.emit('move', data);
	});
	
	socket.on('stop', function(data) {
		game.emit('stop', data);
	});
	
	socket.on('disconnect', function () {
	    // Do Nothing?
	});
});

/**
 * When a new user connects, handle it.
 */
var chat = dispatch.io.of('/chat').on('connection', function(socket) {
	debug.dispatch("Received Chat Connection.");
	var name = "";
	
	socket.on('meta', function(data) {
		name = data.name;
	});
	
	socket.on('message', function(data) {
		chat.emit('message', {
			from: name,
			message: data
		});
	});
	
	socket.on('disconnect', function () {
		chat.emit('message', {
			from: "server",
			message: "A user disconnected."
		});
	    
	    debug.chat("A user disconnected.");
	});
});
