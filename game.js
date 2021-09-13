function Game(){
}

var c = canvas.getContext("2d");
var ct = canvas2.getContext("2d");
var oc = ocean.getContext("2d");
var c1 = layer1.getContext("2d");
var c2 = layer2.getContext("2d");
var c3 = layer3.getContext("2d");
var ol = overlay.getContext("2d");
function init(){
    window.requestAnimationFrame(gameLoop);
    layer2.style.top = (canvas.height - layer2.height) + "px";
    drawMenu(); //Menu screen

}

var count = 0;
var render_count = 0;
var frame_rate = 60;
MS_PER_UPDATE = 1000 / frame_rate;

var lag = 0;
var prev = Date.now();
var elapsed;

//Game states(scenes)
var state = "menu";
var p_sc = false;

//Game variables
var tilewidth = 30;
var height = tilewidth / 8 * 5;
var x_offset = 200;
var y_offset_init = 340;
var y_offset = y_offset_init;
var currentTile = [-1, -1];
var currentButton = -1;
var currentPanelButton = -1;
var currentEntity = null;
var hovered_building = null;
var selected_building = null;

var water_level = 0.1;
var d_level = 0;
var temp_init = -3;
var temp = temp_init;
var heat = 0;

//Resources and their change
var ore = 6;
var d_ore = 0;
var water = 10;
var d_water = 0;
var power = 0;
var resource_font = "12pt courier new";
var convert = [3, 4, 2, 5]; //How much ore is needed to manufacture each resource
var res = [12, 8, 10, 2];
var returned = [0, 0, 0, 0]; //Resources to be returned if player decides to undo

//UI
var select_orientation = 0;
var global_view = 0;
var buttonwidth = 40;
var message_countdown = 0;
var message_timer = 2000;
var selection = [[0, 0], [0, 0], [0, 0], [0, 0]];



var map = [
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-1,-1,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-1,0,1,1,0,1,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-1,0,1,1,1,1,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-1,0,1,1,1,2,2,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-1,0,1,2,4,2,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-1,0,4,2,2,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-1,0,2,2,2,-1,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-1,-1,2,2,2,-1,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-2,-1,0,0,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5],
[-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5,-5]
];

// Stores buildings
var buildings = new Array(map.length);
for (var i = 0; i < buildings.length; i++){
    buildings[i] = Array(map[0].length).fill([-1, "", -100]);
}

//Stores platforms
var plats = new Array(map.length);
for (var i = 0; i < plats.length; i++){
    plats[i] = Array(map[0].length).fill(-100);
}

// Stores build times
var build_time = new Array(map.length);
for (var i = 0; i < build_time.length; i++){
    build_time[i] = Array(map[0].length).fill(0);
}

//Data storing the buildable structures:
// Name, Costs(steel, plastic), Build time, Build restrictions
buildables = [
    {name: "Generator", res: [1, 0, 1, 0], build_time: 300, index: 0, size: 11, color: "rgba(105, 105, 50, 1)"},
    {name: "Mine", res: [2, 2, 0, 0], build_time: 420, index: 1, size: 11, color: "rgba(50, 50, 50, 1)"},
    {name: "Pump", res: [1, 1, 1, 0], build_time: 340, index: 2, size: 12, color: "rgba(120, 100, 0, 1)"},
    {name: "Furnace", res: [5, 0, 2, 0], build_time: 480, index: 3, size: 11, color: "rgba(100, 20, 100, 1)"},
    {name: "Platform", res: [0, 0, 2, 0], build_time: 300, index: 4, size: 12, color: "rgba(255, 255, 255, 1)"},
    {name: "Fan", res: [1, 0, 2, 0], build_time: 500, index: 5, size: 11, color: "rgba(255, 255, 0, 1)"},
    {name: "Launchpad", res: [10, 10, 12, 5], build_time: 1200, index: 6, size: 33, color: "rgba(105, 105, 255, 1)"}
];
consumption = [[0, 0.1, 0.3, 0.5],
              [-0.3, 0.1, -0.1, 0.1],
              [0.0, -0.3, -0.1, 0.3],
              [0.2, 0.1, -0.2, 1.2],
              [0, 0, 0, 0],
              [0.0, 0.0, -0.3, -0.2],
              [0.0, 0.5, -0.5, 0]
            ]

var current_build = null; //The strcture that the cursor is currently holding

var units = [];
var entities = {};

//Starting generator and pump
building = new ECS.Entity();
building.addComponent( new ECS.Components.Type("build"));
building.addComponent( new ECS.Components.Consumption(consumption[0]));
building.addComponent( new ECS.Components.Status());
building.addComponent( new ECS.Components.Size(11));
building.addComponent( new ECS.Components.Tile([11,8]));
buildings[11][8] = [0, building.id, 2];
entities[building.id] = building;

building = new ECS.Entity();
building.addComponent( new ECS.Components.Type("build"));
building.addComponent( new ECS.Components.Consumption(consumption[2]));
building.addComponent( new ECS.Components.Status());
building.addComponent( new ECS.Components.Size(12));
building.addComponent( new ECS.Components.Tile([11,9]));
buildings[11][10] = [2, building.id, 2];
buildings[11][9] = [2, building.id, 2];
entities[building.id] = building;

ECS.entities = entities;

tile = (x,y, colour, c) => {
    c.strokeStyle = colour;
    c.beginPath();
    c.moveTo(x-tilewidth, y);
    c.lineTo(x, y-(tilewidth/2));
    c.lineTo(x+tilewidth, y);
    c.lineTo(x, y+(tilewidth/2));
    c.closePath();
    c.stroke();
    c.fillStyle = colour;
    c.fill();
}
column = (x,y, colour, depth, c, width) => {
    draw_height = depth * height;
    c.strokeStyle="rgb(50, 50, 50)";
    c.beginPath();
    c.moveTo(x-width, y);
    c.lineTo(x, y+(width/2));
    c.lineTo(x, y+(width/2) + draw_height);
    c.lineTo(x-width, y + draw_height);
    c.closePath();
    c.stroke();
    c.fillStyle = colour;
    c.fill();

    c.beginPath();
    c.moveTo(x, y+(width/2));
    c.lineTo(x, y+(width/2) + draw_height);
    c.lineTo(x+width, y + draw_height);
    c.lineTo(x+width, y);
    c.closePath();
    c.stroke();
    c.fillStyle = colour;
    c.fill();
}

function getTile(x, y, depth){
    // Get tile coordinates assuming depth is 0
    depth_height = depth * height;
    tileX = 0.5 * (x + x_offset + 2 * (y - y_offset + depth_height) - tilewidth) / tilewidth;
    tileY = 0.5 * (x + x_offset - 2 * (y - y_offset + depth_height) - tilewidth) / tilewidth;
    tileX = Math.floor(tileX + 0.5);
    tileY = Math.floor(tileY + 0.5);
    return [tileX, tileY, depth];
}

function inBounds(i, j){
    return (i >= 0) && (i < map.length) && (j >= 0) && (j < map[0].length);
}

function select(e){
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    for(depth = 5; depth > -6; depth--){
        tempTile = getTile(mouseX, mouseY, Math.max(depth, water_level));
        if (inBounds(tempTile[0], tempTile[1]) && map[tempTile[0]][tempTile[1]] == depth){
            currentTile = tempTile;
            var b = buildings[currentTile[0]][currentTile[1]];
            if (b[0] != -1){ //Building here
                hovered_building = b;
            }
            break;
        }
    }
}

function select_panel(e){
    var rect = layer2.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    for (var i = 0; i < 7; i++){
        var a = i % 6;
        var b = Math.floor(i / 6);
        if (mouseX < 70 + (buttonwidth + 20) * a && mouseX > 20 + (buttonwidth + 20) * a && mouseY < 60 * b + 70 && mouseY > 60 * b + 20) {
            return i;
        }
    }
    for (var i = 0; i < 4; i++){
        var a = i % 6;
        var b = Math.floor(i / 6);
        if (mouseX < 770 + (buttonwidth + 20) * a && mouseX > 720 + (buttonwidth + 20) * a && mouseY < 60 * b + 70 && mouseY > 60 * b + 20) {
            return i + 10;
        }
    }
    return -1;
}

//userInput
//Event listeners
document.addEventListener('mousemove', function(e){
    select(e);
    currentButton = select_panel(e);
    var rect = layer2.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    var mouseY = e.clientY - rect.top;
    currentPanelButton = -1;
    for (var i = 0; i < 5; i++){
        var a = i % 4;
        var b = Math.floor(i / 4);
        if (mouseX < 510 + (buttonwidth + 20) * a && mouseX > 460 + (buttonwidth + 20) * a && mouseY < 60 * b + 70 && mouseY > 60 * b + 20) {
            currentPanelButton = i;
        }
    }
    //Building being selected for building follows the cursor
    if (current_build != null){
        c1.clearRect(0, 0, layer1.width, layer1.height);
        var rect = layer1.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        c1.font = "12px arial";
        c1.fillStyle = "black";
        if (current_build != "d"){
            c1.fillStyle = "white";
            c1.fillRect(mouseX, mouseY, 30, 30);
            c1.fillText(current_build.name, mouseX, mouseY + 10);
        } else {
            c1.beginPath();
            c1.moveTo(mouseX - tilewidth / 2, mouseY - tilewidth / 2);
            c1.lineTo(mouseX + tilewidth / 2, mouseY + tilewidth / 2);
            c1.lineWidth = 10;
            c1.strokeStyle = "red";
            c1.stroke();

            c1.fillStyle = "black";
            c1.fillText("Dynamite", mouseX, mouseY - 10);
        }

    }
})

//Clicking buttons and tiles
document.addEventListener('mousedown', function(e){
    if (hovered_building != null) selected_building = hovered_building;
    //Panel button effects
    var pb = currentPanelButton;
    if (pb != -1 && pb != 4 && selected_building != null){
        var b = entities[selected_building[1]];
        if (b.components.status.value.top() != "on"){
            message("The building is not operational!");
        } else {
            if (selected_building[0] == 3){
                if (pb < 4 && ore >= convert[pb]){
                    ore -= convert[pb];
                    res[pb] += 1;
                } else if (ore < convert[pb]){
                    message("Not enough ore!");
                }
            } else if (selected_building[0] == 6){
                if (pb == 0) {
                    if (res[0] >= 10 && res[1] >= 10 && res[2] >= 10 && res[3] >= 5){
                        state = "end";
                        drawEnd("rocket");
                    } else {
                        message("Not enough materials!");
                    }
                }
            }
        }
    }
    if (pb == 4 && selected_building != null){ //Switch building on and off
       var b = entities[selected_building[1]];
       if (b.components.status.value.top() === "on"){
          b.components.status.value.push("off");
       } else if (b.components.status.value.top() === "off"){
          b.components.status.value.pop();
       }
    }
    if (currentButton != -1 && current_build == null){
        if (currentButton == 10) { //Dynamite
            if (res[3] > 0){
                current_build = "d";
                res[3] -= 1;
                returned = [0, 0, 0, 1];
            } else {
                message("You don't have any dynamite!")
            }
        } else {
            build = buildables[currentButton];
            if (res[0] >= build.res[0] && res[1] >= build.res[1] && res[2] >= build.res[2]){
                res[0] -= build.res[0];
                res[1] -= build.res[1];
                res[2] -= build.res[2];
                returned = [build.res[0], build.res[1], build.res[2], 0];
                current_build = build;
                //selection = [];
                //Add four corners of selection in CW order
                var maxY = Math.floor(current_build.size / 10) - 1;
                var maxX = current_build.size % 10 - 1;
                selection[(global_view + 2) % 4] = [0, 0];
                selection[(global_view + 3) % 4] = [maxX, 0];
                selection[global_view] = [maxX, maxY];
                selection[(global_view + 1) % 4] = [0, maxY];
                /*
                for (i = 0; i < Math.floor(current_build.size / 10); i++){
                    for (j = 0; j < current_build.size % 10; j++){
                        selection.push([i, j]);
                    }
                }
                */
            } else {
                message("Not enough materials!");
            }
        }

    } else if (current_build != null) {
        if (current_build === 'd'){
            var k = currentTile[0];
            var l = currentTile[1];
            if (map[k][l] >= water_level && buildings[k][l][0] == -1){
                map[k][l] -= 1; //Lower height
                plats[k][l] -= -100; //Destroy platform
                //Destroy all surrounding platforms
                if (in_bound(k + 1, j)) plats[k+1][j] = -100;
                if (in_bound(k, j + 1)) plats[k][j + 1] = -100;
                if (in_bound(k - 1, j)) plats[k-1][j] = -100;
                if (in_bound(k, j - 1)) plats[k][j - 1] = -100;
            }
        } else if (can_build(currentTile[0], currentTile[1], select_orientation, current_build.index == 2 || current_build.index == 4)){
            //Add entity associated to building
            var x = current_build.size % 10;
            var y = Math.floor(current_build.size / 10);
            building = new ECS.Entity();
            building.addComponent( new ECS.Components.Type("build"));
            building.addComponent( new ECS.Components.Consumption(consumption[current_build.index]));
            building.addComponent( new ECS.Components.Status());
            building.addComponent( new ECS.Components.Size(current_build.size));
            building.addComponent( new ECS.Components.Tile([currentTile[0], currentTile[1]]));
            entities[building.id] = building;

            var maxX = selection[0][0 + select_orientation];
            var maxY = selection[0][1 - select_orientation];
            var max = -100;
            for (var i = 0; i <= maxY; i++){
                for (var j = 0; j <= maxX; j++){
                    if (in_bound(currentTile[0] + i, currentTile[1] + j) &&
                    map[currentTile[0] + i][currentTile[1] + j] > max) max = map[currentTile[0] + i][currentTile[1] + j];
                    if (in_bound(currentTile[0] + i, currentTile[1] + j) &&
                    plats[currentTile[0] + i][currentTile[1] + j] > max) max = plats[currentTile[0] + i][currentTile[1] + j];
                }
            }
            for (var i = 0; i <= maxY; i++){
                for (var j = 0; j <= maxX; j++){
                    if (current_build.index == 4){ //platform
                        if (map[currentTile[0] + i][currentTile[1] + j] < water_level){
                            buildings[currentTile[0] + i][currentTile[1] + j] = [current_build.index, building.id, max];
                            build_time[currentTile[0] + i][currentTile[1] + j] = current_build.build_time;
                        }
                    } else {
                        buildings[currentTile[0] + i][currentTile[1] + j] = [current_build.index, building.id, max];
                        build_time[currentTile[0] + i][currentTile[1] + j] = current_build.build_time;
                    }
                }
            }
            selection = [[0, 0]];

        } else if (!can_build(currentTile[0], currentTile[1], select_orientation, current_build.index == 2 || current_build.index == 4)){
            cancel();
        }
        current_build = null;
        c1.clearRect(0, 0, layer1.width, layer1.height);
    }
})

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 65) { //A key
        x_offset = Math.max(x_offset - 10, 0);
    }
    else if(e.keyCode == 68) { //D key
        x_offset = Math.min(x_offset + 10, canvas.width / 2);
    }
    else if(e.keyCode == 83) { //S key
        y_offset = Math.max(y_offset - 10, 0);
    }
    else if(e.keyCode == 87) { //W key
        y_offset = Math.min(y_offset + 10, canvas.height);
    }
    else if(e.keyCode == 81) { //Q key (rotate map counterclockwise)
        //Rotate counterclockwise 3 times
        for (var i = 0; i < 3; i++){
            map = rotateMap(map);
            buildings = rotateMap(buildings);
            plats = rotateMap(plats);
            build_time = rotateMap(build_time);
            global_view = (global_view + 1) % 4; //Change the global view
        }
    }
    else if(e.keyCode == 69) { //E key (rotate map clockwise)
        map = rotateMap(map);
        buildings = rotateMap(buildings);
        build_time = rotateMap(build_time);
        plats = rotateMap(plats);
        global_view = (global_view + 1) % 4; //Change the global view
    }
    else if(e.keyCode == 88) { //X key (rotate building placement)
        select_orientation = (select_orientation + 1) % 2;
    }
    else if(e.keyCode == 67){ //C key (cancel build)
        cancel();
    }
    else if(e.keyCode == 80) { //P key
        console.log(state);
        if (state === "play") {
            state = "pause";
            p_sc = true;
        } else if (state === "pause") {
            state = "play";
            ol.clearRect(0, 0, overlay.width, overlay.height);
        }
    }
    //Debug only
    else if(e.keyCode == 38) { //up key (raise water level)
        water_level += 0.1;
    }
    else if(e.keyCode == 40) { //down key (lower water level)
        water_level -= 0.1;
    }
});

//Rendering
function render(delta){
    render_count += 1;

    oc.clearRect(0, 0, ocean.width, ocean.height);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c2.clearRect(0, 0, canvas.width, canvas.height);
    ct.clearRect(0, 0, canvas2.width, canvas2.height);

    //Draw bg iceberg
    c.fillStyle = "rgb(210, 220, 255)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    var x = (map.length + 1) * tilewidth - x_offset;
    var y = y_offset + (-1 * map.length) * (tilewidth / 2);
    column(x - tilewidth, y + (20- water_level)*height, rgb(20, 10, 85), 20, oc, map.length * tilewidth);

    shimmer(x - tilewidth, y - water_level*height, ocean, oc);
    // Draw tiles starting from the bottom-right corner of the map matrix

    for(j = map[0].length * 2 - 2; j >= 0; j--){
        index = Math.max(0, j - map[0].length + 1);
        for(i = index; i <= j - index; i++){
            var k = j-i;
            var l = map[0].length - i - 1;
            var d = map[l][k];
            var x = (l + k + 1) * tilewidth - x_offset;
            var y = y_offset + (l - k) * (tilewidth / 2);
            var gradient = Math.floor(j * 1.4);
            // Draw platforms


            if (d < water_level) {
                tile(x, y - d*height, rgb(170 + gradient, 130 + gradient, 70 + gradient), c);
            } else {
                column(x, y - d*height, rgb(170 + gradient, 90 + gradient, 70 + gradient), d - water_level, ct, tilewidth);
                tile(x, y - d*height, rgb(170 + gradient, 130 + gradient, 70 + gradient), ct);
            }

            var p = plats[l][k];
            if (p < water_level && p >= d){
                tile(x, y - p*height, rgb(190 + gradient, 190 + gradient, 190 + gradient), c);
            } else if (p >= water_level){
                column(x, y - p*height, rgb(170 + gradient, 170 + gradient, 170 + gradient), 1, ct, tilewidth);
                tile(x, y - p*height, rgb(190 + gradient, 190 + gradient, 190 + gradient), ct);
            }

            //Draw selector
            var in_sel = in_selection(currentTile[0], currentTile[1], l, k, select_orientation);
            if (in_sel[0]){
                var max = in_sel[1];
                if (current_build != null){
                    if (current_build != 'd'){
                        if (can_build(currentTile[0], currentTile[1], select_orientation, current_build.index == 2 || current_build.index == 4)){
                            //Green selector means can build
                            tile(x, y - height*max, "rgb(0, 255, 0, 0.5)", ct);
                        } else {
                            //Red selector means can't build
                            tile(x, y - height*max, "rgb(255, 0, 0, 0.5)", ct);
                        }
                    } else {
                        if (map[currentTile[0]][currentTile[1]] >= water_level && buildings[currentTile[0]][currentTile[1]][0] == -1){
                            tile(x, y - height*max, "rgb(0, 255, 0, 0.5)", ct);
                        } else {
                            //Red selector means can't build
                            tile(x, y - height*max, "rgb(255, 0, 0, 0.5)", ct);
                        }
                    }

                } else {
                    var h = Math.max(plats[currentTile[0]][currentTile[1]], currentTile[2]);
                    tile(x, y - h*height, "rgb(255, 255, 0, 0.5)", ct);
                }
            }

            //Draw building
            var b = buildings[l][k];
            if (b[0] != -1){
                var time = build_time[l][k];
                if (time == 0){
                    if (b[0] != 4){
                        var color = buildables[b[0]].color;
                        if (entities[b[1]].components.status.value.top() != "on") color = "rgba(255, 0, 0, 1)";
                        drawCube(ct, x, y - b[2]*height + tilewidth / 4, tilewidth / 2, tilewidth / 2, tilewidth, color);
                    }
                } else {
                    ct.strokeStyle = 'green';
                    ct.lineWidth = 3;
                    ct.beginPath();
                    ct.rect(x - tilewidth/2, y - b[2]*height - tilewidth/2, 30, 30);
                    ct.stroke();
                    ct.fillStyle = "green"; //Draw arc showing building progress
                    ct.beginPath();
                    ct.moveTo(x, y - b[2]*height);
                    ct.arc(x, y - b[2]*height, tilewidth / 4, 0, 2 * Math.PI * time / buildables[b[0]].build_time);
                    ct.lineTo(x, y - b[2]*height);
                    ct.closePath();
                    ct.fill();
                    ct.lineWidth = 1;
                }
                ct.font = "18px verdana";
                ct.fillStyle = "white";
                ct.strokeStyle = "black";
                ct.lineWidth = 0.5;
                ct.fillText(buildables[b[0]].name, x - tilewidth, y - b[2]*height - tilewidth/2);
                ct.strokeText(buildables[b[0]].name, x - tilewidth, y - b[2]*height - tilewidth/2);
            }
        }
    }

    //Draw Resource and status bar
    c3.fillStyle = "black";
    c3.fillRect(0, 0, canvas.width, 30);
    c3.fillStyle = "brown";
    c3.fillRect(0, 30, canvas.width, 25);

    //Write Resources
    c3.font = resource_font;
    c3.fillStyle = "white";
    c3.fillText("Ore: " + Math.round(ore * 100) / 100 + "(" + Math.round(d_ore * 100) / 100 + ")", 40, 25);
    c3.fillText("Water: " + Math.round(water * 100) / 100 + "(" + Math.round(d_water * 100) / 100 + ")", 160, 25);
    c3.fillText("Power: " + Math.round(power * 10) / 10, 340, 25);
    c3.fillStyle = "rgb(150, 150, 255)";
    c3.fillText("Water Level:" + Math.round(water_level * 1000) / 100 + " m " + "(" + Math.round(d_level * 1000) / 100 + " m)", 520, 25);
    //Temperature
    c3.fillStyle = "rgb(255, 90, 90)";
    c3.fillText("Temperature:" + Math.round(temp * 10) / 10 + " C ", 800, 25);

    c3.fillStyle = "rgb(255, 255, 0)";
    c3.fillText("Steel: " + res[0], 40, 50);
    c3.fillText("Aluminum: " + res[1], 180, 50);
    c3.fillText("Plastic: " + res[2], 320, 50);
    c3.font = "9pt courier new";
    c3.fillText("1 Steel = " + convert[2] + " ore, " + "1 Aluminum = " + convert[1] + " ore, " + "1 Plastic = " + convert[2] + " ore, " + "1 Dynamite = " + convert[3] + " ore  ", 460, 50);


    //Draw controls layer
    var top = 0;
    var left = 0;
    c2.fillStyle = "gray";
    c2.fillRect(left, top, canvas.width - 20, 200);
    c2.fillStyle = "rgb(50, 50, 50)";
    c2.fillRect(left, top, canvas.width - 20, 16);
    c2.font = "9pt courier new";
    c2.fillStyle = "white";
    c2.fillText("Construction", 160, 12);

    //Write Costs
    if (currentButton != -1 && currentButton != 10){
        var con = consumption[currentButton];
        var resources = buildables[currentButton].res;
        c2.fillStyle = "black";
        c2.fillText("Costs: ", 80, 80);

        c2.fillText("Steel: " + resources[0] + ", Aluminum: " + resources[1] + ", Plastic: " + resources[2] + ", Dynamite: " + resources[3], 80, 95);

        c2.fillText("Effects: ", 80, 110);
        c2.fillText("Ore: " + con[0] + ", Water: " + con[1] + ", Power: " + con[2] + ", Heat: " + con[3] + " C", 80, 125);
    }

    //Building info
    c2.fillStyle = "rgb(20, 135, 0)";
    c2.fillRect(left + 440, top, canvas.width - 440, 200);

    c2.fillStyle = "rgb(5, 95, 0)";
    c2.fillRect(left + 440, top, canvas.width - 20, 16);
    c2.font = "9pt courier new";
    c2.fillStyle = "white";
    c2.fillText("Building Panel", 90 + 440, 12);

    c2.fillStyle = "orange";
    c2.fillRect(left + 700, top, canvas.width - 520, 200);

    c2.fillStyle = "rgb(155, 125, 0)";
    c2.fillRect(left + 700, top, canvas.width - 20, 16);
    c2.font = "9pt courier new";
    c2.fillStyle = "white";
    c2.fillText("Gadgets", 130 + 700, 12);

    drawBuild(left, top);
    drawPanel(left + 440, top, selected_building);
    //Draw items
    var color = "gray";
    if (res[3] > 0) color = "white";
    drawButton(c2, left + 720, top + 20, 1, "Dynamite (x" + res[3] + ")", color);
    if (currentButton >= 10){
        c2.fillStyle = "rgb(0, 255, 0, 0.4)"; //Transparent green
        c2.fillRect(left + 720 + 60 * (currentButton % 10), top + 20, 50, 50);
    }
    //Render entities
    ECS.systems.render(ECS.entities, delta);
}

var z = 0.1;
var dir = 1;
function update(delta){
    z += 0.01 * dir;
    if (z == 0.9) dir = -1;
    else if (z == 0) dir = 1;
    //console.log(message_timer);
    message_timer -= message_countdown * delta * MS_PER_UPDATE;
    if (message_timer < 0){
        message_timer = 2000;
        message_countdown = 0;
        c1.clearRect(0, 0, layer1.width, layer1.height); //Clear the message layer
    }

    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map[0].length; j++){
            build_time[i][j] = Math.max(build_time[i][j] - delta, 0);
            var b = buildings[i][j];
            if (b[0] == 4){
                plats[i][j] = b[2];
            }
        }
    }

    //Update once per second
    if (count % frame_rate == 0) {
        //Melt the glaciers
        d_level = (Math.max(5, temp) - 5) * 0.001;
        ECS.systems.updatebuild(ECS.entities, delta);
        water_level += d_level;
        temp = temp_init + heat;
        heat = 0;
    }
    if (water <= 0) {
        state = "end";
        drawEnd("water");
    }
    if (water_level > 2){
        state = "end";
        drawEnd("water");
    }
    count+=1;
}
//Game loop
function gameLoop(current){
    if (state === "play"){
        current = Date.now();
        elapsed = current - prev;
        prev = current;
        lag += elapsed;

        while (lag >= MS_PER_UPDATE) {
            //Update
            t1 = Date.now();
            update(1);
            t2 = Date.now();
            //console.log("Time taken to update:" + (t2 - t1) + "ms.");
            lag -= MS_PER_UPDATE;
        }
        //console.log(lag);
        //Render
        render(lag / MS_PER_UPDATE);
    } else if (state === "pause"){
        drawPause(p_sc);
        //drawEnd("water");
        p_sc = false;
    } else if (state == "ins"){
        drawIns();
    }

    //window.cancelAnimationFrame(req);

    window.requestAnimationFrame(gameLoop);

}
