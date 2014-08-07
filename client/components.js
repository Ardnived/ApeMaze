Crafty.c("Barrier", {
        west: null,
        east: null,
        north: null,
        south: null,
        obj: null,
        init: function() {
            if(!this.has("2D")) this.addComponent("2D");
            var x = this.x;
            var y = this.y;
            var w = SOURCE_FROM_TILED_MAP_EDITOR.tilewidth;
            var h = SOURCE_FROM_TILED_MAP_EDITOR.tileheight;

            this.obj = avatar;
            var self = this;
            
            this.west = Crafty.e("2D, Solid").attr({x: x, y: y, w: 1, h:h});
            
            this.east = Crafty.e("2D, Solid").attr({x: x + w - 1, y: y, w: 1, h:h});
            
            this.north = Crafty.e("2D, Solid").attr({x: x, y: y, w: w, h:1});

            this.south = Crafty.e("2D, Solid").attr({x: x, y: y + h - 1, w: w, h: 1});

            return this;
        },
        
        collide: function(dir) {
            this.obj.move(dir, this.obj._speed);
        }
    }
);