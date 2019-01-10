let Camera = (() => {

    GSM.registerMe("camera", (data) => {
        switch (data.title) {
            case "init":
                cw = data.cw; ch = data.ch;
                mazeWidth = data.cols*cw; mazeHeight = data.rows*ch;
                level = data.level;
                mf = game.width/w; // Yes, we favour the width
                x = (level[0].length*cw) / 2;
                y = (level.length*ch) / 2;
                break;

            case "player coords":
                x = data.x;
                y = data.y;
                break;
        }
    });

    // Props
        let x = 0; let y = 0; // Center. Not Top left. Of Player.
        let w = 30; let h = 30;
        let cw, ch;
        let level = [];
        let mf = 1; // Magnification Factor. Not to be confused with anything else.
        let tl = {x: 0, y: 0};
    
    function snap(n, i) {
        if (n % i > i/2) {return ((Math.floor(n/i)*i) + i)} else if (n % i <= i/2) {return (Math.floor(n/i)*i)}
    }

    let update = () => {
        tl.x = x - w/2;
        tl.y = y - h/2;
    }

    let draw = () => {
        ctx.fillStyle = "rgb(156, 39, 176)";
        for (let i in level) {
            for (let j in level[i]) {
                if (level[i][j] >= 1) {
                    if (level[i][j] == 2) {ctx.fillStyle = "red"} else {ctx.fillStyle = "rgb(156, 39, 176)"}
                    let a = (j*cw - tl.x)*mf; 
                    let b = (i*ch - tl.y)*mf; 
                    let c = cw*mf; 
                    let d = ch*mf;
                    if (a >= 0 || a <= game.width || b >= 0 || b <= game.height) {
                        ctx.fillRect(a, b, c, d);
                    }
                }
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
