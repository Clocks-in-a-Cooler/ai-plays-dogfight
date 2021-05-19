class Entity {
    /**
     * @param {Vector} position the center of the entity
     * @param {Line[]} lines the outline of the entity, relative to the center (`position`). used for collision detection. does not need to be closed
     * @param {Number?} angle the angle, where 0 is facing directly to the right. if no angle is supplied, defaults to 0
     */
    constructor(position, lines, angle) {
        this.position = position;
        this.motion   = new Vector(0, 0);
        this.angle    = isNaN(angle) ? 0 : angle;
        this.lines    = lines;
        this.health   = 1;
        this.active   = true;
        this.type     = "entity";

        this.size = 0;
        this.lines.forEach(line => {
            if (line.start.get_length() > this.size) {
                this.size = line.start.get_length();
            }
        });
    }

    get_lines() {
        var center = this.position, angle = this.angle;
        return this.lines.map(line => {
            return line.translate(center).rotate(center, angle);
        });
    }

    /**
     * creates an entity.
     * @param {Vector} center 
     * @param {Vector[]} points the vertices of the entity, relative to the center
     */
    static create_entity(center, points) {
        var lines = points.map((_, index, points) => {
            return new Line(points[index], points[(index + 1) % points.length]).translate(center.multiply(-1));
        });

        return new Entity(center, lines, 0);
    }

    /**
     * @param {Entity} other
     * @returns {Vector[]} an array of points where intersection occurs. if there is no intersection, `null` is returned
     */
    collision(other) {
        var intersection_points = [];
        this.get_lines().forEach((this_line) => {
            other.get_lines().forEach((other_line) => {
                var collision_point = this_line.collision(other_line);
                if (collision_point) {
                    intersection_points.push(collision_point);
                }
            });
        });

        return intersection_points.length ? intersection_points : null;
    }

    /**
     * @param {Number} lapse the time elapse since the last update
     */
    update(lapse) {
        // override in child classes
    }

    get_info() {
        return {
            angle: this.angle,
            position: { x: this.x, y: this.y },
            size: this.size,
            type: this.type,
        };
    }
}