
// Testing Code

Crafty.e("2D, Canvas, Color, Movable, Gravity")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.color('lightblue')
	.gravity('Floor');

Crafty.e('Floor, 2D, Canvas, Color')
	.attr({x: 0, y: 250, w: 250, h: 10})
	.color('green');
