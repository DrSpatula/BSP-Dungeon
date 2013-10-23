define('util', function() {

    var fillArray = function(val, dim) {
        var a = [];
        for (var i = 0; i < dim; i++) {
            if (Object.prototype.toString.call(val) === "[object Array]") {
                val = val.slice(0);
            }

            a.push(val);
        }

        return a;
    };


    var Util = {};

    Util.random = function(min, max) {
        return Math.random() * (max - min) + min;
    };

    Util.generateArray = function() {
        var dimensions = Array.prototype.slice.call(arguments),
            val = 0;

        for (var i = (dimensions.length - 1); i >= 0; i--) {
            val = fillArray(val, dimensions[i]);
        }

        return val;
    };

    return Util;

});
