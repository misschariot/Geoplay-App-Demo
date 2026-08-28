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
// ROUTING is handled by:
// - geoplay_map_route.js
//
// STORY INTERACTION:
// - Player interaction is LOCKED when story begins.
// - Scripted camera movement continues normally.
// - Player interaction remains locked during the
//   entire story.
// - Player interaction is UNLOCKED only when the
//   story has finished.
// ==================================================


window.geoplayMapFlowStarted =
    false;

window.geoplayMapFlowFinished =
    false;


// ==================================================
// TIMING
// ==================================================
//
// These timings control the pacing between
// story/dialogue moments.
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
// START
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


    geoplayMapUICreate();


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


    geoplayMapShowPlayerMarker();


    if (
        typeof geoplayMapPlayerMarkerPop ===
        "function"
    )
    {
        geoplayMapPlayerMarkerPop();
    }


    geoplayMapUISay(
        "There you are!"
    );


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


    geoplayMapShowDestinationMarker();


    // ==================================================
    // GIVE THE PLAYER TIME TO READ THE DISCOVERY
    // BEFORE THE CAMERA STARTS MOVING.
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
// 6. CAMERA GOES TO DESTINATION
// ==================================================

function geoplayMapFlowTravelToDestination()
{
    console.log(
        "GEOPLAY FLOW: Moving camera to destination."
    );


    if (
        !window.geoplayMap
    )
    {
        geoplayMapFlowDestinationArrived();

        return;
    }


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


    geoplayMapUIShowDestination();


    geoplayMapUISay(
        "There it is!"
    );


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


    if (
        !window.geoplayMap
    )
    {
        geoplayMapFlowRequestRoute();

        return;
    }


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
// - OSRM requests
// - Route validation
// - Route geometry
// - Route animation
// - Route camera behavior
//
// Story flow only tells the route engine when to start
// and what should happen when routing is complete.
// ==================================================

function geoplayMapFlowRequestRoute()
{
    console.log(
        "GEOPLAY ROUTING: Requesting road route."
    );


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


    geoplayMapRouteRequest(
        geoplayMapLongitude,
        geoplayMapLatitude,
        geoplayDestinationLongitude,
        geoplayDestinationLatitude,

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

        function()
        {
            geoplayMapFlowStartFallbackRoute();
        }
    );
}


// ==================================================
// HANDLE ROUTE
// ==================================================

function geoplayMapFlowHandleRoute(
    geometry,
    distance,
    duration
)
{
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

function geoplayMapFlowStartFallbackRoute()
{
    if (
        typeof geoplayMapRouteFallback !==
        "function"
    )
    {
        console.error(
            "GEOPLAY ROUTING: Route fallback module is not loaded."
        );


        geoplayMapFlowRouteArrived();

        return;
    }


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
// COMPLETE
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
    // STORY IS NOW COMPLETE.
    // ENABLE THE PINE RIDGE OFF-SCREEN INDICATOR.
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
    // STORY IS OVER
    // PLAYER CAN CONTROL THE MAP AGAIN.
    // ==================================================

    if (
        typeof geoplayMapUnlockInteraction ===
        "function"
    )
    {
        geoplayMapUnlockInteraction();
    }


    // ==================================================
    // CLOSE ROBOT DIALOGUE
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

function gmcallback_geoplay_location_browse()
{
    console.log(
        "GEOPLAY FLOW: Browse selected."
    );


    // Future app browsing flow goes here.
}


// ==================================================
// LEGACY CONTINUE
// ==================================================
//
// Kept temporarily so existing GameMaker
// references do not break.
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