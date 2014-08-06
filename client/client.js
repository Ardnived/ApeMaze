
// ===== CANVAS SETUP ===== //
var canvas;

oCanvas.domReady(function() {
	console.log("Canvas Loading...");
	var fps = 10;
	
	canvas = oCanvas.create({
		canvas: "#canvas",
		fps: fps
	});
	canvas.framelength = 1000 / fps;
	
	player.init();
	
	canvas.setLoop(function() {
		player.update();
	}).start();
});

// ===== INPUT SETUP ===== //
document.onkeydown = function (event) {
    event = event || window.event;
    
	switch (event.keyCode) {
		case 37: // Left
			player.move('west');
			break;
		case 38: // Up
			player.move('north');
			break;
		case 39: // Right
			player.move('east');
			break;
		case 40: // Down
			player.move('south');
			break;
	}
};

document.onkeyup = function (event) {
    event = event || window.event;
    
	switch (event.keyCode) {
		case 37: // Left
		case 38: // Up
		case 39: // Right
		case 40: // Down
			player.stop();
			break;
	}
};

// ===== SOCKET SETUP =====//
dispatch.chat.on_message = function(data) {
	debug.chat("Received", data);
};

dispatch.game.on_message = function(data) {
	debug.game("Received", data);
};

dispatch.init();

