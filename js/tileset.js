define('tileset', function() {

    var TileSet = function(img, tilesize) {
        this.image = img;
        this.tilesize = tilesize;
        this.tiles_x = this.image.width / this.tilesize;
        this.tiles_y = this.image.height / this.tilesize;
    };

    return TileSet;
});
