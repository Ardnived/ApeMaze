
Crafty.e("2D, DOM, SpriteAnimation, FireSprite")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.reel('Burning', 600, 0, 0, 6)
	.animate('Burning', -1);

Crafty.e('Floor, 2D, Canvas, Color')
	.attr({x: 0, y: 250, w: 250, h: 10})
	.color('green');
