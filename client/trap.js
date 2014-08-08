var traps = {};

dispatch.on('trap', function(data) {
	console.log("Trap Activate Recieve: " + data.type);

	if(data.type == 'platformtrap'){
		trapBox = traps[data.trap_id].box

		trapBox.x = data.x;
		trapBox.y = data.y;

		if(player.is_controller){
			hitDetection = trapBox.hit('Player')
			if(hitDetection){
				if(trapBox.y > hitDetection[0].obj.y){
					hitDetection[0].obj.y = trapBox.y - hitDetection[0].obj.h
				}

				dispatch.emit('move', {
					x: avatar.entity.x,
					y: avatar.entity.y,
					direction: avatar.direction,
				});
			}
		}
	} else if(data.type == 'beartrap'){
		trapBox = traps[data.trap_id].box

		trapBox.x = data.x

		if(player.is_controller){
			hitDetection = trapBox.hit('Player')
			if(hitDetection){
				avatar.on_death();
			}
		}
	}else if(data.type == 'elevatortrap'){
		trapBox = traps[data.trap_id].box
		trapBox.y = data.y		
		//elevator trap sends the player and trap positions separately so they're equally laggy
	} else {
		if(data.activate) {
			console.log("Trap Activated");			
			traps[data.trap_id].activate();
		
			if(player.is_controller) {
				avatar.check_deathzones();
			}
		} else {
			// Show counter?
		}
	}
});

function Trap(id, trigger, threshold) {
	var trap = this;

	this.trigger = trigger;
	this.trap_id = id;
	this.clicked = false;
	this.threshold = threshold;
	this.string = this.constructor.name.toLowerCase();

	if (trigger != null){
		if (!player.is_controller) {
			trigger.addComponent("Mouse");
			trigger.bind("Click", function() {
				trap.click();
			});
		}
	}
}

Trap.prototype.activate = function() {
	// debug.game("Activate", this.constructor.name.toLowerCase());
	// this.clicked = false; // Reset clickable
};

Trap.prototype.click = function() {
	console.log("Trap Clicked: " + this.string);
	if (!player.is_controller && !this.clicked) {
		console.log()
		this.clicked = true;
	
		var id = this.trap_id;
		var threshold = this.threshold;

		console.log("Trap Activate Send: " + this.string);
		dispatch.emit('trap', {
			trap_id: id,
			type: this.string,
			threshold: threshold,
		});
	}
};

Trap.prototype.reset = function(){
	this.clicked = false;

	if (trigger != null){
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
