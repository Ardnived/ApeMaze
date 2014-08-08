function ElevatorTrap(id, x, oy, w, h, dy, dydt) {
	Trap.call(this, id, null, 9001);

	var trap = this

	this.box = Crafty.e("2D, Canvas, Color, Floor, Collision")
					.attr({x: x, y: oy, w: w, h: h})
					.color('#444444')
					.bind('EnterFrame', function(){
						if(player.is_controller){
							var old = {x:avatar.entity.x, y:avatar.entity.y}
							this.y += this.dydt
							
							//handle moving up
							hitDetection = this.hit('Player')
							if(hitDetection){
								hitDetection[0].obj.y = Math.min(this.y-hitDetection[0].obj.h, hitDetection[0].obj.y)
							}

							if(this.dydt > 0){ //handle moving down
								if(avatar.entity.x + avatar.entity.w/2 > this.x
									&& avatar.entity.x + avatar.entity.w/2 < this.x + this.w
									&& avatar.entity.y + avatar.entity.h < this.x
									&& avatar.entity.y + avatar.entity.h > this.x-10){

									avatar.entity.y += dydt
								}
							}

							//switch direction
							if(this.y < this.oy || this.y > this.oy+this.dy){
								this.dydt = -this.dydt
							}
							trap.action()
							avatar.on_moved(old)
						}
					})

	this.box.dy = dy
	this.box.oy = oy
	this.box.dydt = dydt

	this.box.visible = true
}

ElevatorTrap.prototype.action = function(){
	dispatch.emit('trap', {trap_id:this.trap_id, type:'elevatortrap', y:this.box.y})
}

ElevatorTrap.prototype.click = function() {
	// Do Nothing
};

ElevatorTrap.prototype.reset = function(){
	Trap.prototype.call.reset()

	this.box.y = this.box.oy
}

extend(Trap, ElevatorTrap);