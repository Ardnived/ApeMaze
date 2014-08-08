function FallingTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);
	
	this.trigger.addComponent("FallingTrap");
	this.trigger.addComponent("Platform");
	this.trigger.addComponent("Floor");
	this.trigger.addComponent("Gravity");
	this.trigger.gravityConst(0);
	this.trigger.gravity("Floor");

	this.initialX = this.trigger.x;
	this.initialY = this.trigger.y;

	console.log(this.trigger.y);
	var h = board.tileheight/3;

	this.block = Crafty.e("2D, Canvas, GroundSprite")
		.attr({x: this.trigger.x, y: this.trigger.y, h: this.trigger.h, w: this.trigger.w})

	this.trigger.attach(this.block);
	this.trigger.z = 100;

	this.crush = Crafty.e("2D, Canvas, Deathzone, Collision")
		.attr({x: this.trigger.x, y: this.trigger.y + board.tileheight - h + 2, h: h, w: this.trigger.w});
	this.trigger.attach(this.crush);

	if (player.is_controller) {
		this.trigger.visible = false;
	}

	this.reset();
}

FallingTrap.prototype.activate = function(){
	Trap.prototype.activate.call(this);
	
	this.trigger.removeComponent("Platform");

	var that = this;

	if(player.is_controller) {
		this.crush.visible = true;

		var runnerFallingMove = function() {
			avatar.check_deathzones();
		}
		this.block.bind("Move", runnerFallingMove);

		var runnerFallingHit = function() {
			console.log("Falling Trap Landed");

			that.block.unbind("Move", that.runnerFallingMove);
			that.crush.visible = false;
			that.block.addComponent("Platform");
			that.block.removeComponent("Gravity");
			that.crush.unbind("EnterFrame", that.runnerFallingHit);
		}

		// Start falling collision detection
		this.crush.onHit("Platform", runnerFallingHit);
	} else {
		var observerFallingHit = function() {
			console.log("Falling Trap Landed");

			that.block.addComponent("Platform");
			that.block.removeComponent("Gravity");
			that.crush.unbind("EnterFrame", that.observerFallingHit);
		}

		// Start falling collision detection
		this.crush.onHit("Platform", observerFallingHit);
	}

	this.trigger.gravityConst(0.981);
}

FallingTrap.prototype.click = function() {
	Trap.prototype.click.call(this);
		console.log("Current Y: " + this.trigger.y);
}

FallingTrap.prototype.reset = function() {
	Trap.prototype.reset.call(this);

	this.crush.visible = false;

	this.trigger.gravityConst(0);
	this.trigger.y = this.initialY;
	this.trigger.x = this.initialX;

	if(player.is_controller) {
		// TODO Swap the image for regular terrain
	}
}



extend(Trap, FallingTrap);