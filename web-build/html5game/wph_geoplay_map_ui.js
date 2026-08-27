// ==================================================
// GEOPLAY MAP UI
// ==================================================
//
// RESPONSIBILITY:
// - General map UI initialization
// - External stylesheet loading
// - Story actions
// - FIND ANOTHER initialization
//
// DIALOGUE:
// geoplay_map_dialogue.js
//
// DESTINATION:
// geoplay_map_destination.js
//
// FIND ANOTHER:
// geoplay_map_find_another.js
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


    // ==================================================
    // IMPORTANT:
    // THE MAP UI CONTAINER ITSELF DOES NOT
    // BLOCK MAP INTERACTION.
    //
    // INDIVIDUAL INTERACTIVE UI ELEMENTS
    // TURN POINTER EVENTS BACK ON.
    // ==================================================

    ui.style.pointerEvents =
        "none";


    ui.style.zIndex =
        "1000";


    ui.style.overflow =
        "hidden";


    // ==================================================
    // HIDE UI UNTIL CSS IS READY
    // ==================================================

    ui.style.visibility =
        "hidden";


    mapContainer.appendChild(
        ui
    );


    window.geoplayMapUI =
        ui;


    // ==================================================
    // LOAD MAP UI CSS
    // ==================================================

    geoplayMapUILoadStylesheet();


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


    // ==================================================
    // CREATE FIND ANOTHER
    // ==================================================
    //
    // The popup is created immediately but remains
    // completely hidden until the user presses
    // FIND ANOTHER.
    //
    // ==================================================

    if (
        typeof geoplayMapUICreateFindAnother ===
        "function"
    )
    {
        geoplayMapUICreateFindAnother();
    }


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
        var existingStylesheet =
            document.getElementById(
                "geoplay-map-ui-stylesheet"
            );


        if (
            existingStylesheet.sheet
        )
        {
            if (
                window.geoplayMapUI
            )
            {
                window.geoplayMapUI.style.visibility =
                    "visible";
            }
        }


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


            if (
                window.geoplayMapUI
            )
            {
                window.geoplayMapUI.style.visibility =
                    "visible";
            }
        };


    link.onerror =
        function()
        {
            console.error(
                "GEOPLAY UI: CSS FAILED to load."
            );


            // ==================================================
            // FAIL SAFE
            // ==================================================

            if (
                window.geoplayMapUI
            )
            {
                window.geoplayMapUI.style.visibility =
                    "visible";
            }
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


    // ==================================================
    // INITIAL STORY STATE
    // ==================================================
    //
    // The buttons are completely non-interactive
    // while the narration/story is running.
    //
    // ==================================================

    actions.className =
        "geoplay-story-actions story-hidden";


    actions.style.pointerEvents =
        "none";


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


    // ==================================================
    // FIND ANOTHER CLICK
    // ==================================================

    findAnother.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            if (
                typeof geoplayMapUIOpenFindAnother ===
                "function"
            )
            {
                geoplayMapUIOpenFindAnother();
            }
            else
            {
                console.error(
                    "GEOPLAY FIND ANOTHER: Open function not available."
                );
            }
        }
    );


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


    // ==================================================
    // BROWSE IS CURRENTLY VISUAL ONLY
    // ==================================================

    browse.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();
        }
    );


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
        // ==================================================
        // STORY IS COMPLETE
        // ==================================================

        actions.classList.remove(
            "story-hidden"
        );


        actions.classList.add(
            "visible"
        );


        // ==================================================
        // ENABLE BUTTON INTERACTION
        // ==================================================

        actions.style.pointerEvents =
            "auto";
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
        // ==================================================
        // DISABLE BUTTON INTERACTION
        // ==================================================

        actions.style.pointerEvents =
            "none";


        // ==================================================
        // HIDE BUTTONS
        // ==================================================

        actions.classList.remove(
            "visible"
        );


        actions.classList.add(
            "story-hidden"
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