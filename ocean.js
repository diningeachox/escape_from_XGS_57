// This is a port of Ken Perlin's Java code.
PerlinNoise = new function() {

this.noise = function(x, y, z) {

  var p = new Array(512)
  var permutation = [ 151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ];
  for (var i=0; i < 256 ; i++)
    p[256+i] = p[i] = permutation[i];

     var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
         Y = Math.floor(y) & 255,                  // CONTAINS POINT.
         Z = Math.floor(z) & 255;
     x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
     y -= Math.floor(y);                                // OF POINT IN CUBE.
     z -= Math.floor(z);
     var    u = fade(x),                                // COMPUTE FADE CURVES
            v = fade(y),                                // FOR EACH OF X,Y,Z.
            w = fade(z);
     var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
         B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

     return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                    grad(p[BA  ], x-1, y  , z   )), // BLENDED
                            lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                    grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                    lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                    grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                            lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                    grad(p[BB+1], x-1, y-1, z-1 )))));
    }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp( t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
         var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
         var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
                v = h<4 ? y : h==12||h==14 ? x : z;
         return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    }
    function scale(n) { return (1 + n)/2; }
}


//Fill one isometric tile with perlin noise simulating ocean surface
function drawViaCallback(px, py, can, ctx) {

   var w = can.width;
   var h = can.height;

   var canvasData = ctx.getImageData(0,0,w,h);
   var wid = map.length * tilewidth;
   function intile(sx, sy, x, y, wid){
       if (y % 3 == 0 && y >= sy && y <= sy + wid){
         return (x % 3 == 0 && x <= wid - Math.abs(2 * (y - sy) - wid) + sx && x >= Math.abs(2 * (y - sy) - wid) - wid + sx);
       }
       return false;
   }

   for (var idx, x = 0; x < w; x++) {
      for (var y = 0; y < h; y++) {
          // Index of the pixel in the array
          idx = (x + y * w) * 4;
          //idx = ((startX + x) + 2 * (wid -Math.abs(2 * x - wid)) * (startY - (wid/2) + y)) * 4;
          // The RGB values
          var r = canvasData.data[idx + 0];
          var g = canvasData.data[idx + 1];
          var b = canvasData.data[idx + 2];


          if (intile(px, py, x, y, wid)){
              var pixel = callback([r,g,b], x + x_offset, y - y_offset,w,h);
              //Draw a 3x3 patch
              for (var i = 0; i < 3; i++){
                  for (var j = 0; j < 3; j++){
                      var add = (j + i * w) * 4;
                      canvasData.data[idx + add + 0] = pixel[0];
                      canvasData.data[idx + add + 1] = pixel[1];
                      canvasData.data[idx + add + 2] = pixel[2];
                      canvasData.data[idx + add + 3] = 255;
                  }
              }


          }

      }
   }
   ctx.putImageData(canvasData, 0,0 );
}

function shimmer(px, py, can, ctx) {
   callback = function( pixel,x,y,w,h ){
      var r=pixel[0];
      var g=pixel[1];
      var b=pixel[2];
      x/=w; y/=h; sizex=64; sizey=88;
      n=PerlinNoise.noise(sizex*x,sizey*y,z);
      x=(1+Math.sin(Math.PI*x))/1;
      y=(1+Math.sin(n*Math.PI*y))/2;
      r=n*y*x*185; g = y*r;
      b=y*155;
      return [r,g,b];
    }

   try {
    eval(callback);
    //fillCanvas( "rgb(255, 255, 255)" );
    drawViaCallback(px, py, can, ctx);
   }
   catch(e) { alert("Error: " + e.toString()); }
}
