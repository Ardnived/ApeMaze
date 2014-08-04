var canvas;

oCanvas.domReady(function() {
	console.log("Canvas Loading...");
	
	canvas = oCanvas.create({
		canvas: "#canvas"
	});
});

dispatch.chat.on_message = function(data) {
	debug.chat("Received", data);
};

dispatch.game.on_message = function(data) {
	debug.game("Received", data);
};

dispatch.init();
