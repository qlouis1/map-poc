/**
 * Base script for map-1. Called each time the map is loaded.
 * 
 */
//import Maze from "./lib/maze"

console.log("==== Script map-1-script.js");
const blockLayerName = "blocks";
const bedscriptLayerName = "Scripts/bedScript";
const bedscriptOOSLayerName = "Scripts/bedScriptOOS";
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
    ]);

    /**
     * TUTO
     */
    let tt1;
    let tt2;
    tt1 = WA.ui.openPopup("tuto", "Bienvenue dans Workadventure ! Utilisez les touches fléchées pour vous déplacer.", [{
        label: "C'est parti !",
        className: "primary",
        callback: (popup) => {
            popup.close();
            tt2 = WA.ui.openPopup("tuto", "Vous pouvez à tout moment revenir à l'entrée avec le bouton présent dans le menu, en haut à gauche de votre écran.", [{
                label: "D'accord !",
                className: "primary",
                callback: (popup) => {
                    popup.close();
                }
            }]);
        }
    }]);

    WA.room.onLeaveLayer("Scripts/tuto").subscribe(() => {
        if (tt1 !== undefined) {
            tt1.close();
        }
        if (tt2 !== undefined) {
            tt2.close();
        }
    });

})

/**
 * Conference room
 * Moves and fix the camera to the central position of the room 
 * Moves back to following the player when leaving
 */

const confRoomSubscriber = WA.room.onEnterLayer(confroomLayerName).subscribe(() => {
    console.log("ENTER LAYER CONFROOM");
    WA.camera.set(1776, 1296, 928, 928, true, true);
    WA.controls.disablePlayerProximityMeeting();
});

WA.room.onLeaveLayer(confroomLayerName).subscribe(() => {
    console.log("EXIT LAYER CONFROOM");
    WA.camera.followPlayer(true);
    WA.controls.restorePlayerProximityMeeting();
});

/**
 * Test bed script
 */
let bedTriggerMessage;
let bedExitMessage;
const bedSub = WA.room.onEnterLayer(bedscriptLayerName).subscribe(() => {
    //console.log("ENTER LAYER BESCRIPT");
    bedTriggerMessage = WA.ui.displayActionMessage({
        message: "Appuyez sur \"ESPACE\" pour aller au lit.",
        callback: () => {
            WA.controls.disablePlayerControls();
            WA.room.setTiles([
                { x: 17, y: 46, tile: 0, layer: blockLayerName },
                { x: 17, y: 47, tile: 0, layer: blockLayerName },
            ]);

            WA.player.moveTo(560, 1496, 6).then((result) => {
                WA.player.moveTo(560, 1512, 6).then((result) => {
                    bedExitMessage = WA.ui.displayActionMessage({
                        message: "Appuyez sur \"ESPACE\" pour quitter le lit.",
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
    //console.log("EXIT LAYER BESCRIPT");
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


let bedOOSTriggerMessage;
const bedSubOOS = WA.room.onEnterLayer(bedscriptOOSLayerName).subscribe(() => {
    bedOOSTriggerMessage = WA.ui.displayActionMessage({
        message: "Ce lit est hors service.",
        callback: () => {
            console.log("1");
        }

    });

});

WA.room.onLeaveLayer(bedscriptOOSLayerName).subscribe(() => {
    bedOOSTriggerMessage.remove();

});


/**
 * Custom menus
 */

const menu = WA.ui.registerMenuCommand("Retour a l'entrée",
    {
        callback: () => {
            WA.nav.goToRoom("map-1.json#default");
        }
    });

/**
 * Clock
 */
let clockPopup;
WA.room.onEnterLayer("Scripts/clockScript").subscribe(() => {
    let t = new Date();
    t = t.getHours() + ":" + t.getMinutes();
    clockPopup = WA.ui.openPopup("clockPopup", t, []);
});

WA.room.onLeaveLayer("Scripts/clockScript").subscribe(() => {

    clockPopup.close();
});


/**
 * Boat script
 * 
 */

const weekday = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
let boatPopup;
WA.room.onEnterLayer("Scripts/boatScript").subscribe(() => {
    let d = new Date();
    d.setDate(d.getDate() + 1);
    let msg = "Le prochain bateau part le " + weekday[d.getDay()] + " " + d.getDate() + " " + month[d.getMonth()] + " à " + d.getHours() + " heures. ";

    boatPopup = WA.ui.openPopup("boatPopup", msg, []);
});

WA.room.onLeaveLayer("Scripts/boatScript").subscribe(() => {

    boatPopup.close();
});

/**
 * Room names
 */
const names = {
    "ASN1": "Pôle ASN",
    "ASN2": "Pôle ASN",
    "RSSI": "Pôle RSSI",
    "REU": "Salle de réunion",
    "CONF": "Salle de conférence",
    "INFRA1": "Pôle Infra",
    "INFRA2": "Pôle Infra",
    "DSI": "DSI",
    "PMO": "Pôle PMO",
    "ID": "Pôle ID",
    "PAUSE1": "Salle de pause",
    "PAUSE2": "Salle de pause",
    "PROXI": "Pôle Proxi",
    "ADMIN": "Pôle Admin",
    "REPOS": "Salle de repos",
    "CLASSE": "Salle de classe"
};

/**
// I love js (no)
let nmsg;
Object.keys(names).forEach(key => {
    //console.log("item " + key + " is " + names[key]);
    WA.room.onEnterLayer("Info/" + key).subscribe(() => {
        //console.log("in " + key);
        nmsg = WA.ui.displayActionMessage({
            message: names[key],
            callback: () => { },
            type: "message"
        });
    });

    WA.room.onLeaveLayer("Info/" + key).subscribe(() => {
        nmsg.remove();
    });
});
*/
// v2
let nmsg;
Object.keys(names).forEach(key => {
    console.log("item " + key + " is " + names[key]);
    WA.room.onEnterLayer("Info/" + key).subscribe(() => {
        console.log("in " + key);
        nmsg = WA.ui.openPopup(key, names[key], []);

    });

    WA.room.onLeaveLayer("Info/" + key).subscribe(() => {
        console.log("out " + key);
        nmsg.close();
    });
});