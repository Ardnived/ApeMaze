
var player = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite, Twoway, Gravity, Collision')
	.attr({x: 0, y: 0, w: 50, h: 50})
	.reel('South', 700, 0, 0, 3)
	.reel('West', 700, 0, 1, 3)
	.reel('East', 700, 0, 2, 3)
	.reel('North', 700, 0, 3, 3)
	.twoway(4, 10)
	.gravity('Floor')
	.gravityConst(0.4)
	.bind('NewDirection', function(event) {
		console.log(this);
		if (this.isDown('LEFT_ARROW')) {
			this.animate('West', -1);
	    } else if (this.isDown('RIGHT_ARROW')) {
			this.animate('East', -1);
	    } else if (this.isDown('UP_ARROW')) {
			this.animate('South', -1);
		}
	})
	.bind('Moved', function(event) {
		dispatch.emit('move', {
			x: this.x,
			y: this.y
		})
	})
	.bind('EnterFrame', function(){
		var hitDetection = this.hit('Movable');
		if(hitDetection){
			if(this.isDown('RIGHT_ARROW'))
				hitDetection[0].obj.x += 4;
			else if(this.isDown('LEFT_ARROW'))
				hitDetection[0].obj.x -= 4;
		}
	});

dispatch.on('move', function(data) {
	player.x = data.x;
	player.y = data.y;
})