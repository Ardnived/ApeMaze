var FireTrap = function(id, x, y) {
	this.id = id;

	this.flame = Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Deathzone")
					.attr({x: x - 5, y: y - 30, w: 35, h: 35})
					.reel('Burning', 600, 0, 0, 6)
					.animate('Burning', -1);
	this.flame.visible = false;

	this.click = function() {
		dispatch.emit('trap', {
			trap_id: this.id,
		});
	}

	// Activate trap
	this.activate = function() {
		this.flame.visible = true;

		var flame = this.flame;
		this.flame.timeout(function() {
			flame.visible = false;
		}, 3000);
	}

	dispatch.on('trap', function(data) {
		traps[data.trap_id].activate();
		if(player.is_controller) {
			avatar.check_deathzones();
		}
	});
}