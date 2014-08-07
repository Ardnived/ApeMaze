
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

Crafty.e("2D, Canvas, TiledMapBuilder")
	.setMapDataSource( SOURCE_FROM_TILED_MAP_EDITOR )
	.createWorld(function(map) {
		console.log("Building tile map");
		for(var floor = 0; floor < map.getEntitiesInLayer("floor").length; ++floor) {
			map.getEntitiesInLayer("floor")[floor]
				.addComponent("Floor");
		}
	});

Crafty.e("2D, Canvas, Color, Movable, Gravity")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.color('lightblue')
	.gravity('Floor');
	
trap.create(0);