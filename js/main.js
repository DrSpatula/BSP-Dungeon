require(['map','renderer'], function(Map, Renderer) {

    var c = document.getElementById('bsp-canvas'),
        m = new Map(),
        r = new Renderer(c,m);
    //r.renderPartitions();
    r.renderRooms();
    r.renderCorridors();

});

