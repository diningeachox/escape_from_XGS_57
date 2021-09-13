
function drawStruct(ctx, l, k, n, m){
    var x = (l + k + 1) * tilewidth - x_offset;
    var y = y_offset + (l - k) * (tilewidth / 2);
    c.fillRect(x - tilewidth/2, y - d*height - tilewidth/2, 30, 30);
}
function drawButton(ctx, x, y, index, name, color){
    c2.fillStyle = color;
    c2.fillRect(x, y, 50, 50);
    c2.font = "10px arial";
    c2.fillStyle = "black";
    c2.fillText(name, x, y + 20);
}

function drawPanel(left, top, b){
    if (b != null){
        var build = entities[b[1]];
        var ind = b[0];
        if (ind != -1){
            if (ind == 3) drawFurnace(left, top);
            if (ind == 6) drawLaunch(left, top);
            text = "Turn on";
            if (build.components.status.value.top() == "on") text = "Turn off";
            drawButton(c2, left + 20, top + 80, 1, text, "white");
        }
        if (currentPanelButton != -1){
            c2.fillStyle = "rgb(0, 255, 0, 0.4)"; //Transparent green
            c2.fillRect(left + 20 + 60 * (currentPanelButton % 4), top + 20 + Math.floor(currentPanelButton / 4) * 60, 50, 50);
        }
    }

}

function drawBuild(left, top){
    //Draw buttons
    drawButton(c2, left + 20, top + 20, 1, "Generator", "white");
    drawButton(c2, left + 80, top + 20, 1, "Mine", "white");
    drawButton(c2, left + 140, top + 20, 1, "Pump", "white");
    drawButton(c2, left + 200, top + 20, 1, "Furnace", "white");
    drawButton(c2, left + 260, top + 20, 1, "Platform", "white");
    drawButton(c2, left + 320, top + 20, 1, "Fan", "white");
    drawButton(c2, left + 20, top + 80, 1, "Launchpad", "white");
    if (currentButton != -1 && currentButton < 10){
        c2.fillStyle = "rgb(0, 255, 0, 0.4)"; //Transparent green
        c2.fillRect(left + 20 + 60 * (currentButton % 6), top + 20 + Math.floor(currentButton / 6) * 60, 50, 50);
    }
}

function drawFurnace(left, top){
    //Draw buttons
    drawButton(c2, left + 20, top + 20, 1, "Steel", "white");
    drawButton(c2, left + 80, top + 20, 1, "Aluminum", "white");
    drawButton(c2, left + 140, top + 20, 1, "Plastic", "white");
    drawButton(c2, left + 200, top + 20, 1, "Dynamite", "white");
}

function drawLaunch(left, top){

    drawButton(c2, left + 20, top + 20, 1, "Build Rocket", "white");
    if (currentButton != -1){
        c2.fillStyle = "rgb(0, 255, 0, 0.4)"; //Transparent green
        c2.fillRect(left + 20 + 60 * (currentButton % 6), top + 20 + Math.floor(currentButton / 6) * 60, 50, 50);
    }
}

function drawPause(b){
    if (b){
        ol.fillStyle = "rgb(0, 0, 0, 0.5)"; //Transparent black
        ol.fillRect(0, 0, overlay.width, overlay.height);
        ol.font = "50px arial";
        ol.fillStyle = "white";
        ol.fillText("PAUSED", overlay.width / 2 - 100, overlay.height / 2);
    }
}



function drawEnd(mode){
    var text = "WITH YOUR REMOTE CONTROL SKILLS AND RESOURCEFULNESS, WE HAVE ESCAPED!!";
    if (mode === "water"){
        text = "YOU RAN OUT OF WATER AND ARE THEREFORE STRANDED FOREVER ON THIS DREADED PLANET...";
    }
    if (mode === "drown"){
        text = "THE WATER HAS SWALLOWED UP OUR BUILDINGS, ALONG WITH OUR HOPES OF A PROMOTION...";
    }
    ol.fillStyle = "rgb(0, 0, 0, 0.3)"; //Transparent black
    ol.fillRect(0, 0, overlay.width, overlay.height);
    ol.font = "30px arial";
    ol.fillStyle = "white";

    var maxWidth = 3 * overlay.width / 4;
    var lineHeight = 50;
    var rectHeight=10;
    const words =  text.split(' ');
    drawWords(ol, text, overlay.width / 4 - 100, 150, maxWidth, lineHeight,rectHeight,words);

}


function drawMenu(){
    ol.clearRect(0, 0, overlay.width, overlay.height);
    ol.fillStyle = "black"; //Transparent black
    ol.fillRect(0, 0, overlay.width, overlay.height);

    ol.strokeStyle = "white";
    ol.lineWidth = 5;
    ol.strokeRect(0, 0, overlay.width, overlay.height);
    ol.font = "50px arial";
    ol.fillStyle = "white";

    ol.fillText("ESCAPE FROM XGS-57", overlay.width / 2 - 280, 100);

    //buttons

    var startbutton = new Button(overlay, ol, {x:overlay.width / 2 - 150, y:200, width:300, height:100},
       "PLAY", (function(){ state = "play"; ol.clearRect(0, 0, overlay.width, overlay.height);}));
    startbutton.draw();
    var ibutton = new Button(overlay, ol, {x:overlay.width / 2 - 150, y:400, width:300, height:100},
       "INSTRUCTIONS", (function(){ drawIns(0);}));
    ibutton.draw();
}

function Button(can, ctx, rect, text, f){
    this.c = ctx;
    //The rectangle should have x,y,width,height properties
    this.rect = rect;
    this.text = text;
    //Binding the click event on the canvas
    this.can = can;
    this.can.addEventListener('click', function(evt) {
        var mousePos = getMousePos(can, evt);

        if (inside(mousePos, rect) && state === "menu") {
            f.call(); //Exectue the button's function
        }
    }, false);
}


Button.prototype.draw = function(){
    this.c.strokeStyle = "white";
    this.c.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    this.c.font = "30px arial";
    this.c.fillText(this.text, this.rect.x + (this.rect.width / 2) - 9 * this.text.length, this.rect.y + (this.rect.height / 2) + 10);
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function inside(pos, rect){
  //Function to check whether a point is inside a rectangle
    return pos.x > rect.x && pos.x < rect.x + rect.width
    && pos.y < rect.y + rect.height && pos.y > rect.y;

}

function message(text){
    c1.font = "36pt arial";
    c1.fillStyle = "red";
    c1.fillText(text, layer1.width / 2 - 250, layer1.height / 2);
    message_countdown = 1;
}


function drawIns(i){

    ol.clearRect(0, 0, overlay.width, overlay.height);
    if (i == 0) render(1); //Draw game scene (still)

    //Draw explanation screen
    ol.fillStyle = "rgb(255, 255, 0, 0.65)";

    var x = overlay.width / 2;
    var y = 120;
    ol.fillRect(x - 10, y - 50, overlay.width / 2, overlay.height / 2 + 70);
    ol.fillStyle = "black";
    ol.font = '12pt courier new';
    var maxWidth = overlay.width / 2;
    var lineHeight = 20;
    var rectHeight=10;
    const words =  screens[i].split(' ');
    drawWords(ol, screens[i], x, y, maxWidth, lineHeight,rectHeight,words)
    //ol.fillText = screens[i];
    ol.fillStyle = "white";
    if (i < 6){
      var next = new Button(overlay, ol, {x:overlay.width - 140, y:overlay.height - 220, width:120, height:60},
         "NEXT", (function(){ drawIns(i+1);}));
      next.draw();
    } else {
      var next = new Button(overlay, ol, {x:overlay.width - 140, y:overlay.height - 220, width:120, height:60},
         "PLAY", (function(){ state = "play"; ol.clearRect(0, 0, overlay.width, overlay.height);}));
      next.draw();
    }
}

var screens = [
  "Well...you did it. You managed to crash the spaceship in the safest, most " +
  "boring part of the galaxy. Now we're on this godforsaken planet XGS-57 and "+
  "the whole delivery's ruined! Luckily we've still " +
  "got a generator and a pump left over. We have to remote control everything " +
  "from here and rebuild the spaceship so we can make our delivery at Rigel-7!",

  "The top bar indicates your raw resources: ore, water, and power. " +
  "Ore is needed to make essential materials for space flight at the furnace. " +
  "Water is gotten from the pumps, if we run out of water all our buildings will shut down. " +
  "Power comes from the generators and powers all the buildings. " +
  "If there's not enough power, then the building with the highest power consumption will shut " +
  "down until power is restored. (Note: power isn't stored in chunks like water, it measures the current!)" +
  "Inactive buildings are colored in red. ",

  "Click on the bottom left panel to construct buildings. Most of these buildings will " +
  "need to be built on FLAT land. If that's not possible you may need to make dynamites " +
  "to level some hills. The pump however is 1x2 tiles and must have one tile on water and one on land. " +
  "Platforms are an extension of land and must be placed next to the shore. " +
  "You can hover your cursor over each button to see the specs of that building. ",

  "Now you need to be aware that we are trapped on a water planet, with gigantic icebergs. " +
  "This means that in order to make more land, we have to build FANS to drop the water level down. " +
  "But be careful, generators and furnaces generate a lot of heat which will cause the ice caps " +
  "to melt. Then the water levels will go up again! Make sure the temperature on the top-right corner doesn't " +
  "exceed 5 degrees Celsius. You can also monitor the water level in the same corner of your screen. ",

  "The most important thing is MATERIALS! In order to manufacture materials you will need a furnace and some raw ore. " +
  "And in order to get ore you have to build mines on the land. Materials " +
  "are needed to build pretty much EVERYTHING! You can monitor them on the second top bar. " +
  "In order to access what buildings may provide, simply click on the building you want to use. " +
  "For example if you want to produce some plastic, click on any furnace and you will find what " +
  "you need in the BUILDING PANEL. Note that you always have the option in the building panel " +
  "to shut down a building voluntary (maybe you are emitting too much carbon?).",

  "Some important controls you might like to know: WASD to move the camera around, " +
  "Q and E to rotate perspectives. P to take a quick breather and pause. X to rotate a building you are about to place." +
  "C to cancel something you're about to build. Everything else is done by the mouse! ",

  "OK we gotta get moving if we want to get out of here! Our goal is to build " +
  "a launchpad, and when that's ready we build a rocket on top of it and we are good to go! " +
  "But be warned, if the water levels swallow all our buildings then it's all over!"

];

//From https://jsfiddle.net/vf8gvq7m/91/
function wrapText(context, text, x, y, maxWidth, lineHeight, rectHeight) {
    var words = text.split(' ');
    return words;
}

function drawWords(context, text, x, y, maxWidth, lineHeight, rectHeight, words) {
   var line = '';
   for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
    rectHeight=rectHeight + lineHeight;
}
