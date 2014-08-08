
var player = {
	id: null,
	name: null
};

var meta = {
	num_players: 1
}

dispatch.on('meta', function(data) {
	debug.dispatch("Meta", data);
	console.log(data);
	if (typeof data.num_players != 'undefined') {
		meta.num_players = data.num_players;
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
		board.set_ready();
		avatar.init();
	}
});