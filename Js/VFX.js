let VFX = (() => {
    
    GSM.registerMe("vfx", (data) => {
        // This section for receiving messages from the Universe
        if (data.name == "shake") {
            queue.push(Shaker(data.intensity));
        }
        if (data.name == "radial") {
            queue.push(Radial(data.posX, data.posY, data.type));
        }
    });

    let queue = [];

    let run = () => {
        for (let i = 0; i < queue.length; i++) {
            if (!queue[i].isComplete()) {
                queue[i].run();
            } else {
                queue.splice(i, 1);
                i--;
            }
        }
    }

    return {
        run: run
    }
});

let Shaker = ((intensityVal) => {

    // Properties
        let intensity = intensityVal;
        let completed = false;
        // Description of Animations for this obj
        let anime = {
            queue: ["shake"],
            list: {
                normal: {
                    update: () => {},
                    draw: () => {}
                }, 
                shake: {
                    update: () => {},
                    draw: () => {},
                    isOver: () => { if (this.trash == 1) {return true} else {this.trash++; return false} },
                    init: () => {
                       ctx.save();
                        this.x = Math.floor(Math.random() * intensity) + 1;
                        this.y = Math.floor(Math.random() * intensity) + 1;
                        ctx.translate(x, y);
                        this.trash = 0;
                    },
                    destructor: () => { ctx.restore(); completed = true },
                    shouldStart: () => {}, 
                    timesTriggered: 0, 
                    timesRan: 0,
                }
            }
        }

    // All Private Methods
    let update = () => {
        // Updating Animation...
        if (anime.queue.length == 0) {
            anime.list.normal.update();
        } else {
            let foo = anime.list[ anime.queue[0] ];
            if (foo.timesTriggered == foo.timesRan) { foo.timesTriggered++; foo.init() } // This animation is being called freshly
            if (!foo.isOver()) {
                foo.update();
            } else {
                foo.timesRan++;
                foo.destructor();
                anime.queue.splice(0, 1);
            }
        }
    }

    let draw = () => {
        if (anime.queue.length == 0) {
            anime.list.normal.draw();
        } else {
            anime.list[ anime.queue[0] ].draw();
        }
    }

    // All Public Methods
    let run = () => {
        update();
        draw();
    }

    let triggerAnime = (name) => {
        if (anime.list.hasOwnProperty(name)) {
            anime.queue.push(name);
        }
    }

    return {
        run: run,
        triggerAnime: triggerAnime,
        isComplete: () => {return completed}
    }

});

let Radial = (m_x, m_y, m_type) => {

    // Properties
        let completed = false;
        let type = m_type;
        let radius = 80;
        let r = 0; // Used for Animation
        let lineW = 10;
        let lw = 0; // Used for Animation
        let color = "#f21b3f";
        let x = m_x; let y = m_y;
        // Description of Animations for this obj
        let anime = {
            queue: [type],
            list: {
                normal: {
                    update: () => {},
                    draw: () => {}
                }, 
                inward: {
                    update: () => { r -= 10; lw++ },
                    draw: () => { drawingRadial(lw, r) },
                    isOver: () => { 
                        if (r <= 0) {return true};
                    },
                    init: () => { r = radius; lw = 0 },
                    destructor: () => { completed = true },
                    shouldStart: () => {}, 
                    timesTriggered: 0, 
                    timesRan: 0,
                },
                outward: {
                    update: () => { r += 10; lw-- },
                    draw: () => { drawingRadial(lw, r) },
                    isOver: () => { 
                        if (r >= radius && lw <= 0) {return true} 
                    },
                    init: () => {r = 0; lw = lineW},
                    destructor: () => { completed = true },
                    shouldStart: () => {}, 
                    timesTriggered: 0, 
                    timesRan: 0,
                }
            }
        }

    // All Private Methods
    let update = () => {
        // Updating Animation...
        if (anime.queue.length == 0) {
            anime.list.normal.update();
        } else {
            let foo = anime.list[ anime.queue[0] ];
            if (foo.timesTriggered == foo.timesRan) { foo.timesTriggered++; foo.init() } // This animation is being called freshly
            if (!foo.isOver()) {
                foo.update();
            } else {
                foo.timesRan++;
                foo.destructor();
                anime.queue.splice(0, 1);
            }
        }
    }

    let draw = () => {
        if (anime.queue.length == 0) {
            anime.list.normal.draw();
        } else {
            anime.list[ anime.queue[0] ].draw();
        }
    }

    let drawingRadial = (w, r) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke(); 
    }

    // All Public Methods
    let run = () => {
        update();
        draw();
    }

    let triggerAnime = (name) => {
        if (anime.list.hasOwnProperty(name)) {
            anime.queue.push(name);
        }
    }

    return {
        run: run,
        triggerAnime: triggerAnime,
        isComplete: () => { return completed }
    }

};

// Particle System does not come under the general VFX system
let Particles = () => {

    GSM.registerMe("particles", (data) => {
        if (data.name == "spawn") {
            spawn(data.type, data.x, data.y, data.vx, data.vy);
        }
    });

    let listOfParticles = [];

    let spawn = (type, x, y, vx, vy) => {
        if (type == "trail") {
            listOfParticles.push(Particle(x, y, -vx*10, -vy*10));
        }
        if (type == "explosion") {
            for (var i = 0; i <= 20; i++) {
                listOfParticles.push(Particle(
                    "explosion", 
                    x, 
                    y, 
                    {x: Math.floor(Math.random()*5)-3, y: -(Math.floor(Math.random()*12)+4)}, 
                    {x: 0, y: 0.2}
                ));
            };
        }
    }

    let run = () => {
        for (let i in listOfParticles) {
            if (!listOfParticles[i].shouldBeKilled()) {
                listOfParticles[i].run();
            } else {
                listOfParticles.splice(i, 1);
                i--;
            }
        }
    }

    return {
        run: run
    }

}

let Particle = (m_x, m_y, m_vx, m_vy) => {
    let x = m_x; let y = m_y; let v = {x: m_vx, y: m_vy};
    let opacity = 1;
    let w = 3; let h = 3;
    let color = "rgba(255, 0, 0, " + opacity + ")";

    let update = () => {
        x += v.x;
        y += v.y;
        opacity -= 0.1;
        color = "rgba(255, 0, 0, " + opacity + ")";
    }

    let draw = () => {
	ctx.fillStyle = color;
        ctx.beginPath();
	ctx.arc(x, y, w, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }

    let isOutOfScreen = () => {
        if (this.x < -20 || this.x > 620 || this.y > 820 || this.y < -200) {
            return true;
	} else {
            return false;
	}
    }

    let shouldBeKilled = () => {
        if (opacity <= 0 || isOutOfScreen()) {return true}
        return false;
    }

    let run = () => {
        update();
        draw();
    }

    return {
        run: run,
        shouldBeKilled: shouldBeKilled
    }

}
