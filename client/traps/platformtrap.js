function PlatformTrap(id, ox, oy, w, h, dx, dy) {
	Trap.call(this, id, null, 9001);

	var trap = this

	this.box = Crafty.e("2D, Canvas, Color, Floor, Draggable, Collision")
					.attr({x: ox, y: oy, w: w, h: h})
					.color('#44FF44')
					.bind('Dragging', function(e){
						this.x = Math.min(Math.max(this.ox-this.dx, this.x), this.ox+this.dx)
						this.y = Math.min(Math.max(this.oy-this.dy, this.y), this.oy+this.dy)

						trap.action()
					})
	this.box.type = 'platformtrap'
	
	if(player.is_controller){
		this.box.disableDrag()
	}else{
		this.box.enableDrag()
	}
	this.box.ox = ox
	this.box.oy = oy
	this.box.dx = dx
	this.box.dy = dy

	this.box.visible = true
}

PlatformTrap.prototype.action = function(){
	dispatch.emit('trap', {trap_id:this.trap_id, type:'platformtrap', x:this.box.x, y:this.box.y})
}

PlatformTrap.prototype.click = function() {
	// Do Nothing
};

PlatformTrap.prototype.reset = function(){
	Trap.prototype.call.reset()

	this.box.x = this.box.ox
	this.box.y = this.box.oy
	if(player.is_controller){
		this.box.disableDrag()
	}else{
		this.box.enableDrag()
	}
}

extend(Trap, PlatformTrap);