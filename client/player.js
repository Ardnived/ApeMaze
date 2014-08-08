
var player = {
	id: null,
	name: null
};

dispatch.on('meta', function(data) {
	debug.dispatch("Meta", data);

	if (typeof data.player_id != 'undefined') {
		player.id = data.player_id;
		player.name = "Player "+player.id;

		document.getElementById('name_input').value = player.name;
	}

	if (typeof data.is_controller != 'undefined') {
		player.is_controller = data.is_controller;

		document.getElementById("lobby").style.display = "none";
		board.set_ready();
		avatar.init();
	}
});