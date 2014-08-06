
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
