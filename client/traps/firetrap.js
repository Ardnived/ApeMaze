function FireTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);

	this.flame = Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Deathzone")
					.attr({x: trigger.x - 5, y: trigger.y - 30, w: 35, h: 35})
					.reel('Burning', 600, 0, 0, 6)
					.animate('Burning', -1);
	this.flame.visible = false;
}

FireTrap.prototype.activate = function() {
	Trap.prototype.activate.call(this);

	var flame = this.flame;
	this.flame.timeout(function() {
		flame.visible = false;
	}, 3000);
};

FireTrap.prototype.click = function() {
	if (!this.clicked) {
		this.clicked = true;
	
		var id = this.trap_id;
		var threshold = this.threshold;

		dispatch.emit('trap', {
			trap_id: id,
			type: 'firetrap',
			threshold: threshold,
		});
	}
};


extend(Trap, FireTrap);