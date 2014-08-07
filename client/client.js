
Crafty.e("2D, Canvas, SpriteAnimation, FireSprite")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.reel('Burning', 600, 0, 0, 6)
	.animate('Burning', -1);

Crafty.e("2D, Canvas, SpriteAnimation, FireSprite, Movable, Gravity")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.reel('Burning', 600, 0, 0, 6)
	.animate('Burning', -1)
	.gravity('Floor');

Crafty.e('Floor, 2D, Canvas, Color')
	.attr({x: 0, y: 250, w: 250, h: 10})
	.color('green');
