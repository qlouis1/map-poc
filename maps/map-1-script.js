/**
 * Base script for map-1. Called each time the map is loaded.
 * 
 */
//import Maze from "./lib/maze"

console.log("==== Script map-1-script.js");
const blockLayerName = "blocks";
const bedscriptLayerName = "Scripts/bedScript";
const confroomLayerName = "Scripts/confroom";
/**
 * Some data is only available after the map il fully loaded
 */
WA.onInit().then(() => {
    console.log("==| Init");
    // Set blocks to handle bed
    WA.room.setTiles([
        { x: 17, y: 46, tile: 3, layer: blockLayerName },
        { x: 17, y: 47, tile: 3, layer: blockLayerName },
        { x: 13, y: 46, tile: 3, layer: blockLayerName },
        { x: 13, y: 47, tile: 3, layer: blockLayerName },
    ]);

})

const roofLayerSubscriber = WA.room.onEnterLayer("Scripts/roofScript").subscribe(() => {
    console.log("ENTER LAYER ROOFSCRIPT");
    WA.room.hideLayer("Roof");
});

WA.room.onLeaveLayer("Scripts/roofScript").subscribe(() => {
    console.log("EXIT LAYER ROOFSCRIPT");
    WA.room.showLayer("Roof");
});

/**
 * Conference room
 * Moves and fix the camera to the central position of the room 
 * Moves back to following the player when leaving
 */

const confRoomSubscriber = WA.room.onEnterLayer(confroomLayerName).subscribe(() => {
    console.log("ENTER LAYER CONFROOM");
    WA.camera.set(1776, 1296, 928, 928, true, true);
});

WA.room.onLeaveLayer(confroomLayerName).subscribe(() => {
    console.log("EXIT LAYER CONFROOM");
    WA.camera.followPlayer(true);
});

/**
 * Test bed script
 */
let bedTriggerMessage;
let bedExitMessage;
const bedSub = WA.room.onEnterLayer(bedscriptLayerName).subscribe(() => {
    console.log("ENTER LAYER BESCRIPT");
    bedTriggerMessage = WA.ui.displayActionMessage({
        message: "press space to go to bed",
        callback: () => {
            WA.controls.disablePlayerControls();
            WA.room.setTiles([
                { x: 17, y: 46, tile: 0, layer: blockLayerName },
                { x: 17, y: 47, tile: 0, layer: blockLayerName },
            ]);

            WA.player.moveTo(560, 1496, 6).then((result) => {
                WA.player.moveTo(560, 1512, 6).then((result) => {
                    bedExitMessage = WA.ui.displayActionMessage({
                        message: "press space to leave the bed",
                        callback: () => {
                            bedExitMessage.remove();
                            WA.player.moveTo(592, 1568, 6).then((result) => {
                                WA.room.setTiles([
                                    { x: 17, y: 46, tile: 3, layer: blockLayerName },
                                    { x: 17, y: 47, tile: 3, layer: blockLayerName },
                                ]);
                                WA.controls.restorePlayerControls();
                            })
                        }
                    })
                });
            });
        }
    })
});

WA.room.onLeaveLayer(bedscriptLayerName).subscribe(() => {
    console.log("EXIT LAYER BESCRIPT");
    /*WA.room.setTiles([
        { x: 16, y: 45, tile: 2703, layer: bedscriptLayerName },
        { x: 17, y: 45, tile: 2703, layer: bedscriptLayerName },
        { x: 18, y: 45, tile: 2703, layer: bedscriptLayerName },
        { x: 16, y: 46, tile: 2703, layer: bedscriptLayerName },
        { x: 18, y: 46, tile: 2703, layer: bedscriptLayerName },
        { x: 16, y: 47, tile: 2703, layer: bedscriptLayerName },
        { x: 18, y: 47, tile: 2703, layer: bedscriptLayerName },
        { x: 16, y: 48, tile: 2703, layer: bedscriptLayerName },
        { x: 18, y: 48, tile: 2703, layer: bedscriptLayerName },
    ]);*/
    WA.room.setTiles([
        { x: 17, y: 46, tile: 3, layer: blockLayerName },
        { x: 17, y: 47, tile: 3, layer: blockLayerName },
    ]);
    bedTriggerMessage.remove();

});

/**
 * Custom menus
 */

 const menu = WA.ui.registerMenuCommand("Retour a l'entrée",
 {
     callback: () => {
         WA.nav.goToRoom("map-1.json#default");
     }
 })