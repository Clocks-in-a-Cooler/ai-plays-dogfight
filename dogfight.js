var canvas  = document.querySelector("canvas");
var context = canvas.getContext("2d");

canvas.width = 800; canvas.height = 600;

var plane_sprites = (function() {
    return [0, 1, 2, 3, 4, 5, 6].map(n => {
        var img = document.createElement("img");
        img.src = "biplane_" + n + ".png";
        return img;
    });
})();

/**
 * @type {AI_airplane[]}
 */
var ai_planes = [];

var planes_per_generation = 60;
var generations           = 1; // why not?

for (var c = 0; c < planes_per_generation; c++) {
    ai_planes.push(new AI_airplane(new Vector(Math.random() * 800, Math.random() * 400), c, plane_sprites[Math.floor(Math.random() * 7)]));
}

function draw() {
    context.clearRect(0, 0, 800, 600);
    // context.save();
    // context.translate(plane.position.x, plane.position.y);
    // context.rotate(plane.angle);
    // context.drawImage(plane_sprite, -42, -14);
    // context.restore();

    // shows the plane's hitbox
    // context.beginPath();
    // context.strokeStyle = "forestgreen";
    // plane.get_lines().forEach(line => {
    //     context.moveTo(line.start.x, line.start.y);
    //     context.lineTo(line.end.x, line.end.y);
    // });
    // context.closePath();
    // context.stroke();

    context.fillStyle = "mediumspringgreen";
    context.fillRect(0, 540, 800, 60);

    ai_planes.forEach(plane => {
        if (!plane.active) return;
        context.save();
        context.translate(plane.position.x, plane.position.y);
        context.rotate(plane.angle);
        context.drawImage(plane.sprite, -42, -14);
        // context.beginPath();
        // plane.lines_of_sight.forEach(line => {
        //     context.strokeStyle = "white";
        //     context.moveTo(line.start.x, line.start.y);
        //     context.lineTo(line.end.x, line.end.y);
        // });
        // context.closePath();
        // context.stroke();
        // plane.points_seen.forEach(point => {
        //     context.fillStyle = "white";
        //     context.beginPath();
        //     context.arc(point.x, point.y, 2, 0, Math.PI * 2);
        //     context.closePath();
        //     context.fill();
        // });
        // context.restore();
        // context.strokeStyle = "mediumspringgreen";
        // plane.get_lines().forEach(line => {
        //     context.moveTo(line.start.x, line.start.y);
        //     context.lineTo(line.end.x, line.end.y);
        // });
        // context.closePath();
        // context.stroke();
        context.restore();
    });

    bullets.forEach(bullet => {
        context.strokeStyle = "rgb(255, 255, 128)";
        context.lineWidth   = 3;
        context.save();
        context.translate(bullet.position.x, bullet.position.y);
        context.rotate(bullet.angle);
        context.beginPath();
        context.moveTo(bullet.lines[0].start.x, bullet.lines[0].start.y);
        context.lineTo(bullet.lines[0].end.x, bullet.lines[0].end.y);
        context.closePath();
        context.stroke();
        context.restore();
    });
}

var next_gen = false;

var last_time = null, lapse = 0, runtime = 0;
function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = Math.min(time - last_time, 50);
    }
    last_time = time;

    // plane.update(lapse, bullets);

    ai_planes.forEach(ai_plane => {
        ai_plane.update(lapse, ai_planes, bullets);
    })

    if (ai_planes.filter(plane => plane.active).length <= 3 || next_gen) {
        // generate the next generation
        
        var sorted = ai_planes.sort((a, b) => {
            return b.score - a.score;
        });
        
        console.log(`highest score in generation ${generations} is ${sorted[0].score}`);

        ai_planes = [];

        for (var c = 0; c < planes_per_generation; c++) {
            /**
             * @type {AI_airplane}
             */
            var parent = sorted[0];
            for (var d = 0; d < sorted.length; d++) {
                if (Math.random() < 1 / (d + 2)) {
                    parent = sorted[d];
                    break;
                }
            }
            // the rest don't get to breed, sorry
            var child = new AI_airplane(new Vector(Math.random() * 800, Math.random() * 400), c, parent.sprite);
            var genes = parent.brain.get_values().map(n => {
                if (Math.random < 0.8) return n;
                var mutation = Math.random() * n * 0.1;
                return n + (Math.random() < 0.5 ? -1 : 1) * mutation;
            });

            // mutation: the child plane has a chance of using a random colour, not the parent's colour
            if (Math.random() < 0.1) {
                child.sprite = plane_sprites[Math.floor(Math.random() * 7)];
            }

            child.brain.set_values(genes);
            ai_planes.push(child);
        }

        generations++;
        next_gen = false;
        runtime  = 0;
    }

    bullets = bullets.filter(bullet => {
        bullet.update(lapse);
        return bullet.active;
    });
    draw();

    if (runtime > 5400) {
        // too long, kill all surviving players
        ai_planes.forEach(plane => {
            if (!plane.active) return;
            plane.score  = 0;
            plane.active = false;
        });
        console.log("timed out. all remaining planes killed.");
    }

    runtime++;

    requestAnimationFrame(animate);
}

// addEventListener("keydown", (event) => {
//     switch (event.code) {
//         case "ArrowUp":
//             plane.controls.up = true;
//             break;
//         case "ArrowDown":
//             plane.controls.down = true;
//             break;
//         case "Space":
//             plane.controls.fire = true;
//             break;
//     }
// });

// addEventListener("keyup", (event) => {
//     switch (event.code) {
//         case "ArrowUp":
//             plane.controls.up = false;
//             break;
//         case "ArrowDown":
//             plane.controls.down = false;
//             break;
//         case "Space":
//             plane.controls.fire = false;
//             break;
//     }
// });

document.getElementById("skip").addEventListener("click", () => { next_gen = true; });

requestAnimationFrame(animate);