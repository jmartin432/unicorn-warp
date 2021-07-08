import Vector from './Vector'
class Unicorn {

    constructor(id, pathString, age, position, velocity, targetVelocity, acceleration, scaleFactor, speedFactor, color1, color2) {
        this._id = id;
        this._pathString = pathString;
        this._age = age;
        this._position = position;
        this._velocity = velocity;
        this._targetVelocity = targetVelocity
        this._acceleration = new Vector(0, 0)
        this._scaleFactor = scaleFactor;
        this._speedFactor = speedFactor;
        this._color1 = color1;
        this._color2 = color2;
        this._alignNeighbors = [];
        this._avoidNeighbors = [];
        this._cohereNeighbors = []

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

    get targetVelocity() {
        return this._targetVelocity
    }

    set targetVelocity(velocity) {
        this._targetVelocity = velocity
    }

    get acceleration() {
        return this._acceleration
    }

    set acceleration(acceleration) {
        this._acceleration = acceleration
    }

    get alignNeighbors() {
        return this._alignNeighbors
    }

    set alignNeighbors(neighbors) {
        this._alignNeighbors = neighbors
    }

    get avoidNeighbors() {
        return this._avoidNeighbors
    }

    set avoidNeighbors(neighbors) {
        this._avoidNeighbors = neighbors
    }

    get cohereNeighbors() {
        return this._cohereNeighbors
    }

    set cohereNeighbors(neighbors) {
        this._cohereNeighbors = neighbors
    }

    get scaleFactor() {
        return this._scaleFactor
    }

    get speedFactor() {
        return this._speedFactor
    }

    get color1() {
        return this._color1
    }

    get color2() {
        return this._color2
    }

    get bearing() {
        return Math.atan2(this._velocity.y, this._velocity.x) * 180 / Math.PI;
    }

    get transformString() {
        return "translate(" + this._position.x + "," + this._position.y + ")rotate(" + this.bearing + ")scale(" + this._scaleFactor + ")";
    }

    get gradientId() {
        return "url(#gradient" + this._id + ")"
    }
}

export default Unicorn;
