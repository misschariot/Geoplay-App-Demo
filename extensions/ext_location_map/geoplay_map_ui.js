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
// MODULES CREATED HERE:
// - Dialogue
// - Destination
// - Story Actions
// - FIND ANOTHER
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
// MODAL:
// geoplay_map_modal.js
//
// ROUTING:
// geoplay_map_route.js
//
// STORY:
// geoplay_map_flow.js
//
// CSS:
// geoplay_map.css
//
// ==================================================


// ==================================================
// UI STATE
// ==================================================

window.geoplayMapUI =
    null;


window.geoplayMapUIInitialized =
    false;


// ==================================================
// CREATE MAP UI
// ==================================================

function geoplayMapUICreate()
{
    // ==================================================
    // PREVENT DUPLICATE INITIALIZATION
    // ==================================================

    if (
        window.geoplayMapUIInitialized &&
        window.geoplayMapUI
    )
    {
        return 1;
    }


    // ==================================================
    // FIND MAP CONTAINER
    // ==================================================

    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (
        !mapContainer
    )
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
    // UI CONTAINER DOES NOT BLOCK THE MAP
    // ==================================================
    //
    // Individual interactive components enable
    // pointer events when necessary.
    //
    // ==================================================

    ui.style.pointerEvents =
        "none";


    ui.style.zIndex =
        "1000";


    ui.style.overflow =
        "hidden";


    // ==================================================
    // HIDE UNTIL CSS IS READY
    // ==================================================

    ui.style.visibility =
        "hidden";


    mapContainer.appendChild(
        ui
    );


    window.geoplayMapUI =
        ui;


    // ==================================================
    // LOAD UI STYLES
    // ==================================================

    geoplayMapUILoadStylesheet();


    // ==================================================
    // CREATE DIALOGUE
    // ==================================================

    if (
        typeof geoplayMapUICreateDialogue ===
        "function"
    )
    {
        geoplayMapUICreateDialogue();
    }
    else
    {
        console.error(
            "GEOPLAY UI: Dialogue module is not available."
        );
    }


    // ==================================================
    // CREATE DESTINATION
    // ==================================================

    if (
        typeof geoplayMapUICreateDestinationCard ===
        "function"
    )
    {
        geoplayMapUICreateDestinationCard();
    }
    else
    {
        console.error(
            "GEOPLAY UI: Destination module is not available."
        );
    }


    if (
        typeof geoplayMapUICreateOffscreenIndicator ===
        "function"
    )
    {
        geoplayMapUICreateOffscreenIndicator();
    }
    else
    {
        console.error(
            "GEOPLAY UI: Destination indicator module is not available."
        );
    }


    // ==================================================
    // CREATE STORY ACTIONS
    // ==================================================

    geoplayMapUICreateStoryActions();


    // ==================================================
    // CREATE FIND ANOTHER
    // ==================================================
    //
    // The Search popup is created during UI
    // initialization but remains hidden until
    // FIND ANOTHER is selected.
    //
    // ==================================================

    if (
        typeof geoplayMapUICreateFindAnother ===
        "function"
    )
    {
        geoplayMapUICreateFindAnother();
    }
    else
    {
        console.error(
            "GEOPLAY UI: FIND ANOTHER module is not available."
        );
    }


    // ==================================================
    // INITIALIZATION COMPLETE
    // ==================================================

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
// geoplay_map.css is a GameMaker HTML5 Included File.
//
// GameMaker exports the Included File into:
//
// html5game/
//
// ==================================================

function geoplayMapUILoadStylesheet()
{
    // ==================================================
    // CHECK FOR EXISTING STYLESHEET
    // ==================================================

    var existingStylesheet =
        document.getElementById(
            "geoplay-map-ui-stylesheet"
        );


    if (
        existingStylesheet
    )
    {
        // ==================================================
        // CSS IS ALREADY AVAILABLE
        // ==================================================

        if (
            existingStylesheet.sheet &&
            window.geoplayMapUI
        )
        {
            window.geoplayMapUI.style.visibility =
                "visible";
        }


        return 1;
    }


    // ==================================================
    // CREATE STYLESHEET LINK
    // ==================================================

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


    // ==================================================
    // SUCCESS
    // ==================================================

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


    // ==================================================
    // FAIL SAFE
    // ==================================================
    //
    // The UI should still become visible if the
    // stylesheet fails to load.
    //
    // ==================================================

    link.onerror =
        function()
        {
            console.error(
                "GEOPLAY UI: CSS FAILED to load."
            );


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
//
// These are the two actions shown after the initial
// robot story:
//
// FIND ANOTHER
// BROWSE
//
// FIND ANOTHER opens the Search module.
//
// BROWSE is currently visual-only.
//
// ==================================================

function geoplayMapUICreateStoryActions()
{
    // ==================================================
    // PREVENT DUPLICATE CREATION
    // ==================================================

    if (
        document.getElementById(
            "geoplay-story-actions"
        )
    )
    {
        return 1;
    }


    // ==================================================
    // CREATE ACTION CONTAINER
    // ==================================================

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
    // Actions remain hidden and non-interactive while
    // the robot story is running.
    //
    // ==================================================

    actions.className =
        "geoplay-story-actions story-hidden";


    actions.style.pointerEvents =
        "none";


    // ==================================================
    // FIND ANOTHER BUTTON
    // ==================================================

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
    // FIND ANOTHER ACTION
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


    // ==================================================
    // BROWSE BUTTON
    // ==================================================

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
    // BROWSE
    // ==================================================
    //
    // Currently visual-only.
    //
    // The click handler intentionally prevents the
    // event from reaching the map.
    //
    // ==================================================

    browse.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();
        }
    );


    // ==================================================
    // ADD BUTTONS
    // ==================================================

    actions.appendChild(
        findAnother
    );


    actions.appendChild(
        browse
    );


    // ==================================================
    // ADD ACTIONS TO UI
    // ==================================================

    if (
        window.geoplayMapUI
    )
    {
        window.geoplayMapUI.appendChild(
            actions
        );
    }


    return 1;
}


// ==================================================
// SHOW STORY ACTIONS
// ==================================================
//
// Called when the introductory robot story has
// finished.
//
// ==================================================

function geoplayMapUIShowStoryActions()
{
    var actions =
        document.getElementById(
            "geoplay-story-actions"
        );


    if (
        !actions
    )
    {
        return 0;
    }


    // ==================================================
    // SHOW ACTIONS
    // ==================================================

    actions.classList.remove(
        "story-hidden"
    );


    actions.classList.add(
        "visible"
    );


    // ==================================================
    // ENABLE INTERACTION
    // ==================================================

    actions.style.pointerEvents =
        "auto";


    return 1;
}


// ==================================================
// HIDE STORY ACTIONS
// ==================================================
//
// Used when the story needs to hide the bottom
// actions again.
//
// ==================================================

function geoplayMapUIHideStoryActions()
{
    var actions =
        document.getElementById(
            "geoplay-story-actions"
        );


    if (
        !actions
    )
    {
        return 0;
    }


    // ==================================================
    // DISABLE INTERACTION
    // ==================================================

    actions.style.pointerEvents =
        "none";


    // ==================================================
    // HIDE ACTIONS
    // ==================================================

    actions.classList.remove(
        "visible"
    );


    actions.classList.add(
        "story-hidden"
    );


    return 1;
}


// ==================================================
// LEGACY CONTINUE COMPATIBILITY
// ==================================================
//
// These functions are intentionally retained for now.
//
// They allow older GameMaker references to continue
// working while we complete the refactor.
//
// DO NOT REMOVE UNTIL THE GAMEMAKER EXTENSION /
// PROJECT CALLBACK AUDIT IS COMPLETE.
// ==================================================

function geoplayMapUIShowContinue()
{
    return geoplayMapUIShowStoryActions();
}


function geoplayMapUIHideContinue()
{
    return geoplayMapUIHideStoryActions();
}


// ==================================================
// END GEOPLAY MAP UI
// ==================================================