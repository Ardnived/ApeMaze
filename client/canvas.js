
Crafty.init(500, 350, document.getElementById('canvas'));

Crafty.sprite(32, "../resources/img/spritesheet.png", {
	SouthSprite: [0, 0], 
	WestSprite:  [0, 1],
	EastSprite:  [0, 2],
	NorthSprite: [0, 3]
});

Crafty.sprite(32, "../resources/img/doodad.png", {
	FireSprite: [0, 0]
});

