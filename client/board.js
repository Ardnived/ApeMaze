
var direction = {
	north: { x: 0, y: -1 },
	south: { x: 0, y: 1 },
	west: { x: -1, y: 0 },
	east: { x: 1, y: 0 },
	none: { x: 0, y: 0 }
};

var board = {
	display: null,
	init: function() {
		this.display = canvas.display.line({
			x: canvas.width / 2,
			y: canvas.height / 2
		});
		this.display.add();
	}
};

// TODO: Remove this sample code.
Crafty.e("2D, Canvas, Color, Movable, Gravity")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.color('lightblue')
	.gravity('Floor');

Crafty.e('Floor, 2D, Canvas, Color')
	.attr({x: 0, y: 250, w: 250, h: 10})
	.color('green');

trap.create(0);