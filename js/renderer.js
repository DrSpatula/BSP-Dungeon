define('renderer', function() {

    var strokeRgb = 'rgb(51,187,255)',
        fillRgb = 'rgb(128,128,128)',
        corridorRgb = 'rgb(192,192,192)';

    var Renderer = function(canvas, data) {
        this.canvas = canvas;
        this.data = data;
        this.ctx = canvas.getContext('2d');
    }
    
    Renderer.prototype.renderBoxList = function(boxen, renderType) {
        var num_boxen = boxen.length,
            renderable_boxen = [],
            cw = this.canvas.width,
            ch = this.canvas.height;

        for (var i = 0; i < num_boxen; i++) {
            var box = boxen[i];

            renderable_boxen.push({
                x: box.x1 * cw,
                y: box.y1 * ch,
                w: box.w * cw,
                h: box.h * ch,
                id: box.id
            });
        }
        
        this.ctx.strokeStyle = strokeRgb;
        this.ctx.fillStyle = fillRgb;

        for (var i = 0; i < num_boxen; i++) {
            var box = renderable_boxen[i];
            if (renderType === 'stroke') {
                this.ctx.strokeRect(box.x, box.y, box.w, box.h);
            } else {
                this.ctx.fillRect(box.x, box.y, box.w, box.h);

                if (box.id) {
                    this.ctx.fillStyle = 'rgb(255,255,255)';
                    this.ctx.font = "14pt DejaVu Sans Bold";
                    this.ctx.fillText(box.id, box.x, box.y + box.h, box.w);
                    this.ctx.fillStyle = fillRgb;
                }
            }                
        }
    };

    Renderer.prototype.renderPartitions = function() {
        this.renderBoxList(this.data.partitions, 'stroke');
    };

    Renderer.prototype.renderRooms = function() {
        this.renderBoxList(this.data.rooms, 'fill');
    }

    Renderer.prototype.renderCorridors = function () {
        var corrs = this.data.corridors,
            num = this.data.corridors.length,
            cw = this.canvas.width,
            ch = this.canvas.height,
            c;

        this.ctx.strokeStyle = corridorRgb;

        for (var i = 0; i < num; i++) {
            c = corrs[i];
            this.ctx.beginPath();
            this.ctx.moveTo(c.x1 * cw, c.y1 * ch);
            this.ctx.lineTo(c.x2 * cw, c.y2 * ch);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    };

    return Renderer;
});
