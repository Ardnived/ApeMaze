function FireTrap(id, threshold, x, y) {
	this.trap_id = 0;
	this.clicked = false;
	this.threshold = threshold;

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
	if(!this.clicked) {
		this.clicked = true;
	
		var id = this.trap_id;
		var threshold = this.threshold;
		
		dispatch.emit('trap', {
			trap_id: id,
			threshold: threshold,
		});
	}
}