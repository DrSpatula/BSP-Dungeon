define('map', ['partition','util'], function(Partition,U) {

    var iterations = 4,
        min_overlap = 0.0334;

    var getLeaves = function(node, data) {
        if (!node.hasOwnProperty('children')) {
            data.push(node);
        } else {
            getLeaves(node.children[0], data);
            getLeaves(node.children[1], data);
        }
    };

    var doorCoordinate = function(overlap) {
        var len = Math.abs(overlap[1] - overlap[0]),
            offset = len * 0.25;
        
        return U.random(overlap[0] + offset, overlap[1] - offset);
    };

    var sortH = function(a,b) {
        return a.x1 - b.x1;
    };

    var sortV = function(a,b) {
        return a.y1 - b.y1;
    };

    var firstH = function(a,b) {
        if (a.x2 < b.x2) {
            return a;
        } else {
            return b;
        }
    };

    var firstV = function(a,b) {
        if (a.y2 < b.y2) {
            return a;
        } else {
            return b;
        }
    };

    var hasOverlap = function(a,b) {
        var overlaps = false;

        if (containedInXs(a.x1, b) ||
            containedInXs(a.x2, b) ||
            containedInXs(b.x1, a) ||
            containedInXs(b.x2, a)) {
                overlaps = true;
        }

        if (containedInYs(a.y1, b) ||
            containedInYs(a.y2, b) ||
            containedInYs(b.y1, a) ||
            containedInYs(b.y2, a)) {
                overlaps = true;
        }
        
        return overlaps;
    };

    var overlapXs = function(a,b) {
        return [Math.max(a.x1,b.x1), Math.min(a.x2,b.x2)];
    };

    var overlapYs = function(a,b) {
        return [Math.max(a.y1,b.y1), Math.min(a.y2,b.y2)];
    };

    var overlapsEqual = function(ov1, ov2) {
        if (ov1[0] === ov2[0] && ov1[1] === ov2[1]) {
            return true;
        } else {
            return false;
        }
    };

    var containedInXs = function(point, room) {
        if (point > room.x1 && point < room.x2) {
            return true;
        } else {
            return false;
        }
    };

    var containedInYs = function(point, room) {
        if (point > room.y1 && point < room.y2) {
            return true;
        } else {
            return false;
        }
    };

    var findOverlaps = function(side_a, side_b, direction) {
        var overlap, first;
        if (direction === "horizontal") {
            overlap = overlapXs;
            first = firstH;
        } else {
            overlap = overlapYs;
            first = firstV;
        }

        var list = [],
            a_count = side_a.length,
            b_count = side_b.length,
            a_index = 0,
            b_index = 0;

        while (a_index < a_count && b_index < b_count) {
            var current_a = side_a[a_index],
                current_b = side_b[b_index];

            if (hasOverlap(current_a, current_b)) {
                var lap = overlap(current_a,current_b);
                if (Math.abs(lap[1] - lap[0]) > min_overlap) {
                    list.push(lap);
                }
            }

            if (first(current_a,current_b) === current_a) {
                a_index++;
            } else {
                b_index++;
            }
        }

        return list;
    };

    var findDoorsRoom = function(rooms, door_coord, containedIn) {
        var match,
            room_count = rooms.length;
        if (room_count === 1) {
            match = rooms[0];
        } else {
            for (var i = 0; i < room_count; i++) {
                var room = rooms[i];
                if (containedIn(door_coord, room)) {
                    match = room;
                    break;
                }
            }
        }

        return match;
    };

    var corridorH = function(tops, bottoms, overlap, corridors) {
        var door_x = doorCoordinate(overlap),
            top,
            bottom;

        top = findDoorsRoom(tops, door_x, containedInXs);
        bottom = findDoorsRoom(bottoms, door_x, containedInXs);

        top.addDoor({
            x: door_x,
            y: top.y2,
            connection: bottom
        });

        bottom.addDoor({
            x: door_x,
            y: bottom.y1,
            connection: top
        });

        corridors.push({
            x1: door_x,
            x2: door_x,
            y1: top.y2,
            y2: bottom.y1
        });
    };

    var corridorV = function(lefts, rights, overlap, corridors) {
        var door_y = doorCoordinate(overlap),
            left,
            right;

        left = findDoorsRoom(lefts, door_y, containedInYs);
        right = findDoorsRoom(rights, door_y, containedInYs);

        left.addDoor({
            x: left.x2,
            y: door_y,
            connection: right
        });

        right.addDoor({
            x: right.x1,
            y: door_y,
            connection: left
        });

        corridors.push({
            x1: left.x2,
            x2: right.x1,
            y1: door_y,
            y2: door_y
        });
    };



    var Map = function() {
        this.tiers = [];
        this.corridors = [];

        this.construct();
        this.makeRooms();
        this.connectRooms();
    };

    Map.prototype.construct = function() {
        this.data = new Partition(0,0,1,1);
        for (var i = 0; i < iterations; i++) {
            this.data.split();
            this.tiers[i] = this.extractLeaves();
        }

        this.tiers.unshift(this.data);
        this.partitions = this.tiers.pop();
    };

    Map.prototype.extractLeaves = function() {
        var leaves = [];
        getLeaves(this.data, leaves);
        return leaves;
    }; 

    Map.prototype.makeRooms = function() {
        var num = this.partitions.length;
        this.rooms = [];
        for (i = 0; i < num; i++) {
            this.partitions[i].makeRoom();
            this.rooms[i] = this.partitions[i].room;
        }
    };

    Map.prototype.connectRooms = function() {
        var num_tiers = this.tiers.length;

        for (var i = num_tiers - 1; i >= 0; i--) {
            var tier;
            if (this.tiers[i] instanceof Array) {
                tier = this.tiers[i].slice(0);
            } else {
                tier = [this.tiers[i]];
            }

            while (tier.length) {
                var par = tier.pop(),
                    member_leaves = [];

                if (par === this.data) {
                    member_leaves = this.partitions;
                } else {
                    getLeaves(par, member_leaves);
                }

                var num_leaves = member_leaves.length,
                    overlaps = [];

                if (par.split_direction === "vertical") {
                    var splitx = par.children[0].x2,
                        lefts = [],
                        rights = [];

                    for(var n = 0; n < num_leaves; n++) {
                        var pt = member_leaves[n];
                        if (pt.x2 === splitx) {
                            lefts.push(pt.room);
                        } else if (pt.x1 === splitx) {
                            rights.push(pt.room);
                        }
                    }

                    lefts.sort(sortV);
                    rights.sort(sortV);

                    overlaps = findOverlaps(lefts, rights, par.split_direction);
                    var num_laps = overlaps.length;

                    var ov = overlaps[Math.floor(Math.random() * overlaps.length)];
                    corridorV(lefts, rights, ov, this.corridors);

                    if (lefts.length > 3 || rights.length > 3) {
                        var ov2;
                        do {
                            ov2 = overlaps[Math.floor(Math.random() * overlaps.length)];
                        } while (overlapsEqual(ov, ov2)); 
                        corridorV(lefts, rights, ov2, this.corridors);
                    }

                } else if (par.split_direction === "horizontal") {
                    var splity = par.children[0].y2,
                        tops = [],
                        bottoms = [];

                    for (var n = 0; n < num_leaves; n++) {
                        var pt = member_leaves[n];
                        if (pt.y2 === splity) {
                            tops.push(pt.room);
                        } else if (pt.y1 === splity) {
                            bottoms.push(pt.room);
                        }
                    }

                    tops.sort(sortH);
                    bottoms.sort(sortH);

                    overlaps = findOverlaps(tops, bottoms, par.split_direction);

                    var ov = overlaps[Math.floor(Math.random() * overlaps.length)]; 
                    corridorH(tops, bottoms, ov, this.corridors);

                    if (tops.length > 3 || bottoms.length > 3) {
                        var ov2;
                        do {
                            ov2 = overlaps[Math.floor(Math.random() * overlaps.length)];
                        } while (overlapsEqual(ov, ov2)); 
                        corridorH(tops, bottoms, ov2, this.corridors);
                    }
                }
            }
        }
    };
    
    return Map;
});
