
var AVATAR = {
	gravity: 0.4,
	speed: 4,
	jump: 9,
	color: "#FFFFFF",
	intensity: 0.0
};

var DASH = {
	cooldown: 2000
};

var SHIELD = {
	cooldown: 2000,
	duration: 2000
}

var FROZEN = {
	duration: 5000,
	color: "#00FFFF",
	intensity: 0.5,
	gravity: 1.0
};

var BURNING = {
	duration: 5000,
	color: "#CF5300",
	intensity: 0.5
};

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

		this.frozen = false;
		this.burning = false;
		
		Crafty.viewport.follow(this.entity, 0, 0);
	},
	init_controller: function() {
		this.entity = Crafty.e('2D, Canvas, Tint, SpriteAnimation, StandSprite, Twoway, Gravity, Collision, Player')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('Walk', 200, 0, 0, 2)
			.reel('Stand', 200, 2, 0, 2)
			.reel('Jump', 160, 3, 0, 2)
			.twoway(AVATAR.speed, AVATAR.jump)
			.gravity('Floor')
			.gravityConst(AVATAR.gravity)
			.bind('NewDirection', this.on_change_direction)
			.bind('Moved', this.on_moved)
			.bind('EnterFrame', this.update_dash)
			.bind('EnterFrame', this.update_shield)
			.bind('EnterFrame', this.update_frozen)
			.bind('EnterFrame', this.update_burning)
			.bind('KeyDown', this.on_key_down)
			.bind('KeyUp', this.on_key_up);

		this.direction = 'East';
		document.getElementById('dashText').style.display = ''
		document.getElementById('shieldText').style.display = ''
		document.getElementById('observerHint').style.display = 'none'
	}, 
	init_observer: function() {
		this.entity = Crafty.e('2D, Canvas, Tint, SpriteAnimation, StandSprite, Player')
			.attr({x: 0, y: 0, w: 50, h: 50})
			.reel('Walk', 200, 0, 0, 2)
			.reel('Stand', 200, 2, 0, 2)
			.reel('Jump', 160, 3, 0, 2)
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
		Crafty.audio.play('dash')
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
			var cooldown = (DASH.cooldown - (new Date() - avatar.lastDash));
			if (cooldown <= 0){
				avatar.dashCountdown = false;
				document.getElementById('dashText').innerHTML = ("DASH READY");
			} else {
				document.getElementById('dashText').innerHTML = ("NEXT DASH: " + cooldown/1000);
			}
		}
	},
	use_shield: function() {
		Crafty.audio.play('shield')
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
				var countdown = (SHIELD.duration - (new Date() - avatar.lastShield));

				if (countdown <= 0) {
					avatar.shield.visible = false;
					avatar.shieldUp = false;
					avatar.lastShield = new Date();
				} else {
					document.getElementById('shieldText').innerHTML = ("SHIELD: " + countdown/1000);
				}
			} else {
				var countdown = SHIELD.cooldown - (new Date() - avatar.lastShield);
				if (countdown <= 0) {
					avatar.shieldCountdown = false;
					document.getElementById('shieldText').innerHTML = ("SHIELD READY");
				} else {
					document.getElementById('shieldText').innerHTML = ("NEXT SHIELD: " + countdown/1000);
				}
			}
		}
	},
	set_frozen: function(active) {
		if (active == avatar.frozen) {
			return;
		}
		
		debug.game("Frozen", active);
		avatar.frozen = active;

		if (avatar.frozen) {
			avatar.set_burning(false);
			avatar.frozenStart = new Date();
			avatar.entity.tint(FROZEN.color, FROZEN.intensity);
			avatar.entity.gravityConst(FROZEN.gravity);
		} else {
			avatar.entity.tint(AVATAR.color, AVATAR.intensity);
			avatar.entity.gravityConst(AVATAR.gravity);
		}
	},
	update_frozen: function() {
		if (avatar.frozen) {
			debug.game("Update Frozen");
			var countdown = (FROZEN.duration - (new Date() - avatar.frozenStart));

			if (countdown <= 0) {
				avatar.set_frozen(false);
			} else {
				avatar.entity.x += 2;
				avatar.on_moved();
			}
		}
	},
	set_burning: function(active) {
		if (active == avatar.burning) {
			return;
		}
		
		debug.game("Burning", active);
		avatar.burning = active;

		if (avatar.burning) {
			avatar.set_frozen(false);
			avatar.burningStart = new Date();
			avatar.entity.tint(BURNING.color, BURNING.intensity);
		} else {
			avatar.entity.tint(AVATAR.color, AVATAR.intensity);
		}
	},
	update_burning: function() {
		if (avatar.burning) {
			debug.game("Update Burning");
			var countdown = (BURNING.duration - (new Date() - avatar.burningStart));

			if (countdown <= 0) {
				avatar.set_burning(false);
			} else {
				if (countdown % 1000) {
					Crafty.trigger('KeyDown', {
						key: Crafty.keys.W
					});
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
				//console.log("Hit", hits[i]);
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
		if (avatar.entity.x < 0 || avatar.entity.y < 0  || avatar.entity.x > board.pixelwidth  || avatar.entity.y > board.pixelheight) {
			avatar.on_death();
			return true;
		}

		return false;
	},
	on_change_direction: function(event) {
		if (this.isDown('LEFT_ARROW')) {
			avatar.on_receive_direction('West');
	    } else if (this.isDown('RIGHT_ARROW')) {
			avatar.on_receive_direction('East');
	    } else if (this.isDown('UP_ARROW')) {	
			avatar.on_receive_direction('Up');
		}
	},
	on_receive_direction: function(direction){
		avatar.direction = direction;

		switch (avatar.direction) {
			case 'West':
				avatar.entity.flip("X");
				avatar.entity.animate("Walk", -1);
				break;
			case 'East':
				avatar.entity.unflip("X");
				avatar.entity.animate("Walk", -1);
				break;
		}
	},
	on_moved: function(old) {
		// Get all intersections with objects marked as "deathzones"
		var killed = false;
		killed != avatar.check_deathzones();
		killed != avatar.check_mapborders();

		var hitInfo = avatar.entity.hit("Platform");
        if(hitInfo) {
        	
        	top_collision = false;

        	for(var i = 0; i < hitInfo.length; ++i) {
        		var hitObj = hitInfo[i].obj;
        		
        		if(hitObj.y + hitObj.h > avatar.entity.y
        			&& hitObj.x < avatar.entity.x + 0.8*avatar.entity.w
        			&& hitObj.x + hitObj.w > avatar.entity.x + 0.2*avatar.entity.w
        			&& avatar.entity.y > hitObj.y + 0.8*hitObj.h) {
        			top_collision = true;
        		}
        	}
            // when hit from left, bottom or right side
            avatar.entity.x -= avatar.entity._movement.x;
            //avatar.entity.y += avatar.entity._movement.y;
            
            if(top_collision){
            	avatar.entity._up = false;
            	avatar.entity.y += 2;
            }
        }

		if (!killed) {
			dispatch.emit('move', {
				x: avatar.entity.x,
				y: avatar.entity.y,
				direction: avatar.direction,
			});
		}

		if (old.y == avatar.entity.y && avatar.falling) {
			avatar.falling = false;
			avatar.entity.animate('Stand', -1);
		}
	},
	on_key_down: function(e) {
		if (e.key == Crafty.keys.C && !avatar.dashCountdown) {
			//dash
			avatar.use_dash();
		} else if (e.key == Crafty.keys.X && !avatar.shieldCountdown){
			//shield
			avatar.use_shield();
		} else if (!this.isDown(Crafty.keys.LEFT_ARROW) && !this.isDown(Crafty.keys.RIGHT_ARROW)) {
			avatar.entity.animate('Jump', -1);
			//avatar.entity.pauseAnimation(); // What does this even do?
		}
	},
	on_key_up: function(e){
		if(!this.isDown(Crafty.keys.LEFT_ARROW) && !this.isDown(Crafty.keys.RIGHT_ARROW)){
			dispatch.emit('stop', {});
			//avatar.entity.pauseAnimation();
			avatar.entity.animate('Stand', -1);
		}
	},
	on_death: function() {
		if (!avatar.dead) {
			console.log("Player died");
			avatar.dead = true;
			dispatch.emit('gameover', { controller_won: false });
		}
	}
};
