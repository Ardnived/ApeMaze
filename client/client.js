
// Testing Code
dispatch.on('gameover', function(data) {
	debug.game("Game Over", data);
	Crafty.pause();

	// Indicate what happened.
	if (data.controller_won) {
		document.getElementById("lobby").getElementsByClassName("result")[0].innerHTML = "The Ape Escaped";
	} else {
		document.getElementById("lobby").getElementsByClassName("result")[0].innerHTML = "The Ape Did Not Escape";
	}

	// Show the appropriate messages to the appropriate people.
	if (!data.latecomer) {
		if ((data.controller_won && player.is_controller) || (!data.controller_won && !player.is_controller)) {
			document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "VICTORY";
			document.getElementById("lobby").className = "victory";
		} else {
			document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "DEFEAT";
			document.getElementById("lobby").className = "defeat";
		}
	} else {
		document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "GAME IN PROGRESS";
		document.getElementById("lobby").className = "";
	}

	document.getElementById("lobby").style.display = "block";

	// Make sure everyone can see chat now.
	document.getElementById("chat").style.display = "block";
});

dispatch.on('reset', function(data){
	console.log('reset ' + data)
	document.getElementById("lobby").style.display = "none";

	avatar.entity.destroy();
	player.is_controller = data
	avatar.init();

	board.load(0);

	if (Crafty.isPaused()){
		Crafty.pause();
	}
	/*
	for(var trapID in traps){
		traps[trapID].reset();
	}
	*/
});
