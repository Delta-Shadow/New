// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let game = {
    width: 360,
    height: 640,
    roller: 0,
    mode: "play",
    bg: "black"
}

window.addEventListener("resize", OnResizeCalled, false);
window.addEventListener("orientationchange", OnResizeCalled, false);  
document.addEventListener("touchstart", touchInput, false);
document.addEventListener("mousedown", mouseInput, false);

function OnResizeCalled() { 
    canvas.style.width = window.innerWidth + 'px'; 
    canvas.style.height = window.innerHeight + 'px'
    
    var gameWidth = window.innerWidth; 
    var gameHeight = window.innerHeight; 
    var scaleToFitX = gameWidth / game.width; 
    var scaleToFitY = gameHeight / game.height; 
     
    var currentScreenRatio = gameWidth / gameHeight; 
    var optimalRatio = Math.min(scaleToFitX, scaleToFitY); 
     
    if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) { 
        canvas.style.width = gameWidth + "px"; 
        canvas.style.height = gameHeight + "px"; 
    } 
    else { 
        canvas.style.width = game.width * optimalRatio + "px"; 
        canvas.style.height = game.height * optimalRatio + "px"; 
    } 
}

function touchInput(e) {
    e.preventDefault();
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    if (game.mode == "play") {
        handlePlayerInput(x, y)
    }
}

function mouseInput(e) {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;   
    if (game.mode == "play") {
        handlePlayerInput(x, y)
    }
}

function handlePlayerInput(x, y) {
    if (x < window.innerWidth/2 && y < window.innerHeight/2) {  /*Top Left*/
        GSM.postMsg("player", "move top left"); 
        GSM.postMsg("camera", "move top left"); 
    }
    if (x > window.innerWidth/2 && y < window.innerHeight/2) { /*Top Right*/
        GSM.postMsg("player", "move top right"); 
        GSM.postMsg("camera", "move top right"); 
    }
    if (x < window.innerWidth/2 && y > window.innerHeight/2) { /*Bottom Left*/  
        GSM.postMsg("player", "move bottom left"); 
        GSM.postMsg("camera", "move bottom left"); 
    }
    if (x > window.innerWidth/2 && y > window.innerHeight/2) { /*Bottom Right*/ 
        GSM.postMsg("player", "move bottom right"); 
        GSM.postMsg("camera", "move bottom right"); 
    }
}

OnResizeCalled();	

let lvl = Lvl();
let player = Player();

function roll() {
    game.roller = requestAnimFrame(roll);
    ctx.clearRect(0, 0, game.width, game.height);
   
    ctx.fillStyle = game.bg;
    ctx.fillRect(0, 0, game.width, game.height);

    lvl.run();

    if (game.mode == "play") {
        player.run();
    }
}

GSM.registerMe("main", (data) => {
});

roll();
