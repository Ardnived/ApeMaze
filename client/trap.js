var traps = {};

dispatch.on('trap', function(data) {
	traps[data.trap_id].activate();
	if(player.is_controller) {
		avatar.check_deathzones();
	}
});