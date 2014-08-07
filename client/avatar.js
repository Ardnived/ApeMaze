
function init_avatar() {
	if (player.is_controller) {
		var avatar = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite, Twoway, Gravity, Collision')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3)
			.twoway(4, 10)
			.gravity('Floor')
			.gravityConst(0.4)
			.bind('NewDirection', function(event) {
				if (this.isDown('LEFT_ARROW')) {
					this.animate('West', -1);
					this.direction = 'West'
			    } else if (this.isDown('RIGHT_ARROW')) {
					this.animate('East', -1);
					this.direction = 'East'
			    } else if (this.isDown('UP_ARROW')) {
					this.animate('South', -1);
					this.direction = 'South'
				}
			})
			.bind('Moved', function(event) {
				if (player.is_controller) {
					dispatch.emit('move', {
						x: this.x,
						y: this.y
					});
				}
			})
			.bind('EnterFrame', function(){
				var hitDetection = this.hit('Movable');
				if(hitDetection){
					if(this.isDown('RIGHT_ARROW'))
						hitDetection[0].obj.x += 4;
					else if(this.isDown('LEFT_ARROW'))
						hitDetection[0].obj.x -= 4;
				}
				if(this.shieldUp){
					this.shieldSprite.x = this.x+this.w/2-this.shieldSprite.w/2
					this.shieldSprite.y = this.y+this.h/2-this.shieldSprite.h/2
				}else{
					this.shieldSprite.x = -100
					this.shieldSprite.y = -100
				}
			})
			.bind('KeyDown', function(e){
				if(e.key == Crafty.keys.DOWN_ARROW){
					if(this.direction == 'East'){
						this.x += 50
					}else if(this.direction == 'West'){
						this.x -= 50
					}
				}else if(e.key == Crafty.keys.BACKSPACE){
					this.shieldUp = !this.shieldUp
				}
			});
			avatar.direction = 'East'
			avatar.shieldUp = false
			avatar.shieldSprite = Crafty.e("2D, Canvas, CircleSprite")
				.attr({x: -100, y: -100, w: 80, h: 80})
	} else {
		var avatar = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3);

		dispatch.on('move', function(data) {
			avatar.x = data.x;
			avatar.y = data.y;
		});
	}
}
