var dispatch = require("../server/dispatch");
var avatar = require("../server/avatar");
var game = require("../server/game");
var debug = require("../shared/debug");
var trap = require("../server/trap");

/**
 * When a new user connects, handle it.
 */
var clients = {};
var num_clients = 0;
var players_ready = 0;
var autoinc = 0;
var chat_messages = [];
var current_scene = 0;

dispatch.io.on('connection', function(socket) {
	client_is_controller = true;
	for (var key in clients) {
		if (clients[key].is_controller){
			client_is_controller = false;
			break;
		}
	}

	var client = {
		name: "Player "+autoinc,
		socket: socket,
		player_id: autoinc,
		is_controller: client_is_controller,
		room: null,
		ready: false
	};
	autoinc++;
	
	clients[socket.id] = client;
	num_clients++;

	debug.dispatch("Received Game Connection. Player ID:", clients[socket.id].player_id);
	
	// ------------------
	socket.join(client.room);

	socket.broadcast.emit('connection', {num_players: num_clients, players_ready: players_ready});

	socket.on('meta', function(data) {
		if (typeof data.name != 'undefined') {
			client.name = data.name;
		}
	});

	socket.emit('meta', { 
		player_id: client.player_id,
		num_players: num_clients,
		players_ready: players_ready
	});
	
	socket.on('move', function(data) {
		avatar.x = data.x;
		avatar.y = data.y;
		avatar.direction = data.direction;
		socket.broadcast.emit('move', data);
	});

	socket.on('stop', function(data){
		socket.broadcast.emit('stop', data);
	});

	socket.on('animation', function(data){
		socket.broadcast.emit('animation', data);
	});

	socket.on('shield', function(data) {
		socket.broadcast.emit('shield', data);
	});

	socket.on('scene', function(data) {
		current_scene = data.index;
		socket.broadcast.emit('scene', data);
	});
	
	socket.on('trap', function(data) {	
		if(data.type == 'beartrap' || data.type == 'platformtrap' || data.type == 'elevatortrap') {
			// Special
			socket.broadcast.emit('trap', data);
		} else {
			data.activate = false;

			if(data.trap_id in trap.traps) {
				trap.traps[data.trap_id].clicks += 1;
			} else {
				trap.traps[data.trap_id] = {
					clicks: 1,
					threshold: data.threshold,
					used: false
				};
			}
			data.clicks = trap.traps[data.trap_id].clicks;

			// Activate the trap
			if(trap.traps[data.trap_id].clicks == trap.traps[data.trap_id].threshold && !trap.traps[data.trap_id].used) {
				data.activate = true;
			}
			
			dispatch.io.emit('trap', data);
		}
	});

	socket.on('gameover', function(data) {
		game.active = false;
		game.controller_won = data.controller_won;
		game.cause = data.cause
		dispatch.io.emit('gameover', data);
		dispatch.io.emit('chat', {message: "Game over. The ape " + (data.controller_won ? "escaped." : "died.")})
		for(var key in clients){
			clients[key].ready = false;
		}
	})

	socket.on('enter', function(data) {
		socket.leave(room);
		client.room = data.room;
		socket.join(room);
	})

	socket.on('chat', function(data) {
		var date = new Date();

		data.name = client.name+"."+client.player_id;
		data.send_date = date.getHours()+":"+(date.getMinutes()<10?'0':'') + date.getMinutes();
		
		chat_messages.push(data);
		while (chat_messages.length > 20) {
			chat_messages.shift();
		}

		socket.broadcast.emit('chat', data);
	})

	// Send the most recent messages to the player on login
	socket.emit('chats', chat_messages);

	socket.on('disconnect', function () {
		delete clients[socket.id];
		num_clients--;
		checkReadyAndAssignPlayers();
	});

	if (game.active) {
		socket.emit('gameover', {latecomer: true, controller_won:null})
	} else if (game.controller_won != null) {
		socket.emit('gameover', {
			controller_won: game.controller_won,
			cause: game.cause,
			latecomer: true
		});
	}

	socket.on('ready', function(data){
		if(game.active){
			socket.emit('chat', {message: "You need to wait for the current game to end."})
		}else{
			client.ready = true;
			client.is_controller = data;
			dispatch.io.emit('chat', {
				message: client.name+" is ready."
			});

			checkReadyAndAssignPlayers();
		}

		players_ready = 0;
		for(var key in clients) {
			if(clients[key].ready) {
				players_ready++;
			}
		}
		dispatch.io.emit('ready', {num_players: num_clients, players_ready: players_ready});
	})
});

	
function checkReadyAndAssignPlayers() {
	if(game.active){
		var has_controller = false;
		for(var key in clients){
			if(clients[key].is_controller){
				has_controller=true;
				break;
			}
		}
		if(!has_controller){
			game.active = false;
			game.controller_won = false;
			game.cause = 'The ape has lost its connection lol...';
			dispatch.io.emit('gameover', {
				controller_won: game.controller_won,
				cause: game.cause,
				latecomer: false
			});
			dispatch.io.emit('chat', {
				message: 'The ape has lost its connection lol...'
			});
			for(var key in clients){
				clients[key].ready = false;
			}
		}
		return;
	}

	if(num_clients < 2){
		return;
	}

	var unreadyCount = 0;
	var controllers = []
	var observers = []
	for(var key in clients){
		if(!clients[key].ready){
			unreadyCount++;
		}else{
			if(clients[key].is_controller){
				controllers.push(key);
			}else{
				observers.push(key);
			}
		}
	}

	if(unreadyCount == 0){
		if(controllers.length == 0){
			for (var key in clients){
				clients[key].is_controller = true
				break;
			}
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

		trap.traps = {}
		
		if (game.controller_won == null) {
			for (var socketID in clients) {
				clients[socketID].socket.emit('meta', { 
					is_controller: clients[socketID].is_controller,
					num_players: num_clients
				});
			}
		} else {
			for (var socketID in clients) {
				clients[socketID].socket.emit('reset', clients[socketID].is_controller)
				clients[socketID].socket.emit('meta', { 
					is_controller: clients[socketID].is_controller,
					num_players: num_clients
				});
			}
		}
		
		debug.game("Starting game...")
		game.active = true;
	} else {
		var message = {
			message: "Waiting for "+unreadyCount+" users to be ready"
		}
		chat_messages.push(message);
		dispatch.io.emit('chat', message);
	}
}
