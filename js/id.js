define('id', function() {
    
    var Id = function(base) {
        this.base = "" + base;
        this.num = 0;
    };

    Id.prototype.next = function() {
        return "" + this.base + this.num++;
    };

    return Id;
});
