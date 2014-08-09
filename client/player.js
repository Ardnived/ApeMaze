
var player = {
	id: null,
	name: null
};

var meta = {
	num_players: 1
}

var waiting_players = [];

dispatch.on('meta', function(data) {
	debug.dispatch("Meta", data);
	console.log(data);
	if (typeof data.num_players != 'undefined') {
		meta.num_players = data.num_players;

		updateWaiting(data.num_players, data.players_ready);
	}

	if (typeof data.player_id != 'undefined') {
		player.id = data.player_id;

		var storedName = null;
		var cookies = document.cookie.split('; ')
		for(var i=0; i<cookies.length; i++){
			if(cookies[i].indexOf('username=') == 0){
				storedName = cookies[i].substr(9, cookies[i].length)
			}
		}

		if(storedName != undefined){
			player.name = storedName
			document.getElementById('name_input').value = player.name;
			dispatch.emit('meta', {
				name: player.name
			});
		}else{
			player.name = "Player "+player.id;
			document.getElementById('name_input').value = player.name;
		}
	}

	if (typeof data.is_controller != 'undefined') {
		player.is_controller = data.is_controller;

		document.getElementById("lobby").style.display = "none";
		document.getElementById("chat-toggle").checked = false;

		if (player.is_controller) {
			document.body.className = "controller";
		} else {
			document.body.className = "observer";
		}

		board.set_ready();
		avatar.init();
	}
});

dispatch.on('ready', function(data) {
	debug.dispatch("Ready", data);
updateWaiting(data.num_players, data.players_ready)
});


dispatch.on('connection', function(data) {
	debug.dispatch("connection", data);
	updateWaiting(data.num_players, data.players_ready);
});

dispatch.on('reset', function(data) {
	document.getElementById('players_waiting').style.visibility = 'hidden';
});

dispatch.on('gameover', function(data) {
	document.getElementById('players_waiting').style.visibility = 'visible';
	updateWaiting(meta.num_players, 0);
});

dispatch.on('player_left', function(data) {
	debug.dispatch("player_left", data);
	updateWaiting(data.num_players, data.players_ready);
});

function updateWaiting(num_players, num_ready) {
	meta.num_players = num_players;

	document.getElementById('players_waiting').innerHTML = '';
	waiting_players = [];
	var waiting_container = document.getElementById('players_waiting');

	// Show waiting players
	for(var i = 0; i < num_players; ++i) {
		console.log("player");

		waiting_players.push(document.createElement('div'));
		waiting_players[i].id = i < num_ready ? "circle_ready" : "circle";
		waiting_container.appendChild(waiting_players[i]);
	}
}

// DC Player
dispatch.on('knockout', function(data) {
	document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "FINISH YOUR BANANAS";
	document.getElementById("lobby").getElementsByClassName("result")[0].innerHTML = "We disconnected you, refresh to reconnect";
	updateWaiting(0, 0);
	document.getElementById("choice").style.visibility = 'hidden';
	document.getElementById("players_waiting").style.visibility = 'hidden';
	document.getElementById("canvas").style.display = 'none';
});