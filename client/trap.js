
var trap = {
	list: {},
	create: function(id) {
		var newtrap = Crafty.e('Floor, 2D, Canvas, Color, Mouse')
			.attr({x: 250, y: 250, w: 25, h: 25})
			.color('red')
			.bind('Click', this.on_click);

		newtrap.id = id;

		var flame = Crafty.e("2D, DOM, SpriteAnimation, FireSprite, Deathzone")
			.attr({x: newtrap.x - 5, y: newtrap.y - 30, w: 35, h: 35})
			.reel('Burning', 600, 0, 0, 6)
			.animate('Burning', -1);

		flame.visible = false;
		newtrap.attach(flame);
		newtrap.activate = function() {
			flame.visible = true;
			this.timeout(function() {
				flame.visible = false;
			}, 3000);
		}

		this.list[id] = newtrap;
	},
	on_click: function(event) {
		if (!player.is_controller) {
			dispatch.emit('trap', {
				trap_id: this.id,
			});
		}
	}
}

dispatch.on('trap', function(data) {
	trap.list[data.trap_id].activate();
	avatar.check_deathzones();
});

