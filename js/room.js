define('room', ['id'], function(Id) {

    var id = new Id("room_");

    var Room = function(x_1, y_1, x_2, y_2) {
        this.id = id.next();

        this.x1 = x_1;
        this.y1 = y_1;
        this.x2 = x_2;
        this.y2 = y_2;

        this.w = Math.abs(x_2 - x_1);
        this.h = Math.abs(y_2 - y_1);

        this.doors = [];
        this.connections = [];
    };

    Room.prototype.addDoor = function(door) {
        this.doors.push(door);
        this.connections[door.connection.id] = door;
    };

    return Room;
});
