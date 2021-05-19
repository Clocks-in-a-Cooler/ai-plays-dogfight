class Airplane extends Entity {
    /**
     * 
     * @param {Vector} position 
     */
    constructor(position) {
        super(position, [
            new Line(new Vector(-41, -5), new Vector(-41, 6)),
            new Line(new Vector(-41, 6), new Vector(13, 6)),
            new Line(new Vector(13, 6), new Vector(13, -5)),
            new Line(new Vector(13, -5), new Vector(-41, -5))
        ], 0);

        this.type   = "airplane";
        this.id     = 0;
        this.health = 10;

        this.controls = {
            up: false,
            down: false,
            fire: false,
        };

        this.reload = 0;
    }

    get_thrust() {
        return (new Vector(Math.cos(this.angle), Math.sin(this.angle))).multiply(0.005);
    }

    get_drag() {
        return this.motion.multiply(-0.015);
    }

    get_gravity() {
        return new Vector(0, 0.0006);
    }

    get_lift() {
        var lift_angle = this.angle - Math.PI / 2;
        var lift       = (new Vector(Math.cos(lift_angle), Math.sin(lift_angle))).multiply(0.0006);

        lift.y = Math.abs(lift.y) * -1;

        return lift;
    }

    /**
     * @param {Number} lapse 
     * @param {Bullet[]} bullets 
     * @returns {Number?}
     */
    update(lapse, bullets) {
        this.angle += this.controls.up ? -0.06 : 0;
        this.angle += this.controls.down ? 0.06 : 0;

        if (this.reload <= 0 && this.controls.fire) {
            this.reload = 100;

            var bullet_x = this.position.x + Math.cos(this.angle - 0.4939) * 14.76;
            var bullet_y = this.position.y + Math.sin(this.angle - 0.4939) * 14.76;
            bullets.push(new Bullet(this.angle, new Vector(bullet_x, bullet_y), this.id));
        } else {
            this.reload -= lapse;
        }

        this.motion   = this.motion.add(this.get_thrust().multiply(lapse)).add(this.get_drag().multiply(lapse)).add(this.get_gravity().multiply(lapse)).add(this.get_lift().multiply(lapse));
        this.position = this.position.add(this.motion.multiply(lapse));

        if (this.position.y < -42) {
            this.angle = Math.PI / 2;
        }
        if (this.position.y > 642) {
            this.angle = -Math.PI / 2;
        }
        if (this.position.x < -42) {
            this.angle = 0;
        }
        if (this.position.x > 842) {
            this.angle = Math.PI;
        }

        var killer = null;

        bullets.forEach(bullet => {
            if (bullet.owner == this.id || !bullet.active) return;
            if (this.collision(bullet)) {
                bullet.active = false;
                this.health--;

                if (this.health <= 0) killer = bullet.owner;
            }
        });

        this.active = this.health > 0;

        return killer;
    }
}