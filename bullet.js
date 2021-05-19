class Bullet extends Entity {
    /**
     * @param {Number} angle 
     * @param {Vector} position 
     * @param {Number} owner the id of the airplane that fired this bullet
     */
    constructor(angle, position, owner) {
        super(position, [new Line(new Vector(0, 0), new Vector(-15, 0))], angle);
        this.motion   = (new Vector(Math.cos(angle), Math.sin(angle))).multiply(0.9);
        this.lifetime = 500;
        this.owner    = owner;
        this.type     = "bullet";
    }

    /**
     * @param {Number} lapse 
     */
    update(lapse) {
        this.position  = this.position.add(this.motion.multiply(lapse));
        this.lifetime -= lapse;

        this.active = this.lifetime >= 0;
    }
}

/**
 * @type {Bullet[]}
 */
var bullets = [];