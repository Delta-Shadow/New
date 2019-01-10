let Lvl = (() => {

    GSM.registerMe("lvl", (data) => {
    });

    // Props
        // Empty level array
        let level = [];
        let w = 30; let h = 30;
            // Populating that Array
            for (let i = 0; i < h; i++) {
                level.push( [] );
                for (let j = 0; j < w; j++) {
                    level[i].push(1);
                }
            }
        let cw = 10; let ch = 10;
        let color = "rgb(156, 39, 176)";

    let getRandInt = (min, max) => { // Both Inclusive
        min = Math.ceil(min);
        min = Math.floor(min);
        return Math.floor(Math.random() * (max-min+1)) + min;
    }


    let make = () => {
        let x = 0; let y = 0; 
        for (let y = 0; y < level.length; y += 2) {
            for (let x = 0; x < level[y].length; x += 2) {
                let dir = getRandInt(1, 2);
                level[y][x] = 0;
                if (dir == 1 && x + 1 < w) { // punch right
                    level[y][x+1] = 0;
                } else if (y + 1 < h) { // go down
                    level[y+1][x] = 0;
                }
            }
        }
    }

    let createMaze = () => {
        make();
        // Adding boundary at top and bottom
        level.unshift( [] );
        for (let i = 0; i < w; i++) { level[0][i] = 1 }
        level.push( [] );
        for (let i = 0; i < w; i++) { level[w-1][i] = 1 }

        // Adding boundary at left and right
        for (let i in level) {
            level[i].unshift(1);
            level[i].push(1);
        }
        w += 2; h += 2;
        
        // Customizing the center
        level[h/2][w/2] = 0;

        // Hand over the level design to everyone who needs
        GSM.postMsg("camera", {title: "init", cw: cw, ch: ch, cols: w, rows: h, level: level});
        GSM.postMsg("player", {title: "init", mW: w*cw, mH: h*ch});
    }

    let run = () => {
        ctx.fillStyle = color; 
        for (let i in level) {
            for (let j in level[i]) {
                if (level[i][j] == 1) {
                    ctx.fillRect( (j*cw), (i*ch), cw, ch );
                }
            }
        }
    }

    return {
        run: run,
        makeMaze: createMaze
    }

});
