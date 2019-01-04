let Player = (() => {
    
    GSM.registerMe("player", (data) => {
        // This section for receiving messages from the Universe
        if (data == "move top left") { direction = "top left"; }
        if (data == "move top right") { direction = "top right"; }
        if (data == "move bottom left") { direction = "bottom left"; }
        if (data == "move bottom right") { direction = "bottom right"; }
    });

    // Properties
        let x = game.width/2; let y = game.height/2;
        let w = 30; let h = 30;
        let direction = "none";

        // Description of Animations for this obj
        let anime = {
            queue: [],
            list: {
                normal: {
                    update: () => {},
                    draw: () => { ctx.fillStyle = "White"; ctx.fillRect(x, y, w, h) }
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
            // Collisions -
            let topEdge = ctx.getImageData(x+(w/3), y-2, w/3, 1).data;
            for (let i = 0; i < topEdge.length; i += 4) {
                if (topEdge[i] == 156 && topEdge[i+1] == 39 && topEdge[i+2] == 176) {
                    GSM.postMsg("camera", {title: "vy", value: 0}); break;
                }
            }
            let bottomEdge = ctx.getImageData(x+(w/3), y+h+1, w/3, 1).data;
            for (let i = 0; i < topEdge.length; i += 4) {
                if (bottomEdge[i] == 156 && bottomEdge[i+1] == 39 && bottomEdge[i+2] == 176) {
                    GSM.postMsg("camera", {title: "vy", value: 0}); break;
                }
            }
            let leftEdge = ctx.getImageData(x-2, y+(h/3), 1, h/3).data;
            for (let i = 0; i < topEdge.length; i += 4) {
                if (leftEdge[i] == 156 && leftEdge[i+1] == 39 && leftEdge[i+2] == 176) {
                    GSM.postMsg("camera", {title: "vx", value: 0}); break;
                }
            }
            let rightEdge = ctx.getImageData(x+w+1, y+(h/3), 1, h/3).data;
            for (let i = 0; i < topEdge.length; i += 4) {
                if (rightEdge[i] == 156 && rightEdge[i+1] == 39 && rightEdge[i+2] == 176) {
                    GSM.postMsg("camera", {title: "vx", value: 0}); break;
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
        triggerAnime: triggerAnime
    }

});
