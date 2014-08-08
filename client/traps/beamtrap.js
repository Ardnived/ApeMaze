function BeamTrap(id, trigger, threshold, direction) {
	Trap.call(this, id, trigger, threshold);

	this.direction = direction;
	this.beam = Crafty.e("2D, Canvas, SpriteAnimation, BeamSprite, Deathzone")
					.attr({w: 64, h: 320})
					.reel('Firing', 500, 0, 0, 6)
					.animate('Firing', -1);

	this.beam.type = 'beamtrap'
	
	switch (this.direction) {
		case 'up':
			this.beam.rotation = 180;
			this.beam.attr({x: trigger.x + 64, y: trigger.y });
			break;
		case 'right':
			this.beam.rotation = 270;
			this.beam.attr({x: trigger.x + 64, y: trigger.y + 64 });
			break;
		case 'left':
			this.beam.rotation = 90;
			this.beam.attr({x: trigger.x, y: trigger.y });
			break;
		case 'down':
			this.beam.rotation = 0;
			this.beam.attr({x: trigger.x, y: trigger.y + 64 });
			break;
	}
	
	this.reset();
}

BeamTrap.prototype.activate = function() {
	Trap.prototype.activate.call(this);

	var beam = this.beam;
	this.beam.visible = true;

	this.trigger.visible = false;

	this.beam.timeout(function() {
		beam.visible = false;
	}, 1000);
};

BeamTrap.prototype.reset = function() {
	Trap.prototype.reset.call(this);

	this.beam.visible = false;

	if(player.is_controller) {
		this.trigger.visible = false;
	} else {
		this.trigger.visible = true;
	}
}

extend(Trap, BeamTrap);