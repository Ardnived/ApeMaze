var canvas;

oCanvas.domReady(function() {
	console.log("Canvas Loading...");
	
	canvas = oCanvas.create({
		canvas: "#canvas"
	});
	
	var sprite = canvas.display.sprite({
		x: 144,
		y: 137,
		origin: { x: "center", y: "center" },
		image: "../resources/img/east.png",
		generate: true,
		width: 32,
		height: 32,
		direction: "x",
		duration: 160,
		autostart: true
	});
	
	canvas.addChild(sprite);
});

dispatch.chat.on_message = function(data) {
	debug.chat("Received", data);
};

dispatch.game.on_message = function(data) {
	debug.game("Received", data);
};

dispatch.init();
