var SERVER_NAME = "http://localhost";

var dispatch = {
	chat: {
		io: io.connect(SERVER_NAME+"/chat"),
		on_message: function(data) {
			debug.warn("Chat messages are not being handled.");
		}
	},
	
	game: {
		io: io.connect(SERVER_NAME+"/game"),
		on_message: function(data) {
			debug.warn("Game messages are not being handled.");
		}
	},
	
	init: function() {
		dispatch.chat.io.on('message', dispatch.chat.on_message);
		dispatch.game.io.on('message', dispatch.game.on_message);
		
		dispatch.chat.io.emit('meta', {
			name: "testusr"
		});
		
		dispatch.game.io.emit('meta', {
			name: "testusr"
		});
	},
};

