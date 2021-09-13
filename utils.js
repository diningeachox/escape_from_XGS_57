/* Priority Queue: Implemented by a max heap */
function PQueue(){
    //Format is (key, value) for each array entry
    //this.data = new Array(1, 2);
    //this.data[0] = [0, Infinity];
    this.data = [];
    this.data.push([0, Infinity]);
}

PQueue.prototype.size = function(){
    return this.data.length - 1;
}

PQueue.prototype.insert = function(x, p){
    //Insert a new item to the end of the array
    var pos = this.data.length;
    this.data.push([x, p]);
    //Percolate up
    while(pos / 2 > 0 && this.data[pos][1] > this.data[Math.floor(pos / 2)][1]){
        temp = this.data[Math.floor(pos / 2)];
        this.data[Math.floor(pos / 2)] = this.data[pos];
        this.data[pos] = temp;
        pos = Math.floor(pos / 2);
    }
}

PQueue.prototype.pop = function(){
    //Remove head of Array and replace it with the last element
    if (this.data.length > 1){
        var removed = this.data[1];
        this.data[1] = this.data[this.data.length - 1];
        this.data = this.data.splice(0, this.data.length - 1);
        //Percolate down
        var pos = 1;
        while(pos * 2 < this.data.length){
            minChild = this.minChild(pos);
            if (this.data[pos][1] < this.data[minChild][1]){
                temp = this.data[pos];
                this.data[pos] = this.data[minChild];
                this.data[minChild] = temp;
            }
            pos = minChild;

        }
        return removed;
    }
    throw "Tried to pop from empty priority queue!";

}

PQueue.prototype.top = function(){
    //Remove head of Array and replace it with the last element
    if (this.data.length > 1) return this.data[1];
    throw "Priority queue is empty!"
}

PQueue.prototype.minChild = function(i){
    if (i * 2 + 1 > this.data.length - 1)
        return i * 2;
    if (this.data[i*2][1] > this.data[i*2+1][1])
        return i * 2;
    return i * 2 + 1;
}

PQueue.prototype.isEmpty = function(){
    return this.data.length <= 1;
}

function Vec2d(x, y){
    this.x = x;
    this.y = y;
}

Vec2d.prototype.add = function(v){
    return new Vec2d(this.x + v.x, this.y + v.y);
}

Vec2d.prototype.subtract = function(v){
    return new Vec2d(this.x - v.x, this.y - v.y);
}

Vec2d.prototype.multiply = function(s){
    return new Vec2d(this.x * s, this.y * s);
}

Vec2d.prototype.dot = function(v){
    return this.x * v.x + this.y * v.x;
}

Vec2d.prototype.project = function(w){
    return w.multiply(this.dot(w) * (1.0 / (this.length() * w.length())));
}

Vec2d.prototype.length = function(){
    return Math.sqrt(this.x ** 2+ this.y ** 2);
}

Vec2d.prototype.normalize = function(){
    length = this.length();
    return new Vec2d(this.x / length, this.y / length);
}

function Queue(){
    this.data = [];
}

Queue.prototype.push = function(x){
    this.data.push(x);
}

Queue.prototype.top = function(){
    if (this.data.length == 0){
        return "idle";
    }
    return this.data[0];
}

Queue.prototype.pop = function(){
    return this.data.splice(0, 1);
}

Queue.prototype.isEmpty = function(){
    return (this.data.length == 0);
}

//Game functions
//Rotate game map clockwise
function rotateMap(grid){
    var rowLength = grid[0].length;
    //Fill new matrix with same size as map full of 0's
    var newGrid = new Array(rowLength).fill(0).map(() => new Array(rowLength).fill(0));

    for (var i = 0; i < grid.length; i++){
        for (var j = 0; j < rowLength; j++){
          //Clockwise rotation
            var newX = rowLength - i - 1;
            var newY = j;

            newGrid[newY][newX] = grid[i][j];
        }
    }
    return newGrid;
}

function in_bound(k, l){
    return (l < map.length && l >= 0 && k < map.length && k >= 0);
}

function in_selection(cur_k, cur_l, k, l, ortn){
    var maxX = selection[0][0 + ortn];
    var maxY = selection[0][1 - ortn];
    var b = false;
    var max = -100;
    for (var i = 0; i <= maxY; i++){
        for (var j = 0; j <= maxX; j++){
            if ((cur_k + i == k) && (cur_l + j == l)) b = true;
            if (in_bound(cur_k + i, cur_l + j) &&
            map[cur_k + i][cur_l + j] > max) max = map[cur_k + i][cur_l + j];
            if (in_bound(cur_k + i, cur_l + j) &&
            plats[cur_k + i][cur_l + j] > max) max = plats[cur_k + i][cur_l + j];
        }
    }
    return [b, max];
}

/*
Checks if a building is buildable on a certain terrain:
mode 0 - all tiles must be same height
mode 1 - at least one tile and at most half the tiles must be below water
*/
function can_build(k, l, ortn, mode){
    var first = Math.max(map[k][l], plats[k][l]);
    var water_tiles = 0;
    if (selection[0][0+ortn] == selection[2][0+ortn] && selection[0][1-ortn] == selection[2][1-ortn] && first < water_level){
        return false;
    }
    var maxX = selection[0][0+ortn];
    var maxY = selection[0][1-ortn];
    for (var i = 0; i <= maxY; i++){
        for (var j = 0; j <= maxX; j++){
            t = map[k + i][l + j];
            p = plats[k + i][l + j];
            m = Math.max(t, p);
            if (buildings[k+i][l+j][0] != -1) return false;
            if (mode == 0 && (m < water_level || m != first)) return false; //Tiles aren't the same height
            if (mode == 1){
                if (m >= water_level && m != first && first >= water_level) return false;
                if (first < water_level && m >= water_level) first = m;
            }
            water_tiles += (m < water_level);
        }
    }
    if (mode == 1) return water_tiles == 1; //Condition for mode 1
    return true;
}


function rotateCoords(i, j, len, view){
    for (var m = 0; m < view; m++){
        var temp = j;
        j = len - i;
        i = temp;
    }
    return [i, j];
}

function rgb(r, g, b){
  return "rgb("+r+","+g+","+b+")";
}
// Colour adjustment function
// Nicked from http://stackoverflow.com/questions/5560248


const shadeColor=(c, p)=>{
    var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:255*p,P=P?1+p:1-p;
    return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

// Draw a cube to the specified specs
// from https://codepen.io/AshKyd/pen/JYXEpL
function drawCube(ctx, x, y, wx, wy, h, color) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - wx, y - wx * 0.5);
    ctx.lineTo(x - wx, y - h - wx * 0.5);
    ctx.lineTo(x, y - h * 1);
    ctx.closePath();
    ctx.fillStyle = shadeColor(color, -0.1);
    ctx.strokeStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + wy, y - wy * 0.5);
    ctx.lineTo(x + wy, y - h - wy * 0.5);
    ctx.lineTo(x, y - h * 1);
    ctx.closePath();
    ctx.fillStyle = shadeColor(color, 0.1);
    ctx.strokeStyle = shadeColor(color, 0.5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x - wx, y - h - wx * 0.5);
    ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
    ctx.lineTo(x + wy, y - h - wy * 0.5);
    ctx.closePath();
    ctx.fillStyle = shadeColor(color, 0.2);
    ctx.strokeStyle = shadeColor(color, 0.6);
    ctx.fill();
  }

function cancel(){
    if (current_build != null){
        res[0] += returned[0];
        res[1] += returned[1];
        res[2] += returned[2];
        res[3] += returned[3];
        currentButton = -1; //Reset
        currentPanelButton = -1
        current_build = null;
    }
    c1.clearRect(0, 0, layer1.width, layer1.height);
}
