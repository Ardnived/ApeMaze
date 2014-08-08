function ClickableFallingPlatform(id, trigger, threshold, tile) {
	Trap.call(this, id, trigger, threshold);
	
	this.entity = tile;
	this.entity.addComponent("ClickableFallingPlatform");
	this.entity.visible = false;
}

ClickableFallingPlatform.prototype.activate = function(){
	Trap.prototype.activate.call(this);

	this.entity.visible = true;
	this.entity.addComponent("Platform");
	this.entity.addComponent("Floor");
	this.entity.addComponent("Gravity");
	this.gravity("Floor");
}

ClickableFallingPlatform.prototype.click = function() {
	Trap.prototype.click.call(this);

	if(!this.clicked) {
		this.clicked = true;
	
		var id = this.trap_id;
		var threshold = this.threshold;

		dispatch.emit('trap', {
			trap_id: id,
			threshold: threshold,
		});
	}
}

extend(Trap, ClickableFallingPlatform);