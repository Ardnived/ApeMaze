
// Testing Code

Crafty.e("2D, Canvas, Color, Movable, Gravity")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.color('lightblue')
	.gravity('Floor');

Crafty.e('Floor, 2D, Canvas, Color')
	.attr({x: 0, y: 250, w: 250, h: 10})
	.color('green');

var trap = Crafty.e('Floor, 2D, Canvas, Color, Mouse')
	.attr({x: 250, y: 250, w: 25, h: 25})
	.color('red')
	.bind('Click', function() {
		if (!player.is_controller) {
			flame.visible = true;
			this.timeout(function() {
				flame.visible = false;
			}, 1000);
		}
	});

var flame = Crafty.e("2D, DOM, SpriteAnimation, FireSprite")
	.attr({x: trap.x - 3.5, y: trap.y - 30, w: 32, h: 32})
	.reel('Burning', 600, 0, 0, 6)
	.animate('Burning', -1);

flame.visible = false;

trap.attach(flame);