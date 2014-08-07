
var traps = [];

traps[0] = Crafty.e('Floor, 2D, Canvas, Color, Mouse')
	.attr({x: 250, y: 250, w: 25, h: 25})
	.color('red')
	.bind('Click', function() {
		if (!player.is_controller) {
			dispatch.emit('trap', {
				trap_id: 0,
			});
		}
	});

var flame = Crafty.e("2D, DOM, SpriteAnimation, FireSprite")
	.attr({x: traps[0].x - 3.5, y: traps[0].y - 30, w: 32, h: 32})
	.reel('Burning', 600, 0, 0, 6)
	.animate('Burning', -1);

flame.visible = false;
traps[0].attach(flame);
traps[0].activate = function() {
	flame.visible = true;
	this.timeout(function() {
		flame.visible = false;
	}, 1000);
}

dispatch.on('trap', function(data) {
	traps[data.trap_id].activate();
});
