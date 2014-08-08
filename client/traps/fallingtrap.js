function FallingTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);
	
	this.entity = trigger;
	this.entity.addComponent("FallingTrap");
	this.entity.addComponent("Platform");
	this.entity.addComponent("Floor");

	if(player.is_controller) {
		// TODO Swap the image for regular terrain
	}
}

FallingTrap.prototype.activate = function(){
	Trap.prototype.activate.call(this);
	//this.unbind("Click");
	this.entity.addComponent("Gravity");
	this.entity.gravityConst(0.4);
	this.entity.gravity("Floor");
}

FallingTrap.prototype.click = function() {
	Trap.prototype.click.call(this);
}

extend(Trap, FallingTrap);