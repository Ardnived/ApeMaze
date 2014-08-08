function BearTrap(id, ox, oy, w, h, dx) {
	Trap.call(this, id, null, 9001);

	var trap = this

	this.box = Crafty.e("2D, Canvas, Color, Draggable, Collision, Deathzone")
					.attr({x: ox, y: oy, w: w, h: h})
					.color('#FF0000')
					.bind('Dragging', function(e){
						this.x = Math.min(Math.max(this.ox-this.dx, this.x), this.ox+this.dx)
						this.y = this.oy

						trap.action()
					})
	if(player.is_controller){
		this.box.disableDrag()
	}else{
		this.box.enableDrag()
	}
	this.box.ox = ox
	this.box.oy = oy
	this.box.dx = dx

	this.box.visible = true
}

BearTrap.prototype.action = function(){
	dispatch.emit('trap', {trap_id:this.trap_id, type:'beartrap', x:this.box.x})
}

BearTrap.prototype.click = function() {
	// Do Nothing
};

BearTrap.prototype.reset = function(){
	Trap.prototype.call.reset()

	this.box.x = this.box.ox
	if(player.is_controller){
		this.box.disableDrag()
	}else{
		this.box.enableDrag()
	}
}

extend(Trap, BearTrap);