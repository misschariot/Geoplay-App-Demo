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
// MODULES:
// - Dialogue: geoplay_map_dialogue.js
// - Destination: geoplay_map_destination.js
// - Find Another / Search: geoplay_map_find_another.js
// - Modal: geoplay_map_modal.js
// - Routing: geoplay_map_route.js
// - Story: geoplay_map_flow.js
// - CSS: geoplay_map.css
//
// ==================================================


// ==================================================
// UI STATE
// ==================================================

window.geoplayMapUI = null;
window.geoplayMapUIInitialized = false;


// ==================================================
// STORY ACTION POSITIONING
// ==================================================

function geoplayMapUIPositionStoryActions()
{
    var actions = document.getElementById(
        "geoplay-story-actions"
    );

    if (!actions)
    {
        return 0;
    }

    var viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;

    if (!viewportWidth || viewportWidth <= 0)
    {
        return 0;
    }

    var actionsWidth =
        actions.getBoundingClientRect().width;

    if (!actionsWidth || actionsWidth <= 0)
    {
        return 0;
    }

    var leftPosition =
        viewportWidth -
        actionsWidth -
        10;

    actions.style.position = "fixed";
    actions.style.left =
        Math.max(0, leftPosition) + "px";
    actions.style.right = "auto";
    actions.style.bottom = "24px";

    return 1;
}


// ==================================================
// STORY ACTION POSITIONING LISTENERS
// ==================================================

function geoplayMapUIInstallStoryActionPositioning()
{
    if (window.geoplayMapUIStoryActionPositioningInstalled)
    {
        return 1;
    }

    window.geoplayMapUIStoryActionPositioningInstalled = true;

    window.addEventListener(
        "resize",
        function()
        {
            geoplayMapUIPositionStoryActions();
        }
    );

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

    if (window.visualViewport)
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
    if (
        window.geoplayMapUIInitialized &&
        window.geoplayMapUI
    )
    {
        return 1;
    }

    var mapContainer = document.getElementById(
        "geoplay-map"
    );

    if (!mapContainer)
    {
        console.error(
            "GEOPLAY UI: Map container not found."
        );

        return 0;
    }

    var ui = document.createElement("div");

    ui.id = "geoplay-map-ui";
    ui.style.position = "absolute";
    ui.style.left = "0";
    ui.style.top = "0";
    ui.style.width = "100%";
    ui.style.height = "100%";
    ui.style.pointerEvents = "none";
    ui.style.zIndex = "1000";
    ui.style.overflow = "hidden";
    ui.style.visibility = "hidden";

    mapContainer.appendChild(ui);

    window.geoplayMapUI = ui;

    // ==================================================
    // LOAD STYLES
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
    // RESPONSIVE POSITIONING
    // ==================================================

    geoplayMapUIInstallStoryActionPositioning();

    setTimeout(
        function()
        {
            geoplayMapUIPositionStoryActions();
        },
        0
    );

    window.geoplayMapUIInitialized = true;

    console.log(
        "GEOPLAY UI: Story UI created."
    );

    return 1;
}


// ==================================================
// LOAD MAP UI STYLESHEET
// ==================================================

function geoplayMapUILoadStylesheet()
{
    var existingStylesheet = document.getElementById(
        "geoplay-map-ui-stylesheet"
    );

    if (existingStylesheet)
    {
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

    var link = document.createElement("link");

    link.id = "geoplay-map-ui-stylesheet";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "html5game/geoplay_map.css";

    link.onload = function()
    {
        console.log(
            "GEOPLAY UI: CSS loaded."
        );

        if (window.geoplayMapUI)
        {
            window.geoplayMapUI.style.visibility =
                "visible";
        }

        setTimeout(
            function()
            {
                geoplayMapUIPositionStoryActions();
            },
            0
        );
    };

    link.onerror = function()
    {
        console.error(
            "GEOPLAY UI: CSS FAILED to load."
        );

        if (window.geoplayMapUI)
        {
            window.geoplayMapUI.style.visibility =
                "visible";
        }

        setTimeout(
            function()
            {
                geoplayMapUIPositionStoryActions();
            },
            0
        );
    };

    document.head.appendChild(link);

    return 1;
}


// ==================================================
// CREATE STORY ACTIONS
// ==================================================

function geoplayMapUICreateStoryActions()
{
    if (
        document.getElementById(
            "geoplay-story-actions"
        )
    )
    {
        return 1;
    }

    var actions = document.createElement("div");

    actions.id = "geoplay-story-actions";
    actions.className =
        "geoplay-story-actions story-hidden";

    actions.style.position = "fixed";
    actions.style.right = "10px";
    actions.style.bottom = "24px";
    actions.style.pointerEvents = "none";
    actions.style.zIndex = "120000";

    // ==================================================
    // SEARCH BUTTON
    // ==================================================

    var searchButton = document.createElement("button");

    searchButton.type = "button";
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

    var homeButton = document.createElement("button");

    homeButton.type = "button";
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
    // ADD ACTIONS
    // ==================================================

    actions.appendChild(searchButton);
    actions.appendChild(homeButton);

    // ==================================================
    // ADD TO DOCUMENT BODY
    // ==================================================

    if (!document.body)
    {
        console.error(
            "GEOPLAY UI: Document body is not available."
        );

        return 0;
    }

    document.body.appendChild(actions);

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

function geoplayMapUIShowStoryActions()
{
    var actions = document.getElementById(
        "geoplay-story-actions"
    );

    if (!actions)
    {
        return 0;
    }

    actions.classList.remove(
        "story-hidden"
    );

    actions.classList.add(
        "visible"
    );

    actions.style.pointerEvents = "auto";

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
    var actions = document.getElementById(
        "geoplay-story-actions"
    );

    if (!actions)
    {
        return 0;
    }

    actions.style.pointerEvents = "none";

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