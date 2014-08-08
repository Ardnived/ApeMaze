
Crafty.init(500, 350, document.getElementById('canvas'));

Crafty.sprite(233, "../resources/img/ape.png", {
	StandSprite: [2, 0], 
	JumpSprite:  [3, 0]
});

Crafty.sprite(32, "../resources/img/spritesheet.png", {
	SouthSprite: [0, 0], 
	WestSprite:  [0, 1],
	EastSprite:  [0, 2],
	NorthSprite: [0, 3]
});

Crafty.sprite(32, "../resources/img/doodad.png", {
	FireSprite: [0, 0]
});

Crafty.sprite(256, "../resources/img/circle.png", {
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