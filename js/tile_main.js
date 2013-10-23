require(['tilemap','tileset','tile_renderer'], function(TileMap, TileSet, TileRenderer) {

    var img = new Image();
    img.onload = function() {
        var c = document.getElementById('tile-canvas'),
            m = new TileMap(80,80),
            t = new TileSet(img, 16),
            r = new TileRenderer(c,m,t);
        
        r.render();
    };
    
    img.src = "img/CinderBlockWall_16.png";

});

