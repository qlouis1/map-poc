/**
 * Base script for map-maze. Called each time the map is loaded.
 * 
 */

console.log("==== Script map-maze-script.js");

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
/*
var fogScriptLayer;
var fogFogLayer;

console.log("Map generated with Tiled version ", map.tiledversion);

for (let i = 0; i < map.layers.length; i++) {
    if (map.layers[i].name = "fogscript") {
        fogScriptLayer = map.layers[i]
    }
}

const WHITE = getTile(fogScriptLayer.data, [0, 0]);
const RED = getTile(fogScriptLayer.data, [1, 0]);
*/
var arr = Array(sightRange * 2 + 1 + 2).fill(0).map(n => Array(sightRange * 2 + 1 + 2).fill(0));
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

            if (pos.x != npos.x || pos.y != npos.y) {
                //console.log("changed");

                pos = npos;
                // Ray Tracing but not really
                for (let x = -sightRange; x <= sightRange; x++) {
                    for (let y = -sightRange; y <= sightRange; y++) {
                        // Target only edge of square drawn by the line of sight range
                        if (Math.abs(x) == sightRange || Math.abs(y) == sightRange) {
                            // we draw a line from the player position to each target position
                            console.log("target is [" + x + "," + y + "]");
                            //WA.room.setTiles([{ x: pos.x+x, y: pos.y+y, tile: 2711, layer: refLayerName }]);
                            let l = line(pos.x, pos.y, pos.x + x, pos.y + y);
                            //console.log(l);
                            l.every(e => {
                                if (getTile(refLayerData, e) == 2708) {
                                    // stop when we hit a wall
                                    // add the wall to array to ease edge cases later
                                    //arr[e[0] - pos.x + sightRange + 1][e[1] - pos.y + sightRange + 1] = 1;
                                    return false;
                                }
                                let e1 = e[0] - pos.x + sightRange + 1;
                                let e2 = e[1] - pos.y + sightRange + 1;
                                //console.log("TILE TO PAINT [" + x + "," + y + "][" + e[0] + "," + e[1] + "] conv to [" + e1 + "][" + e2 + "]");
                                arr[e[0] - pos.x + sightRange + 1][e[1] - pos.y + sightRange + 1] = 1;

                                //WA.room.setTiles([{ x: e[0], y: e[1], tile: 2711, layer: "fogscript" }]);
                                return true;
                            });
                        }
                    }
                }
                //console.log(arr);
                // compute the array
                for (let i = 1; i < arr.length - 1; i++) {
                    for (let j = 1; j < arr.length - 1; j++) {
                        let up = arr[i][j - 1];
                        let down = arr[i][j + 1];
                        let left = arr[i - 1][j];
                        let right = arr[i + 1][j];
                        let tile = arr[i][j];
                        let ur = arr[i + 1][j - 1]; // up right
                        let dr = arr[i + 1][j + 1]; // down right
                        let dl = arr[i - 1][j + 1]; // down left
                        let ul = arr[i - 1][j - 1]; // up left

                        let b = parseInt("" + tile + up + right + down + left + ur + dr + dl + ul, 2);
                        if (tile == 1) {
                            //if (getTile(fogLayerData, [i + pos.x - sightRange - 1, j + pos.y - sightRange - 1]) != 0) {
                            WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
                            //}
                        } else {
                            WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8249, layer: fogLayerName }]);

                        }

                        /*
                                            switch (b) {
                                                case 511:
                                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
                                                    break;
                                                case 383:
                                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8246, layer: fogLayerName }]);
                                                    break;
                                                    case 447:
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8250, layer: fogLayerName }]);
                                                        break;
                                                default:
                                                    break;
                                            }
                                            */
                        //console.log(b + " " + parseInt(b, 2));
                        //console.log("TILE IS[" + i + "," + j + "] UP IS " + up);
                        /*
                                            if (tile == 1) {
                                                //WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
                                                if (up == 0) {
                                                    if (left == 0) {
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8245, layer: fogLayerName }]);
                                                    } else if (right == 0){
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8247, layer: fogLayerName }]);
                        
                                                    } else {
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8246, layer: fogLayerName }]);
                        
                                                    }
                                                    //WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8246, layer: fogLayerName }]);
                                                } else if (down == 0){
                                                    if(left == 0 ){
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8251, layer: fogLayerName }]);
                                                    } else if(right == 0 ){
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8253, layer: fogLayerName }]);
                                                    } else {
                                                        WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8252, layer: fogLayerName }]);
                        
                                                    }
                        
                                                } else if (left == 0){
                                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8248, layer: fogLayerName }]);
                        
                                                } else if (right == 0){
                                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8250, layer: fogLayerName }]);
                        
                                                }  else {
                                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
                        
                                                }
                                            }
                        */

                        /*
                        if (tile == 1) {
                            WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
    
                        }
                        */



                        /*
                        if (tile == 1) {
    
                            if (up == 0) {
                                if (getTile(fogLayerData, [i + pos.x - sightRange - 1, j + pos.y - sightRange - 1]) != 8246) {
                                WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8246, layer: fogLayerName }]);
                                }
                            } else if (right == 0) {
                                WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8250, layer: fogLayerName }]);
                                if (up == 0) {
                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8247, layer: fogLayerName }]);
                                }
                            }
                            else if (down == 0) {
                                WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8252, layer: fogLayerName }]);
                                if (right == 0) {
                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8253, layer: fogLayerName }]);
                                }
                            }
                            else if (left == 0) {
                                WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8248, layer: fogLayerName }]);
                                if (down == 0) {
                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8251, layer: fogLayerName }]);
                                }
                                if (up == 0) {
                                    WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8245, layer: fogLayerName }]);
                                }
                            }
                            else if (getTile(fogLayerData, [i + pos.x - sightRange - 1, j + pos.y - sightRange - 1]) != 0) {
                                WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
                            }
                            
    
                            //WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 0, layer: fogLayerName }]);
                        } else {
                            WA.room.setTiles([{ x: i + pos.x - sightRange - 1, y: j + pos.y - sightRange - 1, tile: 8249, layer: fogLayerName }]);
    
                        }
                        */
                    }
                }
            }

        });
    });



    // go trough the target tiles
    // trace the line
    // get touched tiles
    // if wall, stop
    // if tile has already been processed, don't reprocess it
    // if tile is to light up, add it to the array


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
    let pTile = origin;
    let nTile = origin;
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