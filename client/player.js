
var player = {};

dispatch.on('meta', function(data) {
	player.is_controller = data.is_controller;
	player.id = data.player_id;

	init_avatar();
});