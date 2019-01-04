let Camera = (() => {

    GSM.registerMe("camera", (data) => {
        if (data.title == "init") {
            cw = data.cw; ch = data.ch;
            level = data.level;
            mf = game.width/(w * cw);
        } else if (data == "move top left") {
            vx = -2; vy = -2;
        } else if (data == "move top right") {
            vx = 2; vy = -2;
        } else if (data == "move bottom left") { 
            vx = -2; vy = 2;
        } else if (data == "move bottom right") {
            vx = 2; vy = 2;
        } else if (data.title == "vx") {
            vx = data.value;
        } else if (data.title == "vy") {
            vy = data.value;
        }
    });

    // Props
        let x = 0; let y = 0; // Center. Not Top left.
        let vx = 0; let vy = 0;
        let w = 2; let h = 4; // Unit: no. of cells i.e. 3 means 3 cells wide. Must always be even.
        let padding = 3;
        let cw, ch;
        let tl = {x: 0, y: 0};
        let level = [];
        let mf = 1; // Magnification Factor. Not to be confused with anything else.
    
    function snap(n, i) {
        if (n % i > i/2) {return ((Math.floor(n/i)*i) + i)} else if (n % i <= i/2) {return (Math.floor(n/i)*i)}
    }

    let update = () => {
        x += vx;
        y += vy;

        tl.x = (snap(x, cw) / cw) - (w/2);
        tl.y = (snap(y, ch) / ch) - (h/2);
        if (tl.x < 0) {tl.x = 0} else if (tl.x > level[0].length - 1) {tl.x = level[0].length - 1};
        if (tl.y < 0) {tl.y = 0} else if (tl.y > level.length - 1) {tl.y = level.length - 1};
    }

    let draw = () => {
        ctx.fillStyle = "rgb(156, 39, 176)";
        /*ctx.strokeStyle = "#ab20fd";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";*/
        for (let i = tl.y; i < tl.y + h + padding; i++) {
            for (let j = tl.x; j < tl.x + w + padding; j++) {
                try {
                    if (level[i][j] == 1) {
                        ctx.fillRect( (j*cw-x)*mf, (i*ch-y)*mf, cw*mf, ch*mf );
                    }
                } catch (error) {}
            }
        }
    }

    let run = () => {
        update();
        draw();
    }

    return {
        run: run
    }

});
