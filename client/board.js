
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

				// Floor
				for(var floor = 0; floor < map.getEntitiesInLayer("floor").length; ++floor) {
					var floorEntity = map.getEntitiesInLayer("floor")[floor];
					floorEntity.addComponent("Platform");
					floorEntity.addComponent("Floor");
					//floorEntity.north.addComponent("Floor");
				}

				// Fire traps
				for(var fire = 0; fire < map.getEntitiesInLayer("fire_switch").length; ++fire) {
					// Get the switch
					var fireSwitch = map.getEntitiesInLayer("fire_switch")[fire];

					// Create a fire trap
					var fireTrap = new FireTrap(trapId, 1, fireSwitch.x, fireSwitch.y);

					// Runner
					if(player.is_controller) {
						fireSwitch.visible = false;
					}
					// Observer
					else {
						fireSwitch.addComponent("Mouse");
						fireSwitch.bind("Click", function() {
							fireTrap.click();
						});
					}

					traps[trapId] = fireTrap;
					trapId += 1;
				}

				// Clickable Falling platforms
				for(var falling = 0; falling < map.getEntitiesInLayer("clickable_falling_platforms").length; ++falling) {
					var platform = map.getEntitiesInLayer("clickable_falling_platforms")[falling];
					platform.addComponent("ClickableFallingPlatform");
					platform.addComponent("Mouse");
					platform.addComponent("Platform");
					platform.addComponent("Floor");
					//platform.north.addComponent("Floor");

					platform.bind("Click", function() {
						this.addComponent("Gravity");
						this.gravity("Floor")
					});
				}
			});

		Crafty.e("2D, Canvas, Color, Movable, Gravity")
			.attr({x: 100, y: 100, w: 32, h: 32})
			.color('lightblue')
			.gravity('Floor');
			
		//trap.create(0);
	}
};
