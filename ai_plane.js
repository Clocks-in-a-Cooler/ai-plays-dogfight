// AIrplane! hahahahahahaha

class AI_airplane extends Airplane {
    /**
     * 
     * @param {Vector} position 
     * @param {Number} id
     * @param {HTMLImageElement} sprite
     */
    constructor(position, id, sprite) {
        super(position);
        this.id     = id;
        this.sprite = sprite;

        // lines of sight, 400 pixels in each direction
        this.lines_of_sight = [
            new Line(new Vector(0, 0), new Vector(0, -400)),
            new Line(new Vector(0, 0), new Vector(282.8, -282.8)),
            new Line(new Vector(0, 0), new Vector(400, 0)),
            new Line(new Vector(0, 0), new Vector(282.8, 282.8)),
            new Line(new Vector(0, 0), new Vector(0, 400))
        ];

        this.distances   = [0, 0, 0, 0, 0];
        this.points_seen = [];

        this.brain = new Neural_network(
            // finish
            [
                () => { return this.distances[0]; },
                () => { return this.distances[1]; },
                () => { return this.distances[2]; },
                () => { return this.distances[3]; },
                () => { return this.distances[4]; },
                () => { return this.angle },
                () => { return 540 - this.position.y },
                () => { return 1; } // bias node
            ],
            [8, 5, 3]
        );

        this.score = 0;
    }

    /**
     * 
     * @param {Number} lapse 
     * @param {AI_airplane} other_planes 
     * @param {Bullet[]} bullets
     */
    update(lapse, other_planes, bullets) {
        this.points_seen = [];
        if (!this.active) return;
        // update position first
        var killer = super.update(lapse, bullets);

        // create an entity for each line, then check for the closest collision point
        this.distances = this.lines_of_sight.map(line => {
            var sight    = new Entity(this.position, [line], 0);
            var distance = 400;
            
            other_planes.forEach(plane => {
                if (plane === this || !plane.active) return;
                var points = sight.collision(plane);
                if (points) {
                    points.forEach(point => {
                        // yes, that's right. *three* nested forEach callbacks. i'm on a ryzen 7 now, so performance should be okay. should.
                        var dist = point.subtract(this.position).get_length();
                        if (distance > dist) {
                            distance = dist;
                        }

                        this.points_seen.push(point);
                    });
                }
            });

            return distance;
        });

        this.brain.activate();

        this.controls.up   = this.brain.node_layers[3][0].activation > 0.5;
        this.controls.down = this.brain.node_layers[3][1].activation > 0.5;
        this.controls.fire = this.brain.node_layers[3][2].activation > 0.5;

        if (this.position.y > 540) {
            this.score  = 0;
            this.active = false;
        }

        if (killer != null) {
            other_planes[killer].score++;
        }
    }
}