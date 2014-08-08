
var AVATAR = {
	gravity: 0.4,
	speed: 5,
	jump: 12,
	color: "#FFFFFF",
	intensity: 0.0,
	offset: -150,
	startX: 70,
	startY: 64 * 10
};

var DASH = {
	cooldown: 2000,
	distance: 100,
	energy: 1,
	key: Crafty.keys.C
};

var SHIELD = {
	cooldown: 2000,
	duration: 2000,
	energy: 1,
	key: Crafty.keys.X
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

var ENERGY = {
	distance: 1000,
	max: 2
}

var avatar = {
	init: function() {
		if (player.is_controller) {
			this.init_controller();
		} else {
			this.init_observer();
		}

		this.entity
			.attr({x: AVATAR.startX, y: AVATAR.startY, w: 50, h: 50, z:1000})
			.reel('Walk', 200, 0, 0, 2)
			.reel('Stand', 200, 2, 0, 2)
			.reel('Jump', 160, 3, 0, 2)
			.bind('EnterFrame', this.update_shield);

		this.shieldUp = false;
		this.dashCountdown = false;
		this.lastDash = 0;
		this.shieldCountdown = false;
		this.lastShield = 0;
		this.energy = 0
		avatar.update_energy();
		this.furthest = { x:0, y:0 };

		this.shield = Crafty.e("2D, Canvas, CircleSprite, Persist")
			.attr({x: this.entity.x - 15, y: this.entity.y - 15, w: 80, h: 80});

		this.shield.visible = false;
		this.entity.attach(this.shield);

		this.dash = Crafty.e("2D, Canvas, DashSprite, SpriteAnimation, Persist")
			.attr({w: 150, h: 50})
			.reel("Animate", 100, 0, 0, 3);

		this.dash.visible = false;

		this.frozen = false;
		this.burning = false;
		this.dead = false;

		this.entity.animate('Stand', -1)
		
		Crafty.viewport.follow(this.entity, AVATAR.offset, 0);
	},
	init_controller: function() {
		this.entity = Crafty.e('2D, Canvas, Tint, SpriteAnimation, StandSprite, Twoway, Gravity, Collision, Persist, Player')
			.twoway(AVATAR.speed, AVATAR.jump)
			.gravity('Floor')
			.gravityConst(AVATAR.gravity)
			.bind('NewDirection', this.on_change_direction)
			.bind('Moved', this.on_moved)
			.bind('EnterFrame', this.update_dash)
			.bind('EnterFrame', this.update_frozen)
			.bind('EnterFrame', this.update_burning)
			.bind('KeyDown', this.on_key_down)
			.bind('KeyUp', this.on_key_up);

		this.direction = 'East';
		document.getElementById('dashText').style.display = ''
		document.getElementById('shieldText').style.display = ''
		document.getElementById('observerHint').style.display = 'none'
		Crafty.viewport.mouselook(false);
	}, 
	init_observer: function() {
		this.entity = Crafty.e('2D, Canvas, Tint, SpriteAnimation, StandSprite, Persist, Player')
			.bind('KeyDown', function(e) {
				if (e.key == Crafty.keys.SPACE) {
					Crafty.viewport.follow(avatar.entity, AVATAR.offset, 0);
				}
			});

		dispatch.on('move', function(data) {
			avatar.entity.x = data.x;
			avatar.entity.y = data.y;

			if(data.direction=="West")
				avatar.entity.flip("X");
			else
				avatar.entity.unflip("X");
			//avatar.on_receive_direction(data.direction);
			//avatar.entity.animate(data.animation, -1);
		});

		dispatch.on('shield', avatar.use_shield);

		dispatch.on('stop', function(data) {
			console.log('stop');
			avatar.entity.animate("Stand", -1);
		})

		dispatch.on('animation', function(data) {
			avatar.entity.animate(data, -1);
			console.log('animation')
		})

		document.getElementById('dashText').style.display = 'none'
		document.getElementById('shieldText').style.display = 'none'
		document.getElementById('observerHint').style.display = ''
		Crafty.viewport.mouselook(true);
	},
	/*
	update_movables: function() {
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
		if(avatar.energy < DASH.energy){
			return;
		}

		var animate = false;
		avatar.energy -= DASH.energy;
		avatar.update_energy();

		Crafty.audio.play('dash')
		debug.game("Activate Dash");

		if (avatar.direction == 'East') {
			animate = true;
			avatar.dash.attr({ x: avatar.entity.x, y: avatar.entity.y });
			avatar.dash.unflip("X");

			avatar.entity.x += DASH.distance;
		} else if (avatar.direction == 'West') {
			animate = true;
			avatar.dash.attr({ x: avatar.entity.x - DASH.distance, y: avatar.entity.y });
			avatar.dash.flip("X");

			avatar.entity.x -= DASH.distance;
		} else {
			avatar.entity.y -= DASH.distance * 2;
			debug.warn("Default to dash up.");
		}


		avatar.lastDash = new Date();
		avatar.dashCountdown = true;

		avatar.on_moved();

		if (animate) {
			avatar.dash.animate("Animate", -1);
			avatar.dash.visible = true;

			avatar.entity.timeout(function() {
				avatar.dash.visible = false;
			}, 100);
		}
	},
	update_dash: function() {
		if (avatar.dashCountdown) {
			var cooldown = (DASH.cooldown - (new Date() - avatar.lastDash));
			if (cooldown <= 0){
				avatar.dashCountdown = false;
				document.getElementById('dashText').innerHTML = ("DASH (C) READY");
			} else {
				document.getElementById('dashText').innerHTML = ("NEXT DASH: " + cooldown/1000);
			}
		}
	},
	use_shield: function() {
		if(avatar.energy < SHIELD.energy){
			return;
		}

		avatar.energy -= SHIELD.energy
		avatar.update_energy();

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
					document.getElementById('shieldText').innerHTML = ("SHIELD (X) READY");
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
					avatar.on_death(hits[i].obj.type);
					return true;
				}
			}
			return false
		} else {
			return false;
		}
	},
	check_mapborders: function() {
		if (avatar.entity.x < 0) {
			avatar.entity.x = 0;
		} else if (avatar.entity.y > board.pixelheight) {
			avatar.on_death();
		} else if (avatar.entity.x > board.pixelwidth - avatar.entity.w) {
			board.load(board.current_stage + 1);
		} else {
			return false;
		}

		return true;
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
				dispatch.emit('animation', 'Walk');
				break;
			case 'East':
				avatar.entity.unflip("X");
				avatar.entity.animate("Walk", -1);
				dispatch.emit('animation', 'Walk');
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
				animation: avatar.entity.getReel().id
			});
		}

		// Land
		if (hitInfo && avatar.falling && !top_collision) {
			avatar.falling = false;
			if(avatar.moving) {
				avatar.entity.animate('Walk', -1);
			} else {
				avatar.entity.animate('Stand', -1);
				dispatch.emit('animation', 'Stand');
			}
		}

		//energy
		if (avatar.entity.x > avatar.furthest.x || avatar.entity.y > avatar.furthest.y) {
			if (avatar.entity.x > avatar.furthest.x) {
				avatar.energy += avatar.entity.x/ENERGY.distance - avatar.furthest.x/ENERGY.distance;
				avatar.furthest.x = avatar.entity.x;
			}
			if (avatar.entity.y > avatar.furthest.y) {
				avatar.energy += avatar.entity.y/ENERGY.distance - avatar.furthest.y/ENERGY.distance;
				avatar.furthest.y = avatar.entity.y;
			}

			avatar.energy = Math.min(avatar.energy, ENERGY.max)
			avatar.update_energy();
		}
	},
	on_key_down: function(e) {
		if(this.isDown(Crafty.keys.LEFT_ARROW) || this.isDown(Crafty.keys.RIGHT_ARROW)) {
			avatar.moving = true;
		}

		if (e.key == DASH.key && !avatar.dashCountdown) {
			//dash
			avatar.use_dash();
		} else if (e.key == SHIELD.key && !avatar.shieldCountdown){
			//shield
			avatar.use_shield();
		} else if(this.isDown(Crafty.keys.UP_ARROW)) {
			avatar.falling = true;
			avatar.entity.animate('Jump', -1);
			dispatch.emit('animation', 'Jump');
		} else if (!this.isDown(Crafty.keys.LEFT_ARROW) && !this.isDown(Crafty.keys.RIGHT_ARROW)) {
			//avatar.entity.animate('Jump', -1);
			avatar.entity.animate('Stand', -1);
			dispatch.emit('animation', 'Stand');
			avatar.moving = false;
			//avatar.entity.pauseAnimation(); // What does this even do?
		}
	},
	on_key_up: function(e){
		if(!this.isDown(Crafty.keys.LEFT_ARROW) && !this.isDown(Crafty.keys.RIGHT_ARROW)){
			dispatch.emit('stop', {});
			//avatar.entity.pauseAnimation();
			avatar.entity.animate('Stand', -1);
			dispatch.emit('animation', 'Stand');
			avatar.moving = false;
		}
	},
	on_death: function(trapname) {
		if (!avatar.dead) {
			debug.game("Player died");
			avatar.dead = true;
			dispatch.emit('gameover', { controller_won: false, cause: trapname });
		}
	},
	on_win: function() {
		if (!avatar.dead) {
			debug.game("Player won");
			avatar.dead = true;
			dispatch.emit('gameover', { controller_won: true, cause: null});
		}
	},
	update_energy: function(){
		document.getElementById('energy').innerHTML = toFixed(avatar.energy, 2);
	}
};
