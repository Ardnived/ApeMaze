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
	map: null,
	ready: false,
	set_ready: function() {
		board.ready = true;
		board.init();
	},
	set_map: function(map) {
		board.map = map;
		board.init();
	},
	init: function() {
		debug.game("init", board.map == null, !board.ready);
		if (board.map == null || !board.ready) {
			return; // Load later when both things are ready.
		}

		var trapId = 0;

		// Floor
		for(var floor = 0; floor < board.map.getEntitiesInLayer("floor").length; ++floor) {
			var floorEntity = board.map.getEntitiesInLayer("floor")[floor];
			floorEntity.addComponent("Platform");
			floorEntity.addComponent("Floor");
		}

		// Traps
		for(var trapIndex = 0; trapIndex < board.map.getEntitiesInLayer("traps").length; ++trapIndex) {
			var trap = board.map.getEntitiesInLayer("traps")[trapIndex];
			var trapType = trap.tileProperty;
			console.log(trapType);
			/*
				9 - falling
				7 - lift
				8 - fire
				6 - spikes
				10 - laser
			*/
			switch(trapType) {
				// Falling
				case 9:
					traps[trapId] = new FallingTrap(trapId, trap, 1);
					break;
				// Lift
				case 7:
					// traps[trapId] = new 
					break;
				// Fire
				case 8:
					traps[trapId] = new FireTrap(trapId, trap, 1);
					break;
				// Spikes
				case 6:
					trap.addComponent("Deathzone");
					trap.y += board.tileheight / 2;
					trap.h = board.tileheight / 2;
					break;
				// Laser
				case 10:
					traps[trapId] = new BeamTrap(trapId, trap, 1);
					break;
			}

			trapId++;
		}

		document.getElementById("loading").style.display = "none";
		
		/*
		Crafty.e("2D, Canvas, Color, Movable, Gravity, Floor")
			.attr({x: 100, y: 100, w: 32, h: 32})
			.color('lightblue')
			.gravity('Floor');
		*/
	}

};

debug.game("Building Tile Map...");
Crafty.e("2D, Canvas, TiledMapBuilder")
	.setMapDataSource( SOURCE_FROM_TILED_MAP_EDITOR )
	.createWorld(function(map) {
		board.set_map(map);
	});
