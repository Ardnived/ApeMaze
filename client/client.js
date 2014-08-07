
// Testing Code
window.onload = function() {
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
	
	dispatch.on('reset', function(data){
		console.log('reset ' + data)
		Crafty.pause();
		avatar.entity.destroy();
		player.is_controller = data
		avatar.init();
		document.getElementById("victory").style.display = "none";
		document.getElementById("defeat").style.display = "none";
	});
}
