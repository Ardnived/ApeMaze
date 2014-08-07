var traps = {};
var trapSwitches = {}

dispatch.on('trap', function(data) {
	if(data.activate) {
		traps[data.trap_id].activate();
	
		if(player.is_controller) {
			avatar.check_deathzones();
		}
	} else {
		// Show counter?
	}
});
