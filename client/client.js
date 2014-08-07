
// Testing Code
dispatch.on('gameover', function(data) {
	debug.game("Game Over", data);
	Crafty.pause();

	// Indicate what happened.
	if (data.controller_won) {
		document.getElementById("gameover").getElementsByClassName("result")[0].innerHTML = "The Ape Escaped";
	} else {
		document.getElementById("gameover").getElementsByClassName("result")[0].innerHTML = "The Ape Did Not Escape";
	}

	// Show the appropriate messages to the appropriate people.
	if (!data.latecomer) {
		if ((data.controller_won && player.is_controller) || (!data.controller_won && !player.is_controller)) {
			document.getElementById("gameover").getElementsByClassName("title")[0].innerHTML = "VICTORY";
			document.getElementById("gameover").className = "victory";
		} else {
			document.getElementById("gameover").getElementsByClassName("title")[0].innerHTML = "DEFEAT";
			document.getElementById("gameover").className = "defeat";
		}
	}

	document.getElementById("gameover").style.display = "block";

	// Make sure everyone can see chat now.
	document.getElementById("chat").style.display = "block";
});

dispatch.on('reset', function(data){
	console.log('reset ' + data)
	Crafty.pause();
	avatar.entity.destroy();
	player.is_controller = data
	avatar.init();
	document.getElementById("gameover").style.display = "none";
});
