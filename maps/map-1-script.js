/**
 * Base script for map-1. Called each time the map is loaded.
 * 
 */
//import Maze from "./lib/maze"

console.log("==== Script map-1-script.js");
/**
 * Some data is only available after the map il fully loaded
 */
WA.onInit().then(() => {
    console.log("==| Init");
    WA.room.setTiles([
        { x: 17, y: 46, tile: 3, layer: "blocks" },
        { x: 17, y: 47, tile: 3, layer: "blocks" },
    ]);
    /**
     * Maze handler
     */
    //m = new Maze(2875);
    //WA.player.onPlayerMove(console.log("PLAYER MOVE"));
    //WA.player.onPlayerMove(Maze.lightUp);
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

const confRoomSubscriber = WA.room.onEnterLayer("Scripts/confroom").subscribe(() => {
    console.log("ENTER LAYER CONFROOM");
    WA.camera.set(1776, 1296, 928, 928, true, true);
});

WA.room.onLeaveLayer("Scripts/confroom").subscribe(() => {
    console.log("EXIT LAYER CONFROOM");
    WA.camera.followPlayer(true);
});

/**
 * Test bed script
 */
let bedTriggerMessage;
let bedExitMessage;
const bedSub = WA.room.onEnterLayer("Scripts/bedScript").subscribe(() => {
    console.log("ENTER LAYER BESCRIPT");
    bedTriggerMessage = WA.ui.displayActionMessage({
        message: "press space to go to bed",
        callback: () => {
            WA.controls.disablePlayerControls();
            WA.room.setTiles([
                { x: 17, y: 46, tile: 0, layer: "blocks" },
                { x: 17, y: 47, tile: 0, layer: "blocks" },
            ]);

            WA.player.moveTo(560, 1496, 6).then((result) => {
                WA.player.moveTo(560, 1512, 6).then((result) => {
                    /*WA.room.setTiles([
                        { x: 16, y: 45, tile: 0, layer: "Scripts/bedScript" },
                        { x: 17, y: 45, tile: 0, layer: "Scripts/bedScript" },
                        { x: 18, y: 45, tile: 0, layer: "Scripts/bedScript" },
                        { x: 16, y: 46, tile: 0, layer: "Scripts/bedScript" },
                        { x: 18, y: 46, tile: 0, layer: "Scripts/bedScript" },
                        { x: 16, y: 47, tile: 0, layer: "Scripts/bedScript" },
                        { x: 18, y: 47, tile: 0, layer: "Scripts/bedScript" },
                        { x: 16, y: 48, tile: 0, layer: "Scripts/bedScript" },
                        { x: 18, y: 48, tile: 0, layer: "Scripts/bedScript" },
                    ]);*/
                    bedExitMessage = WA.ui.displayActionMessage({
                        message: "press space to leave the bed",
                        callback: () => {
                            bedExitMessage.remove();
                            WA.player.moveTo(592, 1568, 6).then((result) => {
                                WA.room.setTiles([
                                    { x: 17, y: 46, tile: 3, layer: "blocks" },
                                    { x: 17, y: 47, tile: 3, layer: "blocks" },
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

WA.room.onLeaveLayer("Scripts/bedScript").subscribe(() => {
    console.log("EXIT LAYER BESCRIPT");
    /*WA.room.setTiles([
        { x: 16, y: 45, tile: 2703, layer: "Scripts/bedScript" },
        { x: 17, y: 45, tile: 2703, layer: "Scripts/bedScript" },
        { x: 18, y: 45, tile: 2703, layer: "Scripts/bedScript" },
        { x: 16, y: 46, tile: 2703, layer: "Scripts/bedScript" },
        { x: 18, y: 46, tile: 2703, layer: "Scripts/bedScript" },
        { x: 16, y: 47, tile: 2703, layer: "Scripts/bedScript" },
        { x: 18, y: 47, tile: 2703, layer: "Scripts/bedScript" },
        { x: 16, y: 48, tile: 2703, layer: "Scripts/bedScript" },
        { x: 18, y: 48, tile: 2703, layer: "Scripts/bedScript" },
    ]);*/
    WA.room.setTiles([
        { x: 17, y: 46, tile: 3, layer: "blocks" },
        { x: 17, y: 47, tile: 3, layer: "blocks" },
    ]);
    bedTriggerMessage.remove();

});

/**
 * Class maze
 * Provides utils to handle maze generation, fog of war
 */

class Maze {

    static fader33 = [[2735, 2736, 2737], [2765, 2766, 2767], [2795, 2796, 2797]];


    constructor(blackTileId) {
        this.blackTileId = blackTileId;
    }

    /**
     * function lightUp
     * change the tiles surounding the palyer with round faders
     */

    static lightUp() {
        // get player position p[x,y]
        let fader33 = [[2735, 2736, 2737], [2765, 2766, 2767], [2795, 2796, 2797]];
        WA.player.getPosition().then(function (value) {
            let p = [Math.floor(value.x / 32), Math.floor(value.y / 32)];
            // use fader33 for now
            // start a p[x-1,y-1]
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    WA.room.setTiles([
                        { x: p[0] - 1 + i, y: p[1] - 1 + j, tile: fader33[j][i], layer: "MazeFader" }
                    ]);
                }
            }
            for (let k = 0; k < 5; k++) {
                WA.room.setTiles([
                    { x: p[0] - 2 + k, y: p[1] - 2, tile: 2875, layer: "MazeFader" },
                    { x: p[0] - 2 + k, y: p[1] + 2, tile: 2875, layer: "MazeFader" },
                    { x: p[0] - 2, y: p[1] - 2 + k, tile: 2875, layer: "MazeFader" },
                    { x: p[0] + 2, y: p[1] - 2 + k, tile: 2875, layer: "MazeFader" },

                    { x: p[0] - 2 + k, y: p[1] - 3, tile: 2875, layer: "MazeFader" },
                    { x: p[0] - 2 + k, y: p[1] + 3, tile: 2875, layer: "MazeFader" },
                    { x: p[0] - 3, y: p[1] - 2 + k, tile: 2875, layer: "MazeFader" },
                    { x: p[0] + 3, y: p[1] - 2 + k, tile: 2875, layer: "MazeFader" }
                ]);
            }
        });
    }
}