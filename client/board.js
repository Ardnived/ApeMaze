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
		var trapId = 0;

		Crafty.e("2D, Canvas, TiledMapBuilder")
			.setMapDataSource( SOURCE_FROM_TILED_MAP_EDITOR )
			.createWorld(function(map) {
				console.log("Building tile map");

				console.log(map.getLayers());
				// Floor
				for(var floor = 0; floor < map.getEntitiesInLayer("floor").length; ++floor) {
					var floorEntity = map.getEntitiesInLayer("floor")[floor];
					floorEntity.addComponent("Platform");
					floorEntity.addComponent("Floor");
					//floorEntity.north.addComponent("Floor");
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
							trap.y += 32/2
							trap.h = 32/2
							break;
						// Laser
						case 48:
							break;
					}

					trapId++;
				}

				traps[trapId] = new ElevatorTrap(trapId, 200,200,100,20, 100, 1)

/*				// Fire traps
				for(var fire = 0; fire < map.getEntitiesInLayer("fire_switch").length; ++fire) {
					var fireSwitch = map.getEntitiesInLayer("fire_switch")[fire];
					traps[trapId] = new FireTrap(trapId, fireSwitch, 1);
					trapId++;
				}*/

						
				// traps[trapId] = new PlatformTrap(trapId, 100,300,100,20, 100, 100)
				// trapId++

				// traps[trapId] = new BearTrap(trapId, 150,250,100,20, 100)
				// trapId++

				/*
				// Clickable Falling platforms
				for(var falling = 0; falling < map.getEntitiesInLayer("clickable_falling_platform_switch").length; ++falling) {
					var platformSwitch = map.getEntitiesInLayer("clickable_falling_platform_switch")[falling];
					var platform = map.getEntitiesInLayer("clickable_falling_platform")[falling];
					traps[trapId] = new ClickableFallingPlatform(trapId, platformSwitch, 1, platform);
					trapId++;
				}
				*/
/*
				// Beam traps
				for(var i = 0; i < map.getEntitiesInLayer("clickable_laser_beam").length; ++i) {
					var trap = map.getEntitiesInLayer("clickable_laser_beam")[i];
					traps[trapId] = new BeamTrap(trapId, trap, 1);
					trapId++;
				}*/
				/*
				traps[trapId] = new PlatformTrap(trapId, 300,0,100,20, 100, 100)
				trapId++
				*/

				document.getElementById("loading").style.display = "none";
			});

		/*
		Crafty.e("2D, Canvas, Color, Movable, Gravity")
			.attr({x: 100, y: 100, w: 32, h: 32})
			.color('lightblue')
			.gravity('Floor');
		*/
	}
};
