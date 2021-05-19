// putting jsdoc comments so that VS Code's intellisense can tell the types of everything

class Vector {
    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x; this.y = y;
    }

    get_length() {
        return Math.hypot(this.x, this.y);
    }

    get_angle() {
        var angle = Math.acos(this.x / this.get_length());
        return this.y > 0 ? angle : -angle;
    }

    to_string() {
        return `(${ this.x }, ${ this.y })`;
    }

    /**
     * @param {Vector} other 
     */
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    /**
     * @param {Vector} other
     */
    subtract(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    /**
     * @param {Number} factor
     */
    multiply(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    /**
     * @param {Number} new_length
     */
    scale(new_length) {
        var factor = new_length / this.get_length;
        return this.multiply(factor);
    }
}