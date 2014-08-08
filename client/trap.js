var traps = {};
var threshold_text = {};
var threshold_left = {};

dispatch.on('trap', function(data) {

	if(data.clicks!=null)
	traps[data.trap_id].set_threshold_text(data.trap_id, traps[data.trap_id].trigger, data.threshold - data.clicks);

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
		console.log("Trap Activate Recieve: " + data.type);
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
	this.trigger = trigger;
	this.trap_id = id;
	this.threshold = threshold;
	this.string = this.constructor.name.toLowerCase();

	threshold_left[id] = this.threshold;
	this.set_threshold_text_first(id, this.trigger, this.threshold);
}

Trap.prototype.set_threshold_text_first = function(id, trigger, num) {
	threshold_text[id] = Crafty
								.e("2D, DOM, Text")
								.attr({ x: trigger.x, y: trigger.y })
								.textFont({ size: '20px', weight: 'bold' })
								.text(num.toString());
	if(player.is_controller) threshold_text[id].visible = false;
	trigger.attach(threshold_text[id]);
	this.set_threshold_text(id, trigger, num);
}

Trap.prototype.set_threshold_text = function(id, trigger, num) {
	if(trigger){
		//if(threshold_text[id]!=null)
		//	trigger.detach(threshold_text[id]);
		threshold_left[id] = num;
		if(threshold_text[id]==null){
			threshold_text[id] = Crafty
								.e("2D, DOM, Text")
								.attr({ x: trigger.x, y: trigger.y })
								.textFont({ size: '20px', weight: 'bold' })
								.text(num.toString());
			if(player.is_controller) threshold_text[id].visible = false;
			trigger.attach(threshold_text[id]);
		}
		else{
			if(num!=0)
				threshold_text[id].text(num);
			else
				threshold_text[id].text("");
		}
	}
}

Trap.prototype.activate = function() {
	// debug.game("Activate", this.constructor.name.toLowerCase());
	// this.clicked = false; // Reset clickable
};

Trap.prototype.click = function() {
	console.log("Trap Clicked: " + this.string);
	if (!player.is_controller) {
		var id = this.trap_id;
		var threshold = this.threshold;

		console.log("Trap Activate Send: " + this.string);
		dispatch.emit('trap', {
			trap_id: id,
			type: this.string,
			threshold: threshold,
		});

		if(threshold_left > 0) {
			threshold_left -= 1;
			traps[this.trap_id].set_threshold_text(id, traps[this.trap_id].trigger, threshold_left[id]);
		}
	}
};

/*
	Set the trap to it's initial conditions
*/
Trap.prototype.reset = function() {
	var that = this;

	if (this.trigger != null){
		if (!player.is_controller) {
			this.trigger.addComponent("Mouse");
			this.trigger.bind("Click", function() {
				that.click();
			});
		}
	}
}
