
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

		this.shieldUp = false;
		this.dashCountdown = false;
		this.lastDash = 0;
		this.shieldCountdown = false;
		this.lastShield = 0;

		this.shield = Crafty.e("2D, Canvas, CircleSprite")
			.attr({x: this.entity.x - 15, y: this.entity.y - 15, w: 80, h: 80});

		this.shield.visible = false;
		this.entity.attach(this.shield);
	},
	init_controller: function() {
		this.entity = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite, Twoway, Gravity, Collision')
			.attr({x: 0, y: 0, w: 25, h: 25})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3)
			.twoway(4, 8.5)
			.gravity('Floor')
			.gravityConst(0.4)
			.bind('NewDirection', this.on_change_direction)
			.bind('Moved', this.on_moved)
			.bind('EnterFrame', this.update_dash)
			.bind('EnterFrame', this.update_shield)
			.bind('KeyDown', this.on_key_down)
			.bind('KeyUp', this.on_key_up);

		this.direction = 'East';
		document.getElementById('dashText').style.display = ''
		document.getElementById('shieldText').style.display = ''
		document.getElementById('observerHint').style.display = 'none'

		Crafty.viewport.follow(this.entity, 0, 0);
	}, 
	init_observer: function() {
		this.entity = Crafty.e('2D, Canvas, SpriteAnimation, SouthSprite')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('South', 700, 0, 0, 3)
			.reel('West', 700, 0, 1, 3)
			.reel('East', 700, 0, 2, 3)
			.reel('North', 700, 0, 3, 3)
			.bind('EnterFrame', this.update_shield)
			.bind('KeyDown', function(e) {
				if (e.key == Crafty.keys.SPACE) {
					Crafty.viewport.follow(avatar.entity, 0, 0);
				}
			});

		dispatch.on('move', function(data) {
			avatar.entity.x = data.x;
			avatar.entity.y = data.y;
			avatar.on_receive_direction(data.direction)
		});

		dispatch.on('shield', avatar.use_shield);

		dispatch.on('stop', function(data){
			avatar.entity.pauseAnimation();
			console.log('stop')
		})

		document.getElementById('dashText').style.display = 'none'
		document.getElementById('shieldText').style.display = 'none'
		document.getElementById('observerHint').style.display = ''
		Crafty.viewport.mouselook(true);
	},
	/*
	update: function() {
		//move colliding movable objects
		var hitDetection = this.hit('Movable');
		if (hitDetection){
			if (this.isDown('RIGHT_ARROW'))
				hitDetection[0].obj.x += 4;
			else if (this.isDown('LEFT_ARROW'))
				hitDetection[0].obj.x -= 4;
	},
	*/
	use_dash: function() {
		debug.game("Activate Dash");
		if (avatar.direction == 'East') {
			avatar.entity.x += 50;
		} else if (avatar.direction == 'West') {
			avatar.entity.x -= 50;
		} else {
			avatar.entity.y -= 100;
			debug.warn("Default to dash up.");
		}

		avatar.lastDash = new Date();
		avatar.dashCountdown = true;

		avatar.on_moved();
	},
	update_dash: function() {
		if (avatar.dashCountdown) {
			var cooldown = (DASH_COOLDOWN - (new Date() - avatar.lastDash));
			if (cooldown <= 0){
				avatar.dashCountdown = false;
				document.getElementById('dashText').innerHTML = ("DASH READY");
			} else {
				document.getElementById('dashText').innerHTML = ("NEXT DASH: " + cooldown/1000);
			}
		}
	},
	use_shield: function() {
		debug.game("Activate Shield");
		avatar.shieldUp = true;
		avatar.lastShield = new Date();
		avatar.shieldCountdown = true;
		avatar.shield.visible = true;

		dispatch.emit('shield');
	},
	update_shield: function() {
		if (avatar.shieldCountdown) {
			if (avatar.shieldUp) {
				var countdown = (SHIELD_DURATION - (new Date() - avatar.lastShield));

				if (countdown <= 0) {
					avatar.shield.visible = false;
					avatar.shieldUp = false;
					avatar.lastShield = new Date();
				} else {
					document.getElementById('shieldText').innerHTML = ("SHIELD: " + countdown/1000);
				}
			} else {
				var countdown = SHIELD_COOLDOWN - (new Date() - avatar.lastShield);
				if (countdown <= 0) {
					avatar.shieldCountdown = false;
					document.getElementById('shieldText').innerHTML = ("SHIELD READY");
				} else {
					document.getElementById('shieldText').innerHTML = ("NEXT SHIELD: " + countdown/1000);
				}
			}
		}
	},
	check_deathzones: function() {
		if (avatar.shieldUp) {
			// We are shielded and can't be hurt.
			return false;
		}

		// Get all intersections with objects marked as "deathzones"
		var hits = avatar.entity.hit('Deathzone');

		if (hits) {
			// If we had any hits, loop through them, and make sure they are visible.
			for (var i = 0; i < hits.length; i++) {
				console.log("Hit", hits[i]);
				if (hits[i].obj.visible) {
					avatar.on_death();
					return true;
				}
			}
		} else {
			return false;
		}
	},
	check_mapborders: function() {
		if (avatar.entity.x < 0 || avatar.entity.y < 0
			 || avatar.entity.x > SOURCE_FROM_TILED_MAP_EDITOR.width * SOURCE_FROM_TILED_MAP_EDITOR.tilewidth
			 || avatar.entity.y > SOURCE_FROM_TILED_MAP_EDITOR.height * SOURCE_FROM_TILED_MAP_EDITOR.tileheight) {
			
			avatar.on_death();
			return true;
		}

		return false;
	},
	on_change_direction: function(event) {
		if (this.isDown('LEFT_ARROW')) {
			avatar.direction = 'West';
	    } else if (this.isDown('RIGHT_ARROW')) {
			avatar.direction = 'East';
	    } else if (this.isDown('UP_ARROW')) {	
			avatar.direction = 'South';
		}
		this.animate(avatar.direction, -1);
	},
	on_receive_direction: function(direction){
		if(direction != avatar.direction){
			avatar.direction = direction;
			avatar.entity.animate(avatar.direction, -1);
		}
	},
	on_moved: function(old) {
		// Get all intersections with objects marked as "deathzones"
		var killed = false;
		killed != avatar.check_deathzones();
		killed != avatar.check_mapborders();

		var hitInfo = this.hit("Platform");
        if(hitInfo) {
        	for(var i = 0; i < hitInfo.length; ++i) {
        		var hitObj = hitInfo[i].obj;
        		if(hitObj.x < avatar.entity.x + avatar.entity.w) {
        			// Left side
        			avatar.entity.x = old.x;
        		} else if(hitObj.x + hitObj.w > avatar.entity.x) {
        			// Right side
					avatar.entity.x = old.x;
        		} else if(hitObj.y + hitObj.h < avatar.entity.y) {
        			// Bottom
        			console.log("collide");
        			avatar.entity.y = old.y;
        		}
        	}

            // when hit from left, bottom or right side
            avatar.entity.x -= avatar.entity._movement.x;
            avatar.entity._up = false;
        }

		if (!killed) {
			dispatch.emit('move', {
				x: avatar.entity.x,
				y: avatar.entity.y,
				direction: avatar.direction,
			});
		}
	},
	on_key_down: function(e) {
		//dash
		if (e.key == Crafty.keys.C && !avatar.dashCountdown) {
			avatar.use_dash();
		//shield
		} else if (e.key == Crafty.keys.X && !avatar.shieldCountdown){
			avatar.use_shield();
		}
	},
	on_key_up: function(e){
		if(!this.isDown(Crafty.keys.LEFT_ARROW) && !this.isDown(Crafty.keys.RIGHT_ARROW)){
			dispatch.emit('stop', {});
			avatar.entity.pauseAnimation();
		}
	},
	on_death: function() {
		console.log("Player died");
		dispatch.emit('gameover', { controller_won: false });
	}
};
