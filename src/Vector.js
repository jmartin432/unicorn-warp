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
    }

    equals(v1) {
        return (this._x === v1.x && this.y === v1.y)
    }

    scaleBy(factor) {
        return new Vector (this._x * factor, this._y * factor)
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y)
    }

    static scale(v1, factor) {
        return new Vector(v1.x * factor,v1.y * factor)
    }

    static difference(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    // normalize() {
    //     let mag = this.magnitude();
    //     if (mag === 0) {
    //         return;
    //     }
    //     return this.scale(1 / mag);

    // }

    // magnitude() {
    //     return Math.sqrt(((this.x) * (this.x) + (this.y) * (this.y)));
    //
    // }
    //
    //
    // static distanceSquared(v1, v2) {
    //     return ((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    // }
    //
    // static distance(v1, v2) {
    //     return Math.sqrt(((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y)));
    // }
}

export default Vector