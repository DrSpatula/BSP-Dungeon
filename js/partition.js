define('partition', ['room','util'], function(Room,U) {
    
    var THRESHOLD = 0.25,
        CORNER_OFFSET_MIN = 0.1,
        CORNER_OFFSET_MAX = 0.25;

    var cornerOffset = function() {
        return U.random(CORNER_OFFSET_MIN, CORNER_OFFSET_MAX);
    };

    var splitValue = function() {
        return Math.random() * 0.34 + 0.33;
    };


    var Partition = function(x_1, y_1, x_2, y_2) {
        this.x1 = x_1;
        this.y1 = y_1;
        this.x2 = x_2;
        this.y2 = y_2;

        this.w = Math.abs(x_2 - x_1);
        this.h = Math.abs(y_2 - y_1);
    };

    Partition.prototype.split = function() {
        if (!this.children) {
            var split = "";
            this.children = [];

            if (this.w < THRESHOLD || this.h > this.w) {
                split = "horizontal";
            } else if (this.h < THRESHOLD || this.w > this.h) {
                split = "vertical";
            } else {
                split = Math.random() > 0.5 ? "horizontal" : "vertical";
            }

            this.split_direction = split;

            var split_point;
            if (split === "horizontal") {
                split_point = this.y1 + (splitValue() * this.h); 
                this.children[0] = new Partition(this.x1, this.y1, this.x2, split_point);
                this.children[1] = new Partition(this.x1, split_point, this.x2, this.y2);
            } else if (split === "vertical") {
                split_point = this.x1 + (splitValue() * this.w);
                this.children[0] = new Partition(this.x1, this.y1, split_point, this.y2);
                this.children[1] = new Partition(split_point, this.y1, this.x2, this.y2);
            }

            this.children[0].parent = this;
            this.children[1].parent = this;
        } else {
            this.children[0].split();
            this.children[1].split();
        }
    };

    Partition.prototype.makeRoom = function() {
        var x1 = this.x1 + cornerOffset() * this.w,
            x2 = this.x2 - cornerOffset() * this.w,
            y1 = this.y1 + cornerOffset() * this.h,
            y2 = this.y2 - cornerOffset() * this.h;

        this.room = new Room(x1, y1, x2, y2);
    }

    Partition.prototype.getSibling = function() {
        var sibling = -1;
        if (this.parent) {
            sibling = 
                (this === this.parent.children[0]) ? this.parent.children[1] : this.parent.children[0];
        }
        return sibling;
    };

    return Partition;
});
