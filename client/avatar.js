
DASH_COOLDOWN = 2000
SHIELD_DURATION = 2000
SHIELD_COOLDOWN = 2000

var avatar = {
	init: function() {
		if (player.is_controller) {
			this.init_controller();
		} else {
			this.init_observer();
		}
	},
	init_controller: function() {
		this.entity = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite, Twoway, Gravity, Collision')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3)
			.twoway(4, 10)
			.gravity('Floor')
			.gravityConst(0.4)
			.bind('NewDirection', this.on_change_direction)
			.bind('Moved', this.on_moved)
			.bind('EnterFrame', this.on_enter_frame)
			.bind('KeyDown', this.on_key_down);

		this.direction = 'East';
		this.shieldUp = false;
		this.dashCountdown = false;
		this.lastDash = new Date();
		this.shieldCountdown = false;
		this.lastShield = new Date();

		this.shield = Crafty.e("2D, Canvas, CircleSprite")
			.attr({x: 0, y: 0, w: 80, h: 80});

		this.shield.visible = false;

		this.dashText = Crafty.e("2D, Canvas, Text")
			.attr({ x: 200, y: 100 })
			.text("DASH (C) READY");

		this.shieldText = Crafty.e("2D, Canvas, Text")
			.attr({ x: 200, y: 130 })
			.text("SHIELD (X) READY");

		this.shield.x = this.entity.x - 15;
		this.shield.y = this.entity.y - 15;
		this.entity.attach(this.shield);
	}, 
	init_observer: function() {
		this.entity = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3);

		dispatch.on('move', function(data) {
			avatar.entity.x = data.x;
			avatar.entity.y = data.y;
		});
	},
	on_enter_frame: function() {
		//move colliding movable objects
		var hitDetection = this.hit('Movable');
		if (hitDetection){
			if (this.isDown('RIGHT_ARROW'))
				hitDetection[0].obj.x += 4;
			else if (this.isDown('LEFT_ARROW'))
				hitDetection[0].obj.x -= 4;
		}

		//dash cooldown
		if (avatar.dashCountdown) {
			var cooldown = (DASH_COOLDOWN - (new Date() - avatar.lastDash));
			if (cooldown <= 0){
				avatar.dashCountdown = false;
				avatar.dashText.text("DASH READY");
			} else {
				avatar.dashText.text("NEXT DASH: " + cooldown/1000);
			}
		}

		//shield countdown
		if (avatar.shieldCountdown) {
			if (avatar.shieldUp) {
				var countdown = (SHIELD_DURATION - (new Date() - avatar.lastShield));

				if (countdown <= 0) {
					avatar.shield.visible = false;
					avatar.shieldUp = false;
					avatar.lastShield = new Date();
				} else {
					avatar.shieldText.text("SHIELD: " + countdown/1000);
				}
			} else {
				var countdown = SHIELD_COOLDOWN - (new Date() - avatar.lastShield);
				if (countdown <= 0) {
					avatar.shieldCountdown = false;
					avatar.shieldText.text("SHIELD READY");
				} else {
					avatar.shieldText.text("NEXT SHIELD: " + countdown/1000);
				}
			}
		}
	},
	on_change_direction: function(event) {
		if (this.isDown('LEFT_ARROW')) {
			this.animate('West', -1);
			avatar.direction = 'West';
	    } else if (this.isDown('RIGHT_ARROW')) {
			this.animate('East', -1);
			avatar.direction = 'East';
	    } else if (this.isDown('UP_ARROW')) {
			this.animate('South', -1);
			avatar.direction = 'South';
		}
	},
	on_moved: function(event) {
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
	},
	on_key_down: function(e) {
		//dash
		if (e.key == Crafty.keys.C && !this.dashCountdown) {
			if (avatar.direction == 'East') {
				this.x += 50;
			} else if (avatar.direction == 'West') {
				this.x -= 50;
			} else {
				debug.error("No direction set");
			}

			avatar.lastDash = new Date();
			avatar.dashCountdown = true;
		//shield
		} else if (e.key == Crafty.keys.X && !avatar.shieldCountdown){
			avatar.shieldUp = !avatar.shieldUp;
			avatar.lastShield = new Date();
			avatar.shieldCountdown = true;
			avatar.shield.visible = true;
		}
	},
	on_death: function() {
		console.log("Player died");
		dispatch.emit('gameover', { controller_won: false });
	}
};
