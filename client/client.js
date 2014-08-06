
// ===== CANVAS SETUP ===== //
var canvas;
var player;
var updatelist = [];

oCanvas.domReady(function() {
	console.log("Canvas Loading...");
	var fps = 10;
	
	canvas = oCanvas.create({
		canvas: "#canvas",
		fps: fps
	});
	canvas.framelength = 1000 / fps;
	
	board.init();
	
	var doodad = canvas.display.sprite({
		origin: { x: "center", y: "center" },
		image: "../resources/img/doodad.png",
		x: 0,
		y: 60,
		generate: true,
		width: 32,
		height: 32,
		duration: 100,
		autostart: true
	});
	board.display.addChild(doodad);
	
	player = new avatar();
	player.parent = canvas;
	player.update = function() {
		board.display.x -= this.direction.x * this.speed;
		board.display.y -= this.direction.y * this.speed;
	};
	updatelist.push(player);
	
	canvas.setLoop(function() {
		updatelist.forEach(function(item) {
			item.update();
		});
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

