class Line {
    /**
     * @param {Vector} start
     * @param {Vector} end
     */
    constructor(start, end) {
        this.start = start;
        this.end   = end;
    }

    get_vector() {
        return this.end.subtract(this.start);
    }

    get_length() {
        return this.end.subtract(this.start).get_length();
    }

    /**
     * @param {Vector} displacement
     */
    translate(displacement) {
        return new Line(this.start.add(displacement), this.end.add(displacement));
    }

    /**
     * @param {Vector} center 
     * @param {Number} angle 
     */
    rotate(center, angle) {
        // to match the formula i ~~stole~~ worked out on my own
        var x1 = this.start.x;
        var y1 = this.start.y;
        var x2 = this.end.x;
        var y2 = this.end.y;
        var p  = center.x;
        var q  = center.y;

        var new_x1 = (x1 - p) * Math.cos(angle) - (y1 - q) * Math.sin(angle) + p;
        var new_y1 = (x1 - p) * Math.sin(angle) + (y1 - q) * Math.cos(angle) + q;
        var new_x2 = (x2 - p) * Math.cos(angle) - (y2 - q) * Math.sin(angle) + p;
        var new_y2 = (x2 - p) * Math.sin(angle) + (y2 - q) * Math.cos(angle) + q;

        return new Line(
            new Vector(new_x1, new_y1),
            new Vector(new_x2, new_y2)
        );
    }

    /**
     * @param {Line} other
     * @returns {Vector?} the point of intersection. if no intersection occurs, then `null` is returned.
     */
    collision(other) {
        // stolen from http://paulbourke.net/geometry/pointlineplane/
        // i solved for u1 and u2 differently, but the result is the same
        var x1 = this.start.x;
        var y1 = this.start.y;
        var x2 = this.end.x;
        var y2 = this.end.y;
        var x3 = other.start.x;
        var y3 = other.start.y;
        var x4 = other.end.x;
        var y4 = other.end.y;

        var denominator = (x4 - x3) * (y2 - y1) - (x2 - x1) * (y4 - y3);
        
        if (denominator == 0) {
            return false;
        }

        var u1_numerator = (x4 - x3) * (y3 - y1) - (x3 - x1) * (y4 - y3);
        var u2_numerator = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);

        var u1 = u1_numerator / denominator;
        // var u2 = u2_numerator / demoninator; // haha i'm an idiot
        var u2 = u2_numerator / denominator;

        if (
            u1 >= 0 && u1 <= 1 &&
            u2 >= 0 && u2 <= 1
        ) {
            return this.start.add(this.get_vector().multiply(u1));
        } else {
            return null;
        }
    }
}