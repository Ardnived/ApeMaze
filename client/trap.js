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

function Trap(id, threshold) {
	this.trap_id = 0;
	this.clicked = false;
	this.threshold = threshold;
}

Trap.prototype.activate = function() {
	this.flame.visible = true;
	this.clicked = false; // Reset clickable
};

Trap.prototype.click = function() {
	if (!this.clicked) {
		this.clicked = true;
	
		var id = this.trap_id;
		var threshold = this.threshold;

		dispatch.emit('trap', {
			trap_id: id,
			threshold: threshold,
		});
	}
};
