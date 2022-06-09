/**
 * v2 of the maze script
 * strategy now is to trace to each tile within range and replace tiles in bulk
 * 
 */

console.log("==== Script map-maze-script-v2.js");

const sightRange = 4;
const map = await WA.room.getTiledMap();
const fogLayerName = "Fog";
const refLayerName = "Fogscript";
const fogLayerData = getLayerData(fogLayerName);
const refLayerData = getLayerData(refLayerName);

function getLayerData(n) {
    return map.layers.find(e => e.name == n).data;
}



var playerPosition;
var arr = Array(sightRange * 2 + 1).fill(0).map(n => Array(sightRange * 2 + 1).fill(0));
/**
 * Some data is only available after the map il fully loaded
 */
WA.onInit().then(() => {

    console.log("==| Init");
    console.log("const");
    console.log(fogLayerName);
    console.log(refLayerName);
    console.log(fogLayerData);
    console.log(refLayerData);
    console.log("/const");

    // TODO: limit process to once by tile 
    //       detect edges
    let pos = 0;
    WA.player.onPlayerMove(function () {
        playerPosition = WA.player.getPosition().then(function (value) {
            let npos = PixelToTile(value); // convert pixel position to tile position
            // compute only when player change tile
            for (let i = 0; i < sightRange * 2 + 1; i++) {
                for (let j = 0; j < sightRange * 2 + 1; j++) {
                    arr[i][j] = trace(npos, { x: npos.x + i - sightRange, y: npos.y + j - sightRange });
                }
            }
//console.log(arr);
        });
    });



})

/**
 * PixelToTile
 * @param {int} px position x in pixel ref
 * @param {int} py position y in pixel ref
 * @returns {x:tx, y:ty} dictionnary
 */
function PixelToTile(value) {
    return { x: Math.floor(value.x / 32), y: Math.floor(value.y / 32) };
}


/**
 * getTile
 * returns the tile id at coordinate
 * @param {Array} l data array
 * @param {Array} i coord array
 * @returns tile id
 */
function getTile(l, i) {
    return l[i[0] + i[1] * 72];
}

function trace(origin, target) {
    let a = line(origin.x, origin.y, target.x, target.y);
    a.forEach(e => {
        if (getTile(refLayerData, e) == 0) {
            return 0;
        }
    });
    return 1;
}

function line(x0, y0, x1, y1) {
    let r = [];
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    while (true) {
        //console.log([x0, y0]); // Do what you need to for this
        r.push([x0, y0]);
        if ((x0 === x1) && (y0 === y1)) break;
        var e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }
    return r;
}