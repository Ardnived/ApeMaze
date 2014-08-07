
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
		Crafty.e("2D, Canvas, TiledMapBuilder")
			.setMapDataSource( SOURCE_FROM_TILED_MAP_EDITOR )
			.createWorld(function(map) {
				console.log("Building tile map");				

				// Floor
				for(var floor = 0; floor < map.getEntitiesInLayer("floor").length; ++floor) {
					map.getEntitiesInLayer("floor")[floor]
						.addComponent("Floor");				
				}

				// Fire trap
				for(var fire = 0; fire < map.getEntitiesInLayer("fire_switch").length; ++fire) {
					if(player.is_controller) {
						map.getEntitiesInLayer("fire_switch")[fire]
							.addComponent("2D")
							.visible = false;
					}
				}
			});

		Crafty.e("2D, Canvas, Color, Movable, Gravity")
			.attr({x: 100, y: 100, w: 32, h: 32})
			.color('lightblue')
			.gravity('Floor');
			
		trap.create(0);
	}
};