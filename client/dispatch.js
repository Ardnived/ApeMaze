var SERVER_NAME = "http://localhost";

var dispatch = {
	chat: io.connect(SERVER_NAME+"/chat"),
	game: io.connect(SERVER_NAME+"/game")
};

