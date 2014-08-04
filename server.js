var dispatch = require("./server/dispatch");
//var logic = require("./server/logic");
var debug = require("./shared/debug");

// Initialize the server.
dispatch.start(8081, 8082);

/**
 * When a new user connects, handle it.
 */
var game = dispatch.io.of('/game').on('connection', function(socket) {
	debug.dispatch("Received Game Connection.");
	
	game.emit('message', { hello: 'world' });
	var name = "";
	
	socket.on('meta', function(data) {
		name = data.name;
	});
	
	socket.on('message', function(data) {
		
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
	
	chat.emit('message', { hello: 'world' });
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