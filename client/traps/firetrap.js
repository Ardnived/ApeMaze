function FireTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);

	var centerX = (trigger.x + trigger.w) / 2;
	this.flame = Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Deathzone")
					.attr({x: trigger.x + 2, y: trigger.y - 64, w: 60, h: 60})
					.reel('Burning', 600, 0, 0, 4)
					.animate('Burning', -1);
	this.flame.type = 'firetrap'

	this.reset();
}

FireTrap.prototype.activate = function() {
	Trap.prototype.activate.call(this);

	this.trigger.visible = false;	// Hide the trigger

	var flame = this.flame;
	this.flame.visible = true;
	this.flame.timeout(function() {
		flame.visible = false;
	}, 1500);
};

FireTrap.prototype.reset = function() {
	Trap.prototype.reset.call(this);

	this.flame.visible = false;
	this.trigger.visible = true;	// Hide the trigger

	if(player.is_controller) {
		this.trigger.visible = false;
	}
}


extend(Trap, FireTrap);