DASH_COOLDOWN = 2000
SHIELD_DURATION = 2000
SHIELD_COOLDOWN = 2000


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
					this.direction = 'West';
			    } else if (this.isDown('RIGHT_ARROW')) {
					this.animate('East', -1);
					this.direction = 'East';
			    } else if (this.isDown('UP_ARROW')) {
					this.animate('South', -1);
					this.direction = 'South';
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
				//move colliding movable objects
				var hitDetection = this.hit('Movable');
				if(hitDetection){
					if(this.isDown('RIGHT_ARROW'))
						hitDetection[0].obj.x += 4;
					else if(this.isDown('LEFT_ARROW'))
						hitDetection[0].obj.x -= 4;
				}
				//draw shield
				if(this.shieldUp){
					this.shieldSprite.x = this.x+this.w/2-this.shieldSprite.w/2;
					this.shieldSprite.y = this.y+this.h/2-this.shieldSprite.h/2;
				}else{
					this.shieldSprite.x = -100;
					this.shieldSprite.y = -100;
				}
				//dash cooldown
				if(this.dashCountdown){
					var cooldown = (DASH_COOLDOWN - (new Date() - this.lastDash));
					if(cooldown <= 0){
						this.dashCountdown = false;
						this.dashText.text("DASH READY");
					}else{
						this.dashText.text("NEXT DASH: " + cooldown/1000);
					}
				}
				//shield countdown
				if(this.shieldCountdown){
					if(this.shieldUp){
						var countdown = (SHIELD_DURATION - (new Date() - this.lastShield));
						if(countdown <= 0){
							this.shieldUp = false;
							this.lastShield = new Date();
						}else{
							this.shieldText.text("SHIELD: " + countdown/1000);
						}
					}else{
						var countdown = SHIELD_COOLDOWN - (new Date() - this.lastShield);
						if(countdown <= 0){
							this.shieldCountdown = false;
							this.shieldText.text("SHIELD READY");
						}else{
							this.shieldText.text("NEXT SHIELD: " + countdown/1000);
						}
					}
				}
			})
			.bind('KeyDown', function(e){
				//dash
				if(e.key == Crafty.keys.DOWN_ARROW && !this.dashCountdown){
					if(this.direction == 'East'){
						this.x += 50;
					}else if(this.direction == 'West'){
						this.x -= 50;
					}
					this.lastDash = new Date();
					this.dashCountdown = true;
				//shield
				}else if(e.key == Crafty.keys.SHIFT && !this.shieldCountdown){
					this.shieldUp = !this.shieldUp;
					this.lastShield = new Date();
					this.shieldCountdown = true;
				}
			});
			avatar.direction = 'East';
			avatar.shieldUp = false;
			avatar.shieldSprite = Crafty.e("2D, Canvas, CircleSprite")
				.attr({x: -100, y: -100, w: 80, h: 80});
			avatar.dashCountdown = false;
			avatar.lastDash = new Date();
			avatar.dashText = Crafty.e("2D, Canvas, Text").attr({ x: 200, y: 100 }).text("DASH READY");
			avatar.shieldCountdown = false;
			avatar.lastShield = new Date();
			avatar.shieldText = Crafty.e("2D, Canvas, Text").attr({ x: 200, y: 130 }).text("SHIELD READY");
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
