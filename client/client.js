
// Testing Code
window.onload = function() {
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

	dispatch.on('gameover', function(data) {
		Crafty.pause();

		// Indicate what happened.
		if (data.controller_won) {
			document.getElementById("victory").getElementsByTagName("small")[0].innerHTML = "The Ape Escaped";
			document.getElementById("defeat").getElementsByTagName("small")[0].innerHTML = "The Ape Escaped";
		} else {
			document.getElementById("victory").getElementsByTagName("small")[0].innerHTML = "The Ape Did Not Escape";
			document.getElementById("defeat").getElementsByTagName("small")[0].innerHTML = "The Ape Did Not Escape";
		}

		// Show the appropriate messages to the appropriate people.
		if (data.controller_won) {
			if (player.is_controller) {
				document.getElementById("victory").style.display = "block";
			} else {
				document.getElementById("defeat").style.display = "block";
			}
		} else {
			if (player.is_controller) {
				document.getElementById("defeat").style.display = "block";
			} else {
				document.getElementById("victory").style.display = "block";
			}
		}

		// Make sure everyone can see chat now.
		document.getElementById("chat").style.display = "block";
		
	});
}
