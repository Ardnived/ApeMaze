
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

Crafty.e("2D, DOM, SpriteAnimation, FireSprite")
	.attr({x: 100, y: 100, w: 32, h: 32})
	.reel('Burning', 600, 0, 0, 6)
	.animate('Burning', -1);

Crafty.e('Floor, 2D, Canvas, Color')
	.attr({x: 0, y: 250, w: 250, h: 10})
	.color('green');

Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite, Fourway, Gravity')
	.attr({x: 0, y: 0, w: 50, h: 50})
	.reel('South', 700, 0, 0, 3)
	.reel('West', 700, 0, 1, 3)
	.reel('East', 700, 0, 2, 3)
	.reel('North', 700, 0, 3, 3)
	.fourway(4)
	.gravity('Floor');


