var direction = {
	north: { x: 0, y: -1 },
	south: { x: 0, y: 1 },
	west: { x: -1, y: 0 },
	east: { x: 1, y: 0 },
	none: { x: 0, y: 0 }
};

var board = {
	width: SOURCE_FROM_TILED_MAP_EDITOR.width,
	height: SOURCE_FROM_TILED_MAP_EDITOR.height,
	tilewidth: SOURCE_FROM_TILED_MAP_EDITOR.tilewidth,
	tileheight: SOURCE_FROM_TILED_MAP_EDITOR.tileheight,
	pixelwidth: SOURCE_FROM_TILED_MAP_EDITOR.width * SOURCE_FROM_TILED_MAP_EDITOR.tilewidth,
	pixelheight: SOURCE_FROM_TILED_MAP_EDITOR.height * SOURCE_FROM_TILED_MAP_EDITOR.tileheight,
	init: function() {
		var trapId = 0;

		Crafty.e("2D, Canvas, TiledMapBuilder")
			.setMapDataSource( SOURCE_FROM_TILED_MAP_EDITOR )
			.createWorld(function(map) {
				debug.game("Building Tile Map...");

				// Floor
				for(var floor = 0; floor < map.getEntitiesInLayer("floor").length; ++floor) {
					var floorEntity = map.getEntitiesInLayer("floor")[floor];
					floorEntity.addComponent("Platform");
					floorEntity.addComponent("Floor");
				}

				// Traps
				for(var trapIndex = 0; trapIndex < map.getEntitiesInLayer("traps").length; ++trapIndex) {
					var trap = map.getEntitiesInLayer("traps")[trapIndex];
					var trapType = trap.tileProperty;
					
					/*
						34 - falling
						15 - lift
						31 - fire
						39 - spikes
						48 - laser
					*/
					switch(trapType) {
						// Falling
						case 34:
							traps[trapId] = new FallingTrap(trapId, trap, 1);
							break;
						// Lift
						case 15:
							// traps[trapId] = new 
							break;
						// Fire
						case 31:
							traps[trapId] = new FireTrap(trapId, trap, 1);
							break;
						// Spikes
						case 39:
							trap.addComponent("Deathzone");
							trap.y += board.tileheight / 2;
							trap.h = board.tileheight / 2;
							break;
						// Laser
						case 48:
							break;
					}

					trapId++;
				}
				document.getElementById("loading").style.display = "none";
			});

		/*
		Crafty.e("2D, Canvas, Color, Movable, Gravity, Floor")
			.attr({x: 100, y: 100, w: 32, h: 32})
			.color('lightblue')
			.gravity('Floor');
		*/
	}
};
