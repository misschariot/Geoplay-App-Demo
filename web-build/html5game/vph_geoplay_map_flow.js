// ==================================================
// GEOPLAY MAP FLOW
// STORY ORCHESTRATION
// ==================================================
//
// RESPONSIBILITY:
// - Story sequence
// - Dialogue timing
// - Scripted camera transitions
// - Story state
// - Story completion
// - GameMaker story callbacks
//
// ROUTING:
// - geoplay_map_route.js
//
// STORY INTERACTION:
// - Player interaction is locked when the story begins.
// - Scripted camera movement continues normally.
// - Player interaction remains locked during the story.
// - Player interaction is unlocked when the story finishes.
//
// IMPORTANT:
// - This file does NOT calculate route geometry.
// - This file does NOT animate the route.
// - This file does NOT control route camera movement.
// - Those responsibilities belong to geoplay_map_route.js.
// ==================================================


// ==================================================
// STORY STATE
// ==================================================

window.geoplayMapFlowStarted =
    false;


window.geoplayMapFlowFinished =
    false;


// ==================================================
// STORY TIMING
// ==================================================
//
// These values control the pacing between
// story and dialogue moments.
//
// Dialogue typing speed is controlled separately
// by geoplay_map_dialogue.js.
//
// ==================================================

var geoplayFlowFindPlayerDuration =
    3000;


var geoplayFlowPlayerPause =
    2800;


var geoplayFlowSearchIntroPause =
    2400;


var geoplayFlowSearchDuration =
    4500;


var geoplayFlowDestinationTravelDuration =
    1800;


var geoplayFlowDestinationPause =
    2800;


var geoplayFlowReturnDuration =
    1800;


var geoplayFlowPropertyPause =
    2200;


var geoplayFlowCompletePause =
    3000;


// ==================================================
// START STORY
// ==================================================

function geoplayMapFlowStart()
{
    if (
        window.geoplayMapFlowStarted
    )
    {
        return;
    }


    window.geoplayMapFlowStarted =
        true;


    window.geoplayMapFlowFinished =
        false;


    // ==================================================
    // KEEP PINE RIDGE OFF-SCREEN INDICATOR HIDDEN
    // DURING THE ENTIRE STORY.
    // ==================================================

    window.geoplayDestinationIndicatorEnabled =
        false;


    console.log(
        "GEOPLAY FLOW: Story beginning."
    );


    // ==================================================
    // LOCK PLAYER MAP INTERACTION
    // ==================================================

    if (
        typeof geoplayMapLockInteraction ===
        "function"
    )
    {
        geoplayMapLockInteraction();
    }


    // ==================================================
    // CREATE MAP UI
    // ==================================================

    geoplayMapUICreate();


    // ==================================================
    // BEGIN STORY
    // ==================================================

    geoplayMapFlowFindPlayer();
}


// ==================================================
// 1. FIND PLAYER
// ==================================================

function geoplayMapFlowFindPlayer()
{
    geoplayMapUISay(
        "Hmm, let's see where you are."
    );


    setTimeout(
        function()
        {
            geoplayMapFlowPlayerFound();
        },
        geoplayFlowFindPlayerDuration
    );
}


// ==================================================
// 2. PLAYER FOUND
// ==================================================

function geoplayMapFlowPlayerFound()
{
    console.log(
        "GEOPLAY FLOW: Player found."
    );


    // ==================================================
    // SHOW PLAYER MARKER
    // ==================================================

    geoplayMapShowPlayerMarker();


    if (
        typeof geoplayMapPlayerMarkerPop ===
        "function"
    )
    {
        geoplayMapPlayerMarkerPop();
    }


    // ==================================================
    // PLAYER DIALOGUE
    // ==================================================

    geoplayMapUISay(
        "There you are!"
    );


    // ==================================================
    // CENTER CAMERA ON PLAYER
    // ==================================================

    if (
        window.geoplayMap
    )
    {
        window.geoplayMap.easeTo(
        {
            center:
            [
                geoplayMapLongitude,
                geoplayMapLatitude
            ],

            zoom:
                15.5,

            bearing:
                0,

            pitch:
                0,

            duration:
                700,

            essential:
                true
        });
    }


    // ==================================================
    // CONTINUE STORY
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowBeginSearch();
        },
        geoplayFlowPlayerPause
    );
}


// ==================================================
// 3. BEGIN SEARCH
// ==================================================

function geoplayMapFlowBeginSearch()
{
    geoplayMapUISay(
        "Let's see what's nearby"
    );


    setTimeout(
        function()
        {
            geoplayMapFlowSearchArea();
        },
        geoplayFlowSearchIntroPause
    );
}


// ==================================================
// 4. SEARCH
// ==================================================

function geoplayMapFlowSearchArea()
{
    console.log(
        "GEOPLAY FLOW: Searching nearby."
    );


    geoplayMapUISay(
        "(Looking around)"
    );


    // ==================================================
    // PULL CAMERA BACK TO SHOW SEARCH AREA
    // ==================================================

    if (
        window.geoplayMap
    )
    {
        window.geoplayMap.easeTo(
        {
            center:
            [
                geoplayMapLongitude,
                geoplayMapLatitude
            ],

            zoom:
                13.7,

            bearing:
                0,

            pitch:
                0,

            duration:
                2200,

            essential:
                true
        });
    }


    // ==================================================
    // COMPLETE SEARCH
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowSearchComplete();
        },
        geoplayFlowSearchDuration
    );
}


// ==================================================
// 5. PROPERTY FOUND
// ==================================================

function geoplayMapFlowSearchComplete()
{
    console.log(
        "GEOPLAY FLOW: Property discovered."
    );


    geoplayMapUISay(
        "Oh! I found a place!"
    );


    // ==================================================
    // SHOW PINE RIDGE DESTINATION MARKER
    // ==================================================

    geoplayMapShowDestinationMarker();


    // ==================================================
    // GIVE PLAYER TIME TO READ DISCOVERY
    // BEFORE CAMERA MOVES.
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowTravelToDestination();
        },
        1800
    );
}


// ==================================================
// 6. TRAVEL TO DESTINATION
// ==================================================

function geoplayMapFlowTravelToDestination()
{
    console.log(
        "GEOPLAY FLOW: Moving camera to destination."
    );


    // ==================================================
    // FAIL SAFE
    // ==================================================

    if (
        !window.geoplayMap
    )
    {
        geoplayMapFlowDestinationArrived();

        return;
    }


    // ==================================================
    // MOVE CAMERA TO PINE RIDGE
    // ==================================================

    window.geoplayMap.easeTo(
    {
        center:
        [
            geoplayDestinationLongitude,
            geoplayDestinationLatitude
        ],

        zoom:
            15.2,

        bearing:
            0,

        pitch:
            0,

        duration:
            geoplayFlowDestinationTravelDuration,

        essential:
            true
    });


    // ==================================================
    // CONTINUE WHEN CAMERA ARRIVES
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowDestinationArrived();
        },
        geoplayFlowDestinationTravelDuration
    );
}


// ==================================================
// 7. DESTINATION ARRIVED
// ==================================================

function geoplayMapFlowDestinationArrived()
{
    console.log(
        "GEOPLAY FLOW: Destination reached."
    );


    // ==================================================
    // SHOW PINE RIDGE CARD
    // ==================================================

    geoplayMapUIShowDestination();


    // ==================================================
    // DESTINATION DIALOGUE
    // ==================================================

    geoplayMapUISay(
        "There it is!"
    );


    // ==================================================
    // HOLD ON DESTINATION
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowReturnToPlayer();
        },
        geoplayFlowDestinationPause
    );
}


// ==================================================
// 8. RETURN CAMERA TO PLAYER
// ==================================================

function geoplayMapFlowReturnToPlayer()
{
    console.log(
        "GEOPLAY FLOW: Returning camera to player."
    );


    geoplayMapUISay(
        "Let's calculate the distance from your position"
    );


    // ==================================================
    // FAIL SAFE
    // ==================================================

    if (
        !window.geoplayMap
    )
    {
        geoplayMapFlowRequestRoute();

        return;
    }


    // ==================================================
    // RETURN CAMERA TO PLAYER
    // ==================================================

    window.geoplayMap.easeTo(
    {
        center:
        [
            geoplayMapLongitude,
            geoplayMapLatitude
        ],

        zoom:
            15.2,

        bearing:
            0,

        pitch:
            0,

        duration:
            geoplayFlowReturnDuration,

        essential:
            true
    });


    // ==================================================
    // REQUEST ROAD ROUTE AFTER CAMERA RETURNS
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowRequestRoute();
        },
        geoplayFlowReturnDuration
    );
}


// ==================================================
// 9. REQUEST ROAD ROUTE
// ==================================================
//
// The route engine owns:
//
// - OSRM request
// - Route validation
// - Route geometry
// - Route animation
// - Route camera behavior
// - Route fallback
//
// Story flow only tells the route engine when to start
// and what should happen when routing is complete.
// ==================================================

function geoplayMapFlowRequestRoute()
{
    console.log(
        "GEOPLAY ROUTING: Requesting road route."
    );


    // ==================================================
    // VERIFY ROUTE MODULE
    // ==================================================

    if (
        typeof geoplayMapRouteRequest !==
        "function"
    )
    {
        console.error(
            "GEOPLAY ROUTING: Route module is not loaded."
        );


        geoplayMapFlowStartFallbackRoute();

        return;
    }


    // ==================================================
    // REQUEST ROUTE
    // ==================================================

    geoplayMapRouteRequest(
        geoplayMapLongitude,
        geoplayMapLatitude,

        geoplayDestinationLongitude,
        geoplayDestinationLatitude,

        // ==================================================
        // SUCCESS
        // ==================================================

        function(
            geometry,
            distance,
            duration
        )
        {
            geoplayMapFlowHandleRoute(
                geometry,
                distance,
                duration
            );
        },

        // ==================================================
        // FAILURE
        // ==================================================

        function()
        {
            geoplayMapFlowStartFallbackRoute();
        }
    );
}


// ==================================================
// 10. HANDLE ROUTE
// ==================================================

function geoplayMapFlowHandleRoute(
    geometry,
    distance,
    duration
)
{
    // ==================================================
    // VALIDATE ROUTE
    // ==================================================

    if (
        !geometry ||
        !geometry.coordinates ||
        geometry.coordinates.length < 2
    )
    {
        geoplayMapFlowStartFallbackRoute();

        return;
    }


    console.log(
        "GEOPLAY ROUTING: Real road route received."
    );


    // ==================================================
    // LOG ROUTE DISTANCE
    // ==================================================

    if (
        typeof distance ===
        "number"
    )
    {
        console.log(
            "GEOPLAY ROUTING: Distance = " +
            distance +
            " meters"
        );
    }


    // ==================================================
    // LOG ROUTE DURATION
    // ==================================================

    if (
        typeof duration ===
        "number"
    )
    {
        console.log(
            "GEOPLAY ROUTING: Duration = " +
            duration +
            " seconds"
        );
    }


    // ==================================================
    // VERIFY ROUTE ANIMATION MODULE
    // ==================================================

    if (
        typeof geoplayMapRouteAnimate !==
        "function"
    )
    {
        console.error(
            "GEOPLAY ROUTING: Route animation module is not loaded."
        );


        geoplayMapFlowStartFallbackRoute();

        return;
    }


    // ==================================================
    // SEND ROUTE TO ROUTE ENGINE
    // ==================================================

    geoplayMapRouteAnimate(
        geometry,

        geoplayDestinationLongitude,
        geoplayDestinationLatitude,

        function()
        {
            geoplayMapFlowRouteArrived();
        }
    );
}


// ==================================================
// START FALLBACK ROUTE
// ==================================================
//
// Used only when the real road route cannot be
// requested or animated.
//
// ==================================================

function geoplayMapFlowStartFallbackRoute()
{
    // ==================================================
    // VERIFY FALLBACK MODULE
    // ==================================================

    if (
        typeof geoplayMapRouteFallback !==
        "function"
    )
    {
        console.error(
            "GEOPLAY ROUTING: Route fallback module is not loaded."
        );


        // Continue the story rather than leaving
        // the player stuck.
        geoplayMapFlowRouteArrived();

        return;
    }


    console.warn(
        "GEOPLAY ROUTING: Using fallback route."
    );


    geoplayMapRouteFallback(
        geoplayMapLongitude,
        geoplayMapLatitude,

        geoplayDestinationLongitude,
        geoplayDestinationLatitude,

        function()
        {
            geoplayMapFlowRouteArrived();
        }
    );
}


// ==================================================
// 11. ROUTE ARRIVED
// ==================================================

function geoplayMapFlowRouteArrived()
{
    console.log(
        "GEOPLAY FLOW: Route arrived."
    );


    setTimeout(
        function()
        {
            geoplayMapFlowPropertyReveal();
        },
        geoplayFlowPropertyPause
    );
}


// ==================================================
// 12. PROPERTY DIALOGUE
// ==================================================

function geoplayMapFlowPropertyReveal()
{
    geoplayMapUISay(
        "There we go!"
    );


    setTimeout(
        function()
        {
            geoplayMapUISay(
                "You can play geoplay games here!"
            );


            setTimeout(
                function()
                {
                    geoplayMapFlowFinish();
                },
                geoplayFlowCompletePause
            );
        },
        geoplayFlowPropertyPause
    );
}


// ==================================================
// COMPLETE STORY
// ==================================================

function geoplayMapFlowFinish()
{
    if (
        window.geoplayMapFlowFinished
    )
    {
        return;
    }


    window.geoplayMapFlowFinished =
        true;


    // ==================================================
    // ENABLE PINE RIDGE OFF-SCREEN INDICATOR
    // ==================================================

    window.geoplayDestinationIndicatorEnabled =
        true;


    // ==================================================
    // RECALCULATE DESTINATION POSITION
    // ==================================================

    if (
        typeof geoplayMapUIUpdatePositions ===
        "function"
    )
    {
        geoplayMapUIUpdatePositions();
    }


    console.log(
        "GEOPLAY FLOW: Story complete."
    );


    // ==================================================
    // UNLOCK PLAYER MAP INTERACTION
    // ==================================================

    if (
        typeof geoplayMapUnlockInteraction ===
        "function"
    )
    {
        geoplayMapUnlockInteraction();
    }


    // ==================================================
    // CLEAR ROBOT DIALOGUE
    // ==================================================

    geoplayMapUISay(
        ""
    );


    // ==================================================
    // SHOW POST-STORY ACTIONS
    // ==================================================

    if (
        typeof geoplayMapUIShowStoryActions ===
        "function"
    )
    {
        geoplayMapUIShowStoryActions();
    }
}


// ==================================================
// FIND ANOTHER
// ==================================================
//
// GameMaker callback placeholder.
// The actual SEARCH UI is handled by:
// geoplay_map_find_another.js
//
// ==================================================

function gmcallback_geoplay_location_find_another()
{
    console.log(
        "GEOPLAY FLOW: Find Another selected."
    );


    // Future location-search flow goes here.
}


// ==================================================
// BROWSE
// ==================================================
//
// GameMaker callback placeholder.
// ==================================================

function gmcallback_geoplay_location_browse()
{
    console.log(
        "GEOPLAY FLOW: Browse selected."
    );


    // Future app browsing flow goes here.
}


// ==================================================
// LEGACY CONTINUE COMPATIBILITY
// ==================================================
//
// Kept temporarily so existing GameMaker references
// do not break while the project is being cleaned up.
//
// This can be removed later after we verify that
// GameMaker no longer references it.
// ==================================================

function gmcallback_geoplay_location_continue()
{
    console.log(
        "GEOPLAY FLOW: Legacy Continue selected."
    );


    if (
        typeof geoplayMapUIShowStoryActions ===
        "function"
    )
    {
        geoplayMapUIShowStoryActions();
    }
}


// ==================================================
// END GEOPLAY MAP FLOW
// ==================================================