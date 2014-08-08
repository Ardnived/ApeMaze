function FallingTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);
	
	this.trigger.addComponent("FallingTrap");
	this.trigger.addComponent("Platform");
	this.trigger.addComponent("Floor");

	this.initialX = this.trigger.x;
	this.initialY = this.trigger.y;

	var h = board.tileheight/3;
	this.crush = Crafty.e("2D, Canvas, Deathzone, Collision").attr({x: this.trigger.x, y: this.trigger.y + board.tileheight - h, h: h, w: this.trigger.w});
	this.trigger.attach(this.crush);

	this.reset();
}

FallingTrap.prototype.activate = function(){
	Trap.prototype.activate.call(this);
	
	this.trigger.removeComponent("Platform");
	this.crush.visible = true;

	var that = this;
	this.trigger.bind("Move", function() {
		if(player.is_controller) {
			avatar.check_deathzones();
		}
	});

	// Start falling collision detection
	this.crush.onHit("Platform", function() {
		console.log("Boink!");

		that.trigger.unbind("Move");
		that.crush.visible = false;
		that.trigger.addComponent("Platform");
		that.trigger.removeComponent("Gravity");
		that.crush.unbind("EnterFrame");
	});

	this.trigger.addComponent("Gravity");
	this.trigger.gravityConst(0.981);
	this.trigger.gravity("Floor");
}

FallingTrap.prototype.click = function() {
	Trap.prototype.click.call(this);
}

FallingTrap.prototype.reset = function() {
	Trap.prototype.reset.call(this);

	this.crush.visible = false;
	this.trigger.x = this.initialX;
	this.trigger.y = this.initialY;

	if(player.is_controller) {
		// TODO Swap the image for regular terrain
	}
}

extend(Trap, FallingTrap);