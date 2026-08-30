// ==================================================
// GEOPLAY MAP UI
// ==================================================
//
// RESPONSIBILITY:
// - General map UI initialization
// - External stylesheet loading
// - Story actions
// - FIND ANOTHER / SEARCH initialization
//
// MODULES CREATED HERE:
// - Dialogue
// - Destination
// - Story Actions
// - FIND ANOTHER / SEARCH
//
// DIALOGUE:
// geoplay_map_dialogue.js
//
// DESTINATION:
// geoplay_map_destination.js
//
// FIND ANOTHER / SEARCH:
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
    // CREATE FIND ANOTHER / SEARCH
    // ==================================================
    //
    // The Search popup is created during UI
    // initialization but remains hidden until
    // SEARCH is selected.
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
            "GEOPLAY UI: SEARCH module is not available."
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
// SEARCH
// HOME
//
// SEARCH opens the existing Search module.
//
// HOME is intentionally visual-only for now.
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


    // ==================================================
    // IMPORTANT:
    // POSITION THE ACTION CONTAINER DIRECTLY AGAINST
    // THE BROWSER VIEWPORT.
    //
    // The map UI container can have its own coordinate
    // system on some mobile browsers.
    //
    // By attaching this element to document.body and
    // using fixed positioning, right/bottom are based
    // on the actual browser viewport.
    // ==================================================

    actions.style.position =
        "fixed";


    actions.style.right =
        "4px";


    actions.style.bottom =
        "24px";


    actions.style.pointerEvents =
        "none";


    actions.style.zIndex =
        "120000";


    // ==================================================
    // SEARCH BUTTON
    // ==================================================

    var searchButton =
        document.createElement(
            "button"
        );


    searchButton.type =
        "button";


    searchButton.className =
        "geoplay-story-action geoplay-story-action-search";


    searchButton.setAttribute(
        "aria-label",
        "Search"
    );


    searchButton.setAttribute(
        "title",
        "Search"
    );


    // ==================================================
    // SEARCH ICON
    // ==================================================

    searchButton.innerHTML =
        "<svg " +
        "class='geoplay-story-action-icon' " +
        "width='22' " +
        "height='22' " +
        "viewBox='0 0 24 24' " +
        "fill='none' " +
        "xmlns='http://www.w3.org/2000/svg' " +
        "aria-hidden='true'>" +

        "<circle " +
        "cx='10.8' " +
        "cy='10.8' " +
        "r='6.2' " +
        "stroke='currentColor' " +
        "stroke-width='2' " +
        "stroke-linecap='round' " +
        "stroke-linejoin='round'/>" +

        "<path " +
        "d='M15.4 15.4L20.5 20.5' " +
        "stroke='currentColor' " +
        "stroke-width='2' " +
        "stroke-linecap='round'/>" +

        "</svg>";


    // ==================================================
    // SEARCH ACTION
    // ==================================================

    searchButton.addEventListener(
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
                    "GEOPLAY SEARCH: Open function not available."
                );
            }
        }
    );


    // ==================================================
    // HOME BUTTON
    // ==================================================

    var homeButton =
        document.createElement(
            "button"
        );


    homeButton.type =
        "button";


    homeButton.className =
        "geoplay-story-action geoplay-story-action-home";


    homeButton.setAttribute(
        "aria-label",
        "Home"
    );


    homeButton.setAttribute(
        "title",
        "Home"
    );


    // ==================================================
    // HOME ICON
    // ==================================================

    homeButton.innerHTML =
        "<svg " +
        "class='geoplay-story-action-icon' " +
        "width='22' " +
        "height='22' " +
        "viewBox='0 0 24 24' " +
        "fill='none' " +
        "xmlns='http://www.w3.org/2000/svg' " +
        "aria-hidden='true'>" +

        "<path " +
        "d='M3.5 10.7L12 3.7L20.5 10.7' " +
        "stroke='currentColor' " +
        "stroke-width='2' " +
        "stroke-linecap='round' " +
        "stroke-linejoin='round'/>" +

        "<path " +
        "d='M5.5 9.8V20H18.5V9.8' " +
        "stroke='currentColor' " +
        "stroke-width='2' " +
        "stroke-linecap='round' " +
        "stroke-linejoin='round'/>" +

        "<path " +
        "d='M9.5 20V14H14.5V20' " +
        "stroke='currentColor' " +
        "stroke-width='2' " +
        "stroke-linecap='round' " +
        "stroke-linejoin='round'/>" +

        "</svg>";


    // ==================================================
    // HOME ACTION
    // ==================================================
    //
    // Intentionally visual-only for now.
    //
    // We are NOT deciding which GameMaker room
    // HOME should eventually open.
    //
    // ==================================================

    homeButton.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "GEOPLAY HOME: Button selected. Destination not assigned yet."
            );
        }
    );


    // ==================================================
    // ADD BUTTONS TO ACTION CONTAINER
    // ==================================================

    actions.appendChild(
        searchButton
    );


    actions.appendChild(
        homeButton
    );


    // ==================================================
    // ADD ACTION CONTAINER DIRECTLY TO DOCUMENT BODY
    // ==================================================
    //
    // IMPORTANT:
    //
    // Do NOT append this to window.geoplayMapUI.
    //
    // The map UI container lives inside the MapLibre
    // map container and can have a different effective
    // coordinate space on mobile browsers.
    //
    // Attaching directly to <body> allows position:fixed
    // to use the actual browser viewport.
    //
    // ==================================================

    if (
        document.body
    )
    {
        document.body.appendChild(
            actions
        );
    }
    else
    {
        console.error(
            "GEOPLAY UI: Document body is not available."
        );

        return 0;
    }


    return 1;
}


// ==================================================
// SHOW STORY ACTIONS
// ==================================================
//
// Called when the introductory robot story has
// finished.
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