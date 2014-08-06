
function avatar() {
	this.speed = 7;
	this.direction = direction.none;
	this.parent = board.display;
	
	var sprite_data = {
		origin: { x: "center", y: "center" },
		generate: true,
		width: 32,
		height: 32,
		direction: "x",
		duration: canvas.framelength,
		autostart: true
	};
	
	this.sprite = {};
	
	sprite_data.image = "../resources/img/north.png";
	this.sprite.north = canvas.display.sprite(sprite_data);
	sprite_data.image = "../resources/img/south.png";
	this.sprite.south = canvas.display.sprite(sprite_data);
	sprite_data.image = "../resources/img/east.png";
	this.sprite.east = canvas.display.sprite(sprite_data);
	sprite_data.image = "../resources/img/west.png";
	this.sprite.west = canvas.display.sprite(sprite_data);
	
	this.sprite.south.x = canvas.width / 2;
	this.sprite.south.y = canvas.height / 2;
	this.sprite.current = this.sprite.south;
	this.sprite.current.active = false;
	this.sprite.current.add();
}

avatar.prototype.move = function(dir) {
	this.direction = direction[dir];
	
	if (this.sprite.current != this.sprite[dir]) {
		this.parent.removeChild(this.sprite.current, false);
		this.sprite[dir].x = this.sprite.current.x;
		this.sprite[dir].y = this.sprite.current.y;
		this.sprite.current = this.sprite[dir];
		this.parent.addChild(this.sprite.current);
	}
	
	this.sprite.current.active = true;
};

avatar.prototype.stop = function() {
	this.direction = direction.none;
	this.sprite.current.active = false;
};

avatar.prototype.update = function() {
	this.sprite.current.x += this.direction.x * this.speed;
	this.sprite.current.y += this.direction.y * this.speed;
};
