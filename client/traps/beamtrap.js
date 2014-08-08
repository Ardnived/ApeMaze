function BeamTrap(id, trigger, threshold) {
	Trap.call(this, id, trigger, threshold);

	this.beam = Crafty.e("2D, Canvas, SpriteAnimation, BeamSprite, Deathzone")
					.attr({x: trigger.x + 28.5, y: trigger.y + 16, w: 25, h: 198})
					.reel('Firing', 300, 0, 0, 3)
					.animate('Firing', -1);

	this.beam.rotation = 180;
	this.beam.visible = false;
}

BeamTrap.prototype.activate = function() {
	Trap.prototype.activate.call(this);

	var beam = this.beam;
	this.beam.visible = true;
	this.beam.timeout(function() {
		beam.visible = false;
	}, 3000);
};


extend(Trap, BeamTrap);