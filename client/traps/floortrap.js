/*
function FloorTrap(id, threshold, x, y) {
	Trap.call(this, id, threshold);

	this.flame = Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Deathzone")
					.attr({x: x - 5, y: y - 30, w: 35, h: 35})
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

extend(Trap, FireTrap);
*/