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
// STORY ACTION VIEWPORT POSITIONING
// ==================================================
//
// SEARCH + HOME are intentionally positioned against
// the REAL browser viewport.
//
// We do not rely on CSS "right" positioning because
// GameMaker HTML5 can introduce a separate canvas /
// rendering coordinate system on mobile browsers.
//
// The controls are measured and positioned explicitly
// using the browser's current viewport width.
//
// ==================================================

function geoplayMapUIPositionStoryActions()
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
    // GET ACTUAL VIEWPORT WIDTH
    // ==================================================

    var viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;


    if (
        !viewportWidth ||
        viewportWidth <= 0
    )
    {
        return 0;
    }


    // ==================================================
    // GET ACTUAL ACTION CONTAINER SIZE
    // ==================================================
    //
    // getBoundingClientRect() gives us the actual
    // rendered CSS-pixel dimensions of the control.
    //
    // This is what we want on phones, tablets and
    // desktop browsers.
    //
    // ==================================================

    var rect =
        actions.getBoundingClientRect();


    var actionsWidth =
        rect.width;


    if (
        !actionsWidth ||
        actionsWidth <= 0
    )
    {
        return 0;
    }


    // ==================================================
    // DESIRED RIGHT EDGE PADDING
    // ==================================================
    //
    // This is intentionally small.
    //
    // The controls should sit close to the physical
    // right edge without touching it.
    //
    // ==================================================

    var rightPadding =
        10;


    // ==================================================
    // CALCULATE EXACT LEFT POSITION
    // ==================================================

    var leftPosition =
        viewportWidth -
        actionsWidth -
        rightPadding;


    // ==================================================
    // SAFETY
    // ==================================================
    //
    // Never allow the controls to move outside the
    // left edge of the viewport.
    //
    // ==================================================

    leftPosition =
        Math.max(
            0,
            leftPosition
        );


    // ==================================================
    // FORCE VIEWPORT-BASED POSITION
    // ==================================================
    //
    // We deliberately use left instead of right.
    //
    // The calculated position is now based on the
    // actual browser width.
    //
    // ==================================================

    actions.style.position =
        "fixed";


    actions.style.left =
        leftPosition +
        "px";


    actions.style.right =
        "auto";


    // ==================================================
    // KEEP THE EXISTING VERTICAL POSITION
    // ==================================================

    actions.style.bottom =
        "24px";


    return 1;
}


// ==================================================
// INSTALL STORY ACTION VIEWPORT LISTENERS
// ==================================================
//
// Mobile browsers can change their viewport when:
// - orientation changes
// - browser UI expands/collapses
// - device dimensions change
// - simulator size changes
//
// Recalculate whenever that happens.
//
// ==================================================

function geoplayMapUIInstallStoryActionPositioning()
{
    // ==================================================
    // PREVENT DUPLICATE LISTENERS
    // ==================================================

    if (
        window.geoplayMapUIStoryActionPositioningInstalled
    )
    {
        return 1;
    }


    window.geoplayMapUIStoryActionPositioningInstalled =
        true;


    // ==================================================
    // STANDARD RESIZE
    // ==================================================

    window.addEventListener(
        "resize",
        function()
        {
            geoplayMapUIPositionStoryActions();
        }
    );


    // ==================================================
    // ORIENTATION CHANGE
    // ==================================================

    window.addEventListener(
        "orientationchange",
        function()
        {
            setTimeout(
                function()
                {
                    geoplayMapUIPositionStoryActions();
                },
                100
            );
        }
    );


    // ==================================================
    // VISUAL VIEWPORT
    // ==================================================
    //
    // Supported by modern mobile browsers.
    //
    // This catches changes to the visual viewport
    // that don't always trigger a normal resize.
    //
    // ==================================================

    if (
        window.visualViewport
    )
    {
        window.visualViewport.addEventListener(
            "resize",
            function()
            {
                geoplayMapUIPositionStoryActions();
            }
        );


        window.visualViewport.addEventListener(
            "scroll",
            function()
            {
                geoplayMapUIPositionStoryActions();
            }
        );
    }


    return 1;
}


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
    // INSTALL RESPONSIVE POSITIONING
    // ==================================================

    geoplayMapUIInstallStoryActionPositioning();


    // ==================================================
    // INITIAL POSITION
    // ==================================================
    //
    // Run after the DOM has had an opportunity to
    // calculate the action container's dimensions.
    //
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapUIPositionStoryActions();
        },
        0
    );


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


            // ==================================================
            // CSS HAS LOADED — RECALCULATE POSITION
            // ==================================================

            setTimeout(
                function()
                {
                    geoplayMapUIPositionStoryActions();
                },
                0
            );
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


            // ==================================================
            // POSITION EVEN IF CSS FAILS
            // ==================================================

            setTimeout(
                function()
                {
                    geoplayMapUIPositionStoryActions();
                },
                0
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

    actions.className =
        "geoplay-story-actions story-hidden";


    // ==================================================
    // VIEWPORT POSITIONING
    // ==================================================

    actions.style.position =
        "fixed";


    // ==================================================
    // RIGHT IS TEMPORARILY SET FOR INITIAL LAYOUT
    // ==================================================
    //
    // The JavaScript viewport-positioning function
    // replaces this with an exact left coordinate.
    //
    // ==================================================

    actions.style.right =
        "10px";


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
    // This keeps the controls independent from the
    // MapLibre/GameMaker map coordinate system.
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


    // ==================================================
    // POSITION AFTER INSERTION
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapUIPositionStoryActions();
        },
        0
    );


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


    // ==================================================
    // RECALCULATE POSITION
    // ==================================================
    //
    // The visible state may change the measured
    // dimensions, so calculate again after showing.
    //
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapUIPositionStoryActions();
        },
        0
    );


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