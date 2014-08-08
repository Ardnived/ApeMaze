function FireTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);

	var centerX = (trigger.x + trigger.w) / 2;
	
	this.flame = Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Deathzone")
					.attr({x: trigger.x, y: trigger.y - 35, w: 35, h: 35})
					.reel('Burning', 600, 0, 0, 6)
					.animate('Burning', -1);
	this.flame.visible = false;

	if(player.is_controller) {
		trigger.visible = false;
	}
}

FireTrap.prototype.activate = function() {
	Trap.prototype.activate.call(this);

	this.trigger.visible = false;	// Hide the trigger

	var flame = this.flame;
	this.flame.visible = true;
	this.flame.timeout(function() {
		flame.visible = false;
	}, 3000);
};


extend(Trap, FireTrap);