/**
 * Base script for map-maze. Called each time the map is loaded.
 * 
 */

console.log("==== Script map-maze-script.js");
let playerPosition;
/**
 * Some data is only available after the map il fully loaded
 */
WA.onInit().then(() => {
    console.log("==| Init");

    // get player position
    playerPosition = WA.player.getPosition();

})

/**
 * PixelToTile
 * @param {int} px position x in pixel ref
 * @param {int} py position y in pixel ref
 * @returns [tx, ty] poisition in tile ref
 */
function PixelToTile(px, py){
    return [Math.floor(px / 32), Math.floor(py / 32)];
}
