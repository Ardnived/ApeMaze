
Crafty.init(920, 500, document.getElementById('canvas'));

Crafty.sprite(50, "../resources/img/ape50.png", {
	StandSprite: [2, 0], 
	JumpSprite:  [4, 0]
});

Crafty.sprite(150, 50, "../resources/img/dash.png", {
	DashSprite: [0, 0]
});

Crafty.sprite(64, "../resources/img/fall.png", {
	GroundSprite: [0, 0]
});

Crafty.sprite(64, "../resources/img/fire.png", {
	FireSprite: [0, 0]
});

Crafty.sprite(64, "../resources/img/circle.png", {
	CircleSprite: [0, 0]
})

Crafty.sprite(49, 86, "../resources/img/fire.png", {
	FlameSprite: [0, 0]
})

Crafty.sprite(25, 198, "../resources/img/beam.png", {
	BeamSprite: [0, 0]
})

Crafty.audio.create('dash', "../resources/sounds/dash.wav")
Crafty.audio.create('shield', "../resources/sounds/shield.wav")
Crafty.audio.create('ape_call', "../resources/sounds/ape_call.wav")
Crafty.audio.create('bump', "../resources/sounds/bump.wav")
Crafty.audio.create('laser', "../resources/sounds/laser.wav")
