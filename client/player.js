
var player = {
	speed: 7,
	velocity: { x: 0, y: 0 },
	sprite: {
		current: null,
		north: null,
		south: null,
		east: null,
		west: null
	},
	move: function(dir) {
		this.velocity = direction[dir];
		
		if (this.sprite.current != this.sprite[dir]) {
			this.sprite.current.remove(false);
			this.sprite[dir].x = this.sprite.current.x;
			this.sprite[dir].y = this.sprite.current.y;
			this.sprite.current = this.sprite[dir];
			this.sprite.current.add();
		}
		
		this.sprite.current.active = true;
	},
	stop: function() {
		this.velocity = direction.none;
		this.sprite.current.active = false;
	},
	update: function() {
		player.sprite.current.x += player.velocity.x * player.speed;
		player.sprite.current.y += player.velocity.y * player.speed;
	},
	init: function() {
		var data = {
			origin: { x: "center", y: "center" },
			generate: true,
			width: 32,
			height: 32,
			direction: "x",
			duration: canvas.framelength,
			autostart: true
		};
		
		data.image = "../resources/img/north.png";
		this.sprite.north = canvas.display.sprite(data);
		data.image = "../resources/img/south.png";
		this.sprite.south = canvas.display.sprite(data);
		data.image = "../resources/img/east.png";
		this.sprite.east = canvas.display.sprite(data);
		data.image = "../resources/img/west.png";
		this.sprite.west = canvas.display.sprite(data);
		
		this.sprite.south.x = 100;
		this.sprite.south.y = 100;
		this.sprite.current = this.sprite.south;
		this.sprite.current.add();
	}
};
