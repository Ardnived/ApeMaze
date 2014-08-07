var traps = {};

dispatch.on('trap', function(data) {
	if(data.type == 'firetrap'){
		if(data.activate) {
			traps[data.trap_id].activate();
		
			if(player.is_controller) {
				avatar.check_deathzones();
			}
		} else {
			// Show counter?
		}
	}else if(data.type == 'platformtrap'){
		traps[data.trap_id].box.x = data.x;
		traps[data.trap_id].box.y = data.y;
	}
});

function Trap(id, trigger, threshold) {
	var trap = this;

	this.trigger = trigger;
	this.trap_id = id;
	this.clicked = false;
	this.threshold = threshold;

	if(trigger != null){
		if (player.is_controller) {
			this.trigger.visible = false;
		} else {
			trigger.addComponent("Mouse");
			trigger.bind("Click", function() {
				trap.click();
			});
		}
	}
}

Trap.prototype.activate = function() {
	this.flame.visible = true;
	this.clicked = false; // Reset clickable
};

Trap.prototype.click = function() {
};
