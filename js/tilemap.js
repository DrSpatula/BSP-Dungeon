define('tilemap', ['map','util'], function(Map,U) {

    var TileMap = function(map_width_in_tiles, map_height_in_tiles, map_data) {
        this.plan = map_data || new Map();
        this.tiles_h = map_width_in_tiles;
        this.tiles_v = map_height_in_tiles;
        this.data = U.generateArray(map_height_in_tiles, map_width_in_tiles);

        this.plotRooms();
        //this.plotCorridors();
    };


    TileMap.prototype.mapCoordinates = function(input) {
        var output = {};
        output.x1 = Math.floor(input.x1 * this.tiles_h);
        output.x2 = Math.floor(input.x2 * this.tiles_h);
        output.y1 = Math.floor(input.y1 * this.tiles_v);
        output.y2 = Math.floor(input.y2 * this.tiles_v);

        return output;
    };


    TileMap.prototype.plotRooms = function() {
        var num = this.plan.rooms.length;
        for (var i = 0; i < num; i++) {
            var coords = this.mapCoordinates(this.plan.rooms[i]);

            for (var row = coords.y1; row <= coords.y2; row++) {
                if (row === coords.y1) {
                    this.data[row][coords.x1] = 1;
                    this.data[row][coords.x2] = 3;
                    for (col = coords.x1 + 1; col < coords.x2; col++) {
                        this.data[row][col] = 2;
                    }
                } else if (row === coords.y1 + 1) {
                    this.data[row][coords.x1] = 4;
                    this.data[row][coords.x2] = 6;
                    for (col = coords.x1 + 1; col < coords.x2; col++) {
                        this.data[row][col] = 5;
                    }
                } else if (row === coords.y2) {
                    this.data[row][coords.x1] = 10;
                    this.data[row][coords.x2] = 11;
                    for (col = coords.x1 + 1; col < coords.x2; col++) {
                        this.data[row][col] = 2;
                    }
                } else {
                    this.data[row][coords.x1] = 7;
                    this.data[row][coords.x2] = 9;
                    for (col = coords.x1 + 1; col < coords.x2; col++) {
                        this.data[row][col] = 8;
                    }
                }
            }            
        }
    };


    TileMap.prototype.plotCorridors = function() {
        var num = this.plan.corridors.length;
        for (var i = 0; i < num; i++) {
            var coords = this.mapCoordinates(this.plan.corridors[i]);

            this.data[coords.y1][coords.x1] = 0;
            this.data[coords.y2][coords.x2] = 0;

            if (coords.x1 === coords.x2) {
                for (var x = coords.x1 - 1; x <= coords.x1 + 1; x += 2) {
                    for (var y = coords.y1 + 1; y < coords.y2; y++) {
                        this.data[y][x] = 1;
                    }
                }
            } else if (coords.y1 === coords.y2) {
                for (var y = coords.y1 - 1; y <= coords.y1 + 1; y += 2) {
                    for (var x = coords.x1 + 1; x < coords.x2; x++) {
                        this.data[y][x] = 1;
                    }
                }
            }
        }
    };

    return TileMap;

});
