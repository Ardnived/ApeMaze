function Avatar(player) {
	DASH_COOLDOWN = 2000
	SHIELD_DURATION = 2000
	SHIELD_COOLDOWN = 2000

	if (player.is_controller) {
		avatar = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite, Twoway, Gravity, Collision')
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
					// Get all intersections with objects marked as "deathzones"
					var hits = this.hit('Deathzone');

					if (hits) {
						// If we had any hits, loop through them, and make sure they are visible.
						for (var i = 0; i < hits.length; i++) {
							console.log("Hit", hits[i]);
							if (hits[i].obj.visible) {
								avatar.on_death();
								break;
							}
						}
					} else {
						dispatch.emit('move', {
							x: this.x,
							y: this.y
						});
					}
				}
			})
			.bind('EnterFrame', function(){
				//move colliding movable objects
				var hitDetection = this.hit('Movable');
				if (hitDetection){
					if(this.isDown('RIGHT_ARROW'))
						hitDetection[0].obj.x += 4;
					else if(this.isDown('LEFT_ARROW'))
						hitDetection[0].obj.x -= 4;
				}

				//dash cooldown
				if (this.dashCountdown) {
					var cooldown = (DASH_COOLDOWN - (new Date() - this.lastDash));
					if (cooldown <= 0){
						this.dashCountdown = false;
						dashText.text("DASH READY");
					} else {
						dashText.text("NEXT DASH: " + cooldown/1000);
					}
				}

				//shield countdown
				if (this.shieldCountdown) {
					if (this.shieldUp) {
						var countdown = (SHIELD_DURATION - (new Date() - this.lastShield));

						if (countdown <= 0) {
							shield.visible = false;
							this.shieldUp = false;
							this.lastShield = new Date();
						} else {
							shieldText.text("SHIELD: " + countdown/1000);
						}
					} else {
						var countdown = SHIELD_COOLDOWN - (new Date() - this.lastShield);
						if (countdown <= 0) {
							this.shieldCountdown = false;
							shieldText.text("SHIELD READY");
						} else {
							shieldText.text("NEXT SHIELD: " + countdown/1000);
						}
					}
				}
			})
			.bind('KeyDown', function(e){
				//dash
				if (e.key == Crafty.keys.Z && !this.dashCountdown) {
					if (this.direction == 'East') {
						this.x += 50;
					} else if (this.direction == 'West') {
						this.x -= 50;
					}

					this.lastDash = new Date();
					this.dashCountdown = true;
				//shield
				} else if (e.key == Crafty.keys.X && !this.shieldCountdown){
					this.shieldUp = !this.shieldUp;
					this.lastShield = new Date();
					this.shieldCountdown = true;
					shield.visible = true;
				}
			});

			avatar.direction = 'East';
			avatar.shieldUp = false;
			avatar.dashCountdown = false;
			avatar.lastDash = new Date();
			avatar.shieldCountdown = false;
			avatar.lastShield = new Date();

			shield.x = avatar.x - 15;
			shield.y = avatar.y - 15;
			avatar.attach(shield);

			avatar.on_death = function() {
				console.log("Player died");

				if (player.is_controller) {
					/*
					this.x = 0;
					this.y = 200;
					dispatch.emit('move', {
						x: 0,
						y: 200,
					});
					*/
					dispatch.emit('gameover', { controller_won: false });
				}
			};
	} else {
		this.avatar = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3);

		dispatch.on('move', function(data) {
			avatar.x = data.x;
			avatar.y = data.y;
		});

		dashText.visible = false;
		shieldText.visible = false;
	}

	this.shield = Crafty.e("2D, Canvas, CircleSprite")
	.attr({x: 0, y: 0, w: 80, h: 80});

	shield.visible = false;

	this.dashText = Crafty.e("2D, Canvas, Text")
		.attr({ x: 200, y: 100 })
		.text("DASH (Z) READY");

	this.shieldText = Crafty.e("2D, Canvas, Text")
		.attr({ x: 200, y: 130 })
		.text("SHIELD (X) READY");
}
