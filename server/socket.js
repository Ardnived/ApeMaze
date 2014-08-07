var dispatch = require("../server/dispatch");
var avatar = require("../server/avatar");
var game = require("../server/game");
var debug = require("../shared/debug");
var trap = require("../server/trap");

/**
 * When a new user connects, handle it.
 */
var clients = {};
var sockets = {};
var autoinc = 0;
var first = true;
var chat_messages = [];
var gameStarted = true;

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
	
	clients[socket.id] = client;
	sockets[socket.id] = socket;

	debug.dispatch("Received Game Connection. Player ID:", clients[socket.id].player_id);
	
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
		data.activate = false;

		if(data.trap_id in trap.traps) {
			trap.traps[data.trap_id].clicks += 1;
		} else {
			trap.traps[data.trap_id] = {
				clicks: 1,
				threshold: data.threshold
			};
		}

		// Activate the trap
		if(trap.traps[data.trap_id].clicks == trap.traps[data.trap_id].threshold) {
			data.activate = true;
		}

		dispatch.io.to(client.room).emit('trap', data);
	});

	socket.on('gameover', function(data) {
		game.gameover = true;
		game.controller_won = data.controller_won;
		dispatch.io.to(client.room).emit('gameover', data);
		for(var key in clients){
			clients[key].ready = false;
		}
		gameStarted = false;
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
	
	function checkReadyAndAssignPlayers(){
		if(gameStarted){
			return;
		}
		var allReady = true;
		var controllers = []
		var observers = []
		for(var key in clients){
			if(!clients[key].ready){
				allReady = false;
			}else{
				if(clients[key].is_controller){
					controllers.push(key);
				}else{
					observers.push(key);
				}
			}
		}

		if(allReady){
			if(controllers.length == 0){
				var key = observers[Math.floor(Math.random()*observers.length)]
				clients[key].is_controller = true
			}else if(controllers.length > 1){
				var cID = Math.floor(Math.random()*controllers.length)
				for(var i=0; i<controllers.length; i++){
					if(i == cID){
						clients[controllers[i]].is_controller = true
					}else{
						clients[controllers[i]].is_controller = false
					}
				}
			}

			for(var socketID in clients){
				sockets[socketID].emit('reset', clients[socketID].is_controller)
			}
			gameStarted = true;
		}
	}

	socket.on('disconnect', function () {
		delete clients[socket.id]

		checkReadyAndAssignPlayers();
	});

	if (game.gameover) {
		debug.game("Game is already over");
		socket.emit('gameover', {
			controller_won: game.controller_won,
			latecomer: true
		});
	}

	socket.on('ready', function(data){
		client.ready = true;
		client.is_controller = data;

		checkReadyAndAssignPlayers();
	})
});
