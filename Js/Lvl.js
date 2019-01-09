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
                    level[i].push(0);
                }
            }
        let cw = 10; let ch = 10;
        let color = "rgb(156, 39, 176)";

    let getRandInt = (min, max) => { // Both Inclusive
        min = Math.ceil(min);
        min = Math.floor(min);
        return Math.floor(Math.random() * (max-min+1)) + min;
    }

    let addVertiBlocks = (index, range1, range2, randIndex) => {
        for (let i = range1; i < range2; i++) {
            level[i][index] = 1;
        }
        level[randIndex][index] = 0;
    }

    let addHoriBlocks = (index, range1, range2, randIndex) => {
        for (let i = range1; i < range2; i++) {
            level[index][i] = 1;
        }
        level[index][randIndex] = 0;
    }

    let recurse = (x1, y1, x2, y2) => {
        if (x2 - x1 <= 1 || y2 - y1 <= 1) {return}

        let x = getRandInt(x1, x2);
        let y = getRandInt(y1, y2);

        if (x2 - x1 >= y2 - y1) { // Width of given area is greater than height
            // Vertical Split
            addVertiBlocks(x, y1, y2, getRandInt(y1, y2));
            recurse(x1, y1, x-2, y2);
            recurse(x+1, y1, x2, y2);
        } else { // Height of given area is greater than width
            // Horizontal Split
            addHoriBlocks(y, x1, x2, getRandInt(x1, x2));
            recurse(x1, y1, x2, y-1);
            recurse(x1, y+1, x2, y2);
        }
    }

    let createMaze = () => {
        recurse(0, 0, level[0].length-1, level.length-1); // Random generation
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
        /*level[h/2 - 0][w/2 - 1] = 2;
        level[h/2 - 0][w/2 + 1] = 2;
        level[h/2 + 2][w/2 - 1] = 2;
        level[h/2 + 2][w/2 + 1] = 2;*/
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
