let Lvl = (() => {

    GSM.registerMe("lvl", (data) => {
    });

    // Props
        let level = [];
        for (let i = 0; i < 20; i++) {
            level.push( [] );
            for (let j = 0; j < 20; j++) {
                if (Math.random() < 0.5) {level[i][j] = 1} else {level[i][j] = 0}
            }
        }

        let cw = 50; let ch = 50;
        let cam = Camera();
        GSM.postMsg("camera", {title: "init", cw: cw, ch: ch, level: level});

    let run = () => {
        //update();
        //draw();
        cam.run();
    }

    return {
        run: run
    }

});
