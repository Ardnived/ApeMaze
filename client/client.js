
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
	
	player = new avatar(canvas);
	player.sprite.current.x = canvas.width / 2;
	player.sprite.current.y = canvas.height / 2;
	player.update = function() {
		board.display.x -= this.direction.x * this.speed;
		board.display.y -= this.direction.y * this.speed;
	};
	player.on_move = function(dir) {
		dispatch.game.emit('move', {
			x: this.sprite.current.x - board.display.x,
			y: this.sprite.current.y - board.display.y,
			direction: dir,
			player_id: my_player_id
		});
	};
	player.on_stop = function() {
		dispatch.game.emit('stop', {
			x: this.sprite.current.x - board.display.x,
			y: this.sprite.current.y - board.display.y,
			player_id: my_player_id
		});
	};
	updatelist.push(player);
	
	canvas.setLoop(function() {
		updatelist.forEach(function(item) {
			item.update();
		});
	}).start();
});

// ===== REMOTE AVATAR MANAGEMENT ===== //
// TODO: Move this code to somewhere else.
var avatars = {};
var my_player_id;

dispatch.game.on('meta', function(data) {
	my_player_id = data.player_id;
});

dispatch.game.on('move', function(data) {
	debug.dispatch('Received Move', data);
	
	if (my_player_id == data.player_id) {
		return;
	}
	
	if (avatars[data.player_id] == null) {
		avatars[data.player_id] = new avatar();
		avatars[data.player_id].parent = board.display;
		updatelist.push(avatars[data.player_id]);
	}
	
	avatars[data.player_id].sprite.current.x = data.x;
	avatars[data.player_id].sprite.current.y = data.y;
	avatars[data.player_id].move(data.direction);
});

dispatch.game.on('stop', function(data) {
	debug.dispatch('Received Stop', data);
	
	if (my_player_id == data.player_id) {
		return;
	}
	
	if (avatars[data.player_id] == null) {
		avatars[data.player_id] = new avatar();
		avatars[data.player_id].parent = board.display;
		updatelist.push(avatars[data.player_id]);
	}
	
	avatars[data.player_id].sprite.current.x = data.x;
	avatars[data.player_id].sprite.current.y = data.y;
	avatars[data.player_id].stop();
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

