var DEATH_MSG = {
	beartrap: 'The ape was caught by a bear trap!',
	beamtrap: 'The ape was killed by a laser beam!',
	fallingtrap: 'The ape was killed by falling rocks!',
	firetrap: 'The ape was burned to death!',
	spiketrap: 'The ape fell into a spike trap!',
	suicide: 'The ape has committed suicide!', //disconnect
}

// Testing Code
dispatch.on('gameover', function(data) {
	debug.game("Game Over", data);
	Crafty.pause();

	// Indicate what happened.
	if(data.controller_won != null){
		if (data.controller_won) {
			document.getElementById("lobby").getElementsByClassName("result")[0].innerHTML = "The Ape Escaped";
		} else {
			if(DEATH_MSG[data.cause] != undefined){
				document.getElementById("lobby").getElementsByClassName("result")[0].innerHTML = DEATH_MSG[data.cause]
			}else{
				document.getElementById("lobby").getElementsByClassName("result")[0].innerHTML = "The Ape Did Not Escape";
			}
		}
	}

	// Show the appropriate messages to the appropriate people.
	if(data.latecomer){
		document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "GAME IN PROGRESS";
		document.getElementById("lobby").className = "";
	}else{
		if(player.is_controller != undefined){
			if ((data.controller_won && player.is_controller) || (!data.controller_won && !player.is_controller)) {
				document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "VICTORY";
				document.getElementById("lobby").className = "victory";
			} else {
				document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "DEFEAT";
				document.getElementById("lobby").className = "defeat";
			}
		}else{
			document.getElementById("lobby").getElementsByClassName("title")[0].innerHTML = "GAME OVER";
			document.getElementById("lobby").className = "";
		}
	}

	document.getElementById("lobby").style.display = "block";
	document.getElementById("chat-toggle").checked = true;

	// Make sure everyone can see chat now.
	document.getElementById("chat").style.display = "block";
});

dispatch.on('reset', function(data){
	console.log('reset ' + data)
	document.getElementById("lobby").style.display = "none";

	if(avatar.entity != undefined)
		avatar.entity.destroy();
	player.is_controller = data
	//avatar.init();
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
