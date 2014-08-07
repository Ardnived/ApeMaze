
var player = {};

dispatch.on('meta', function(data) {
	if (typeof data.is_controller != 'undefined') {
		player.is_controller = data.is_controller;
	}
	
	if (typeof data.player_id != 'undefined') {
		player.id = data.player_id;
	}

	init_avatar();
});