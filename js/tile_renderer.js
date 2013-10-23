define('tile_renderer', ['tilemap'], function(TileMap) {

    var TileRenderer = function(canvas, tilemap, tileset) {
        this.map = tilemap;
        this.tiles = tileset;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.viewport = {
            width: Math.ceil(this.canvas.width / this.tiles.tilesize),
            height: Math.ceil(this.canvas.height / this.tiles.tilesize),
            x: 0,
            y: 0
        };
    }

    TileRenderer.prototype.render = function() {
        var map = this.map.data,
            start_col = this.viewport.x,
            end_col = start_col + this.viewport.width,
            start_row = this.viewport.y,
            end_row = start_row + this.viewport.height;

        for (var y = start_row; y <= end_row; y++) {
            for (var x = start_col; x <= end_col; x++) {
                var tile = map[y][x];
                if (tile > 0) {
                    this.drawTile(tile, x, y);
                }
            }
        }
    };

    TileRenderer.prototype.drawTile = function(tile, x, y) {
        var source_x = (tile % this.tiles.tiles_x) * this.tiles.tilesize,
            source_y = Math.floor(tile / this.tiles.tiles_x) * this.tiles.tilesize;

        this.ctx.drawImage(this.tiles.image,
                           source_x,
                           source_y,
                           this.tiles.tilesize,
                           this.tiles.tilesize,
                           x * this.tiles.tilesize,
                           y * this.tiles.tilesize,
                           this.tiles.tilesize,
                           this.tiles.tilesize);
    };

    return TileRenderer;

});
