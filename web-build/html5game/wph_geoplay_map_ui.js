// ==================================================
// GEOPLAY MAP UI
// ==================================================
//
// RESPONSIBILITY:
// - General map UI initialization
// - External stylesheet loading
// - Story actions
//
// DIALOGUE:
// geoplay_map_dialogue.js
//
// DESTINATION:
// geoplay_map_destination.js
//
// CSS:
// geoplay_map.css
//
// ==================================================


window.geoplayMapUI = null;

window.geoplayMapUIInitialized = false;


// ==================================================
// CREATE UI
// ==================================================

function geoplayMapUICreate()
{
    if (
        window.geoplayMapUIInitialized &&
        window.geoplayMapUI
    )
    {
        return 1;
    }


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (!mapContainer)
    {
        console.error(
            "GEOPLAY UI: Map container not found."
        );

        return 0;
    }


    // ==================================================
    // LOAD MAP UI CSS
    // ==================================================

    geoplayMapUILoadStylesheet();


    // ==================================================
    // CREATE UI CONTAINER
    // ==================================================

    var ui =
        document.createElement(
            "div"
        );


    ui.id =
        "geoplay-map-ui";


    ui.style.position =
        "absolute";


    ui.style.left =
        "0";


    ui.style.top =
        "0";


    ui.style.width =
        "100%";


    ui.style.height =
        "100%";


    ui.style.pointerEvents =
        "none";


    ui.style.zIndex =
        "1000";


    ui.style.overflow =
        "hidden";


    mapContainer.appendChild(
        ui
    );


    window.geoplayMapUI =
        ui;


    // ==================================================
    // CREATE DIALOGUE
    // ==================================================

    geoplayMapUICreateDialogue();


    // ==================================================
    // CREATE DESTINATION
    // ==================================================

    geoplayMapUICreateDestinationCard();

    geoplayMapUICreateOffscreenIndicator();


    // ==================================================
    // CREATE STORY ACTIONS
    // ==================================================

    geoplayMapUICreateStoryActions();


    window.geoplayMapUIInitialized =
        true;


    console.log(
        "GEOPLAY UI: Story UI created."
    );


    return 1;
}


// ==================================================
// LOAD MAP UI STYLESHEET
// ==================================================
//
// geoplay_map.css is an HTML5 Included File.
//
// GameMaker exports the Included File into:
//
// html5game/
//
// ==================================================

function geoplayMapUILoadStylesheet()
{
    if (
        document.getElementById(
            "geoplay-map-ui-stylesheet"
        )
    )
    {
        return 1;
    }


    var link =
        document.createElement(
            "link"
        );


    link.id =
        "geoplay-map-ui-stylesheet";


    link.rel =
        "stylesheet";


    link.type =
        "text/css";


    link.href =
        "html5game/geoplay_map.css";


    link.onload =
        function()
        {
            console.log(
                "GEOPLAY UI: CSS loaded."
            );
        };


    link.onerror =
        function()
        {
            console.error(
                "GEOPLAY UI: CSS FAILED to load."
            );
        };


    document.head.appendChild(
        link
    );


    return 1;
}


// ==================================================
// CREATE STORY ACTIONS
// ==================================================

function geoplayMapUICreateStoryActions()
{
    var actions =
        document.createElement(
            "div"
        );


    actions.id =
        "geoplay-story-actions";


    actions.className =
        "geoplay-story-actions";


    var findAnother =
        document.createElement(
            "button"
        );


    findAnother.type =
        "button";


    findAnother.className =
        "geoplay-story-action";


    findAnother.textContent =
        "FIND ANOTHER";


    var browse =
        document.createElement(
            "button"
        );


    browse.type =
        "button";


    browse.className =
        "geoplay-story-action " +
        "geoplay-story-action-browse";


    browse.textContent =
        "BROWSE";


    actions.appendChild(
        findAnother
    );


    actions.appendChild(
        browse
    );


    window.geoplayMapUI.appendChild(
        actions
    );
}


// ==================================================
// SHOW STORY ACTIONS
// ==================================================

function geoplayMapUIShowStoryActions()
{
    var actions =
        document.getElementById(
            "geoplay-story-actions"
        );


    if (actions)
    {
        actions.classList.add(
            "visible"
        );
    }


    return 1;
}


// ==================================================
// HIDE STORY ACTIONS
// ==================================================

function geoplayMapUIHideStoryActions()
{
    var actions =
        document.getElementById(
            "geoplay-story-actions"
        );


    if (actions)
    {
        actions.classList.remove(
            "visible"
        );
    }


    return 1;
}


// ==================================================
// LEGACY CONTINUE COMPATIBILITY
// ==================================================

function geoplayMapUIShowContinue()
{
    return geoplayMapUIShowStoryActions();
}


function geoplayMapUIHideContinue()
{
    return geoplayMapUIHideStoryActions();
}