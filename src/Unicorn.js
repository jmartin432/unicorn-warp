import Vector from './Vector'
class Unicorn {

    constructor(id, pathString, age, pos, vel, scaleFactor, speedFactor, color) {
        this._id = id;
        this._pathString = pathString;
        this._age = age;
        this._position = pos;
        this._velocity = vel;
        this._acceleration = new Vector(0, 0)
        // this.acceleration = new Vector(0, 0);
        // this.targetVel = new Vector(this.velocity.x, this.velocity.y);
        this._scaleFactor = scaleFactor;
        this._speedFactor = speedFactor;
        this._color = color;
        // this.neighbors = [];

    }

    get id() {
        return this._id
    }

    get pathString() {
        return this._pathString
    }

    get position() {
        return this._position
    }

    set position(position) {
        this._position = position
    }

    get velocity() {
        return this._velocity
    }

    set velocity(velocity) {
        this._velocity = velocity
    }

    get acceleration() {
        return this._acceleration
    }

    set acceleration(acceleration) {
        this._acceleration = acceleration
    }

    get scaleFactor() {
        return this._scaleFactor
    }

    get speedFactor() {
        return this._speedFactor
    }

    get color() {
        return this._color
    }

    get bearing() {
        return Math.atan2(this._velocity.y, this._velocity.x) * 180 / Math.PI;
    }

    get transformString() {
        return "translate(" + this._position.x + "," + this._position.y + ")rotate(" + this.bearing + ")scale(" + this._scaleFactor + ")";
    }

    // checkBounds(xMin, xMax, yMin, yMax) {
    //     if (this._position.x + this._velocity.x < xMin || this._position.x + this._velocity.x > xMax)
    //         this._velocity.x *= -1
    //     if (this._position.y + this._velocity.y < yMin || this._position.y + this._velocity.y > yMax)
    //         this._velocity.y *= -1
    // }

    updatePosition() {
        this._position = Vector.add(this._velocity, this._position)
    }
}

export default Unicorn;
