let Player = (() => {
    
    GSM.registerMe("player", (data) => {
        // This section for receiving messages from the Universe
        switch (data.title) {
            case "init":
                mazeWidth = data.mW; mazeHeight = data.mH;
                x = mazeWidth / 2;
                y = mazeHeight / 2;
                break;
            
            case "move":
                changeDirection(data.x, data.y);
                break;
        }
    });

    // Properties
        let x = 0; let y = 0; // Center Coords. Inside the Maze. Pseudo.
        let w = 25; let h = 25;
        let screenX = game.width/2-w/2; let screenY = game.height/2-h/2; // Top Left Coords. On Screen Player. Real.
        let mazeWidth = 0; let mazeHeight = 0;
        let vx = 0; vy = 0;
        let speed = 1;
        let direction = "none";

        // Description of Animations for this obj
        let anime = {
            queue: [],
            list: {
                normal: {
                    update: () => {},
                    draw: () => { ctx.fillStyle = "White"; ctx.fillRect(screenX, screenY, w, h) }
                }, 
                intro: {
                    update: () => {},
                    draw: () => {},
                    isOver: () => {},
                    init: () => {},
                    destructor: () => {},
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

        // Updating Mechanics...
        handleCollisions();
        x += vx;
        y += vy;
        // Let camera know about me
        GSM.postMsg("camera", {title: "player coords", x: x, y: y});
    }

    let draw = () => {
        if (anime.queue.length == 0) {
            anime.list.normal.draw();
        } else {
            anime.list[ anime.queue[0] ].draw();
        }
    }

    let changeDirection = (tx, ty) => {
        xVector = (tx - screenX);
        yVector = (ty - screenX);
        magnitude = Math.abs(Math.sqrt(xVector*xVector + yVector*yVector));
        if (magnitude != 0) {
            xUnit = xVector / magnitude;
            yUnit = yVector / magnitude;
            vx = xUnit * speed;
            vy = yUnit * speed;
        }
    }

    let handleCollisions = () => {
        if (checkCollision("up")) {
            vx = 0; vy = 0;
            y += 0.1;
        } 
        if (checkCollision("down")) {
            vx = 0; vy = 0;
            y -= 0.1;
        }
        if (checkCollision("left")) {
            vx = 0; vy = 0;
            x += 0.1;
        } 
        if (checkCollision("right")) {
            vx = 0; vy = 0;
            x -= 0.1;
        }
    }

    let checkCollision = (side) => {
        switch (side) {
            case "up":
                a = screenX+(w/3); b = screenY-2; c = w/3; d = 1; break;
            case "down":
                a = screenX+(w/3); b = screenY+h+1; c = w/3; d = 1; break;
            case "left":
                a = screenX-2; b = screenY+(h/3); c = 1; d = h/3; break;
            case "right":
                a = screenX+w+1; b = screenY+(h/3); c = 1; d = h/3; break;
        }
        let edge = ctx.getImageData(a, b, c, d).data;
        for (let i = 0; i < edge.length; i += 4) {
            if (edge[i] == 156 && edge[i+1] == 39 && edge[i+2] == 176) { return true }
        }
    };

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
        triggerAnime: triggerAnime
    }

});
