function FallingTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);
	
	this.entity = trigger;
	this.entity.addComponent("FallingTrap");
	this.entity.addComponent("Platform");
	this.entity.addComponent("Floor");

	var h = board.tileheight/3;
	this.crush = Crafty.e("2D, Canvas, Deathzone, Collision").attr({x: this.entity.x, y: this.entity.y + board.tileheight - h, h: h, w: this.entity.w});
	this.entity.attach(this.crush);
	this.crush.visible = false;

	if(player.is_controller) {
		// TODO Swap the image for regular terrain
	}
}

FallingTrap.prototype.activate = function(){
	Trap.prototype.activate.call(this);
	
	this.entity.removeComponent("Platform");
	this.crush.visible = true;

	var that = this;
	this.entity.bind("Move", function() {
		if(player.is_controller) {
			avatar.check_deathzones();
		}
	});

	// Start falling collision detection
	this.crush.onHit("Platform", function() {
		console.log("HIT");
		that.entity.unbind("Move");
		that.crush.visible = false;
		that.entity.addComponent("Platform");
		that.crush.unbind("EnterFrame");
	});

	this.entity.addComponent("Gravity");
	this.entity.gravityConst(0.981);
	this.entity.gravity("Floor");
}

FallingTrap.prototype.click = function() {
	Trap.prototype.click.call(this);
}

extend(Trap, FallingTrap);