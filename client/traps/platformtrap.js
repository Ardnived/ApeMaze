function PlatformTrap(id, ox, oy, w, h, dx, dy) {
	Trap.call(this, id, null, 9001);

	var trap = this

	this.box = Crafty.e("2D, Canvas, Color, Deathzone, Draggable")
					.attr({x: ox, y: oy, w: w, h: h})
					.color('#FF0000')
					.bind('Dragging', function(e){
						this.x = Math.min(Math.max(this.ox-this.dx, this.x), this.ox+this.dx)
						this.y = Math.min(Math.max(this.oy-this.dy, this.y), this.oy+this.dy)

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
	this.box.dy = dy

	this.box.visible = true
}

PlatformTrap.prototype.action = function(){
	dispatch.emit('trap', {trap_id:this.trap_id, type:'platform', x:this.box.x, y:this.box.y})
}

extend(Trap, FireTrap);