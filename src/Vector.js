class Vector {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    set x(x){
        this._x = x;
    }

    set y(y){
        this._y = y;
    }

    reset() {
        this._x = 0;
        this._y = 0;
        return this
    }

    round(places) {
        this._x = Math.round(this._x * Math.pow(10, places)) / Math.pow(10, places)
        this._y = Math.round(this._y * Math.pow(10, places)) / Math.pow(10, places)
        return this
    }

    equals(v1) {
        return (this._x.toFixed(3) === v1.x.toFixed(3) &&
            this._y.toFixed(3)=== v1.y.toFixed(3))
    }

    copy() {
        return new Vector(this._x, this._y)
    }

    scaleBy(factor) {
        this._x *= factor
        this._y *= factor
        return this
    }

    lengthen(length) {
        let magnitude = Math.sqrt(((this._x) * (this._x) + (this._y) * (this._y)))
        if (magnitude === 0) {
            this._x = 0
            this._y = 0
            return this
    }
        this._x *= length / magnitude
        this._y *= length / magnitude
        return this
    }

    normalize() {
        let magnitude = Math.sqrt(((this._x) * (this._x) + (this._y) * (this._y)))
        if (magnitude === 0) return new Vector (0, 0)
        this._x *= 1 / magnitude
        this._y *= 1 / magnitude
        return this
    }

    magnitude() {
        return Math.sqrt(((this._x) * (this._x) + (this._y) * (this._y)));
    }

    add(v1) {
        this._x += v1.x
        this._y += v1.y
        return this
    }

    minus(v1) {
        this._x -= v1.x
        this._y -= v1.y
        return this
    }

    static distanceSquared(v1, v2) {
        return ((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }

    static sum(vectorsList) {
        if (vectorsList.length === 0) return null
        let x = 0;
        let y = 0;
        for (let i = 0; i < vectorsList.length; i++){
            x = x + vectorsList[i].x
            y = y + vectorsList[i].y
        }
        return new Vector (x, y)
    }

    static average(vectorsList) {
        if (vectorsList.length === 0) return null
        let x = 0;
        let y = 0;
        for (let i = 0; i < vectorsList.length; i++){
            x += vectorsList[i].x
            y += vectorsList[i].y
        }
        return new Vector (x / vectorsList.length, y / vectorsList.length)
    }

    static scale(v1, factor) {
        return new Vector(v1.x * factor,v1.y * factor)
    }

    static difference(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static vectorFromAngle(angle) {
        return new Vector(Math.cos(angle), Math.sin(angle))
    }
    //
    // static distance(v1, v2) {
    //     return Math.sqrt(((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y)));
    // }
}

export default Vector