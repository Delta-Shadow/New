let Player = (() => {
    
    GSM.registerMe("player", (data) => {
        // This section for receiving messages from the Universe
        switch (data.title) {
            case "init":
                mazeWidth = data.mW; mazeHeight = data.mH;
                x = mazeWidth / 2 + 5;
                y = mazeHeight / 2 - 5;
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
        let vx = 0; vy = 0;
        let speed = 0.8;
        let blocked = {x: false, y: false}
        let timer = 0;
        let color = "rgb(234, 181, 67)";
        let blocksColor = {r: 179, g: 55, b: 113};

        // Description of Animations for this obj
        let anime = {
            queue: [],
            list: {
                normal: {
                    update: () => {},
                    draw: () => { ctx.fillStyle = color; ctx.fillRect(screenX, screenY, w, h) }
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
        timer++;
        handleCollisions();
        x += vx;
        y += vy;
        // Let camera know about me
        GSM.postMsg("camera", {title: "player coords", x: x, y: y});
        // If we are moving, launch particles
        if (timer % 2 == 0) {
            GSM.postMsg("particles", {name: "spawn", type: "trail", x: screenX+w/2, y: screenY+h/2, 
                vx: (blocked.x ? 0 : vx),
                vy: (blocked.y ? 0 : vy)
            });
        }
    }

    let draw = () => {
        if (anime.queue.length == 0) {
            anime.list.normal.draw();
        } else {
            anime.list[ anime.queue[0] ].draw();
        }
    }

    let changeDirection = (tx, ty) => {
        vx = 0; vy = 0;
        if (tx <= game.width/2 && ty <= game.height/2) { vx = -speed; vy = -speed } // Top left
        if (tx >= game.width/2 && ty <= game.height/2) { vx = speed; vy = -speed } // Top Right
        if (tx <= game.width/2 && ty >= game.height/2) { vx = -speed; vy = speed } // Bottom left
        if (tx >= game.width/2 && ty >= game.height/2) { vx = speed; vy = speed } // Bottom right
    }

    let handleCollisions = () => {
        let topEdge = checkCollision("up"); let bottomEdge = checkCollision("down");
        let leftEdge = checkCollision("left"); let rightEdge = checkCollision("right");
        if (topEdge || bottomEdge) {
            if (topEdge) {y += speed}
            if (bottomEdge) {y -= speed}
            blocked.y = true;
        } else {blocked.y = false}
        if (leftEdge || rightEdge) {
            if (leftEdge) {x += speed}
            if (rightEdge) {x -= speed}
            blocked.x = true;
        } else {blocked.x = false}
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
            if (edge[i] == blocksColor.r && edge[i+1] == blocksColor.g && edge[i+2] == blocksColor.b) { return true }
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
