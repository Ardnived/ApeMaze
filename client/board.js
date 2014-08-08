var direction = {
	north: { x: 0, y: -1 },
	south: { x: 0, y: 1 },
	west: { x: -1, y: 0 },
	east: { x: 1, y: 0 },
	none: { x: 0, y: 0 }
};

var board = {
	width: null,
	height: null,
	tilewidth: null,
	tileheight: null,
	pixelwidth: null,
	pixelheight: null,
	current_stage: null,
	stage_count: 0,
	map: null,
	ready: false,
	set_ready: function() {
		board.ready = true;
		board.init();
	},
	set_map: function(source, map) {
		board.width = source.width;
		board.height = source.height;
		board.tilewidth = source.tilewidth;
		board.tileheight = source.tileheight;
		board.pixelwidth = source.width * source.tilewidth;
		board.pixelheight = source.height * source.tileheight;

		board.map = map;
		board.init();
	},
	init: function() {
		if (board.map == null || !board.ready) {
			return; // Load later when both things are ready.
		}

		var trapId = 0;
		var players = meta.num_players;

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
					traps[trapId] = new FallingTrap(trapId, trap, players * 6);
					break;
				// Lift
				case 7:
					traps[trapId] = new ElevatorTrap(trapId, trap);
					break;
				// Fire
				case 8:
					traps[trapId] = new FireTrap(trapId, trap, players * 3);
					break;
				// Spikes
				case 6:
					trap.addComponent("Deathzone");
					trap.y += board.tileheight / 2;
					trap.h = board.tileheight / 2;
					trap.type = 'spiketrap'
					break;
				// Laser Up
				case 10:
					traps[trapId] = new BeamTrap(trapId, trap, players * 8, 'up');
					break;
				// Laser Right
				case 11:
					traps[trapId] = new BeamTrap(trapId, trap, players * 8, 'right');
					break;
				// Laser Left
				case 12:
					traps[trapId] = new BeamTrap(trapId, trap, players * 8, 'left');
					break;
				// Laser Bottom
				case 13:
					traps[trapId] = new BeamTrap(trapId, trap, players * 8, 'down');
					break;
			}

			trapId++;
		}

		document.getElementById("loading").style.display = "none";
	},
	create: function(source) {
		if (source == null) {
			return;
		}

		Crafty.defineScene("stage"+board.stage_count, function() {
			Crafty.e("2D, Canvas, TiledMapBuilder")
				.setMapDataSource(source)
				.createWorld(function(map) {
					board.set_map(source, map);
				});
		})

		board.stage_count++;
	},
	load: function(index) {
		if (index < board.stage_count) {
			if (player.is_controller) {
				dispatch.emit('scene', {
					index: index
				});
			}

			board.current_stage = index;
			Crafty.enterScene("stage"+index);

			if (avatar.entity != null) {
				avatar.entity.x = AVATAR.startX;
				avatar.entity.y = AVATAR.startY;
				avatar.furthest.x = 0;
				avatar.furthest.y = 0;
			}

			Crafty.viewport.follow(avatar.entity, AVATAR.offset, 0);
		} else {
			avatar.on_win();
		}
	}
};

dispatch.on('scene', function(data) {
	board.load(data.index);
});

debug.game("Building Tile Maps...");
board.create(STAGE_01);
board.create(STAGE_02);
board.create(STAGE_03);
board.create(STAGE_04);
board.create(STAGE_05);
board.create(STAGE_FINAL);

board.load(0);
