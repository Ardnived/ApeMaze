function FireTrap(id, x, y) {
	this.trap_id = 0;
	this.clicked = false;

	this.flame = Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Deathzone")
					.attr({x: x - 5, y: y - 30, w: 35, h: 35})
					.reel('Burning', 600, 0, 0, 6)
					.animate('Burning', -1);
	this.flame.visible = false;
}

FireTrap.prototype.activate = function(){
	this.flame.visible = true;

	var flame = this.flame;
	this.flame.timeout(function() {
		flame.visible = false;
	}, 3000);
}

FireTrap.prototype.click = function() {
	this.clicked = true;
	console.log(this.trap_id)
	var id = this.trap_id;
	dispatch.emit('trap', {
		trap_id: id,
	});
}