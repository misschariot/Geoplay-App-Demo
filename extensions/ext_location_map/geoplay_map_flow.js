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
//
// FLOW PHILOSOPHY:
// - Real map events drive the story whenever possible.
// - Dialogue completion drives transitions where appropriate.
// - Timers are reserved for actual visual/map pauses.
// - Dialogue hides when the map needs visual attention.
// ==================================================


// ==================================================
// STORY STATE
// ==================================================

window.geoplayMapFlowStarted =
    false;


window.geoplayMapFlowFinished =
    false;


// ==================================================
// SEARCH VISUAL STATE
// ==================================================

window.geoplayMapFlowSearchIndicator =
    null;


// ==================================================
// ROUTE STORY SYNCHRONIZATION STATE
// ==================================================

window.geoplayMapFlowDistanceCameraFinished =
    false;


window.geoplayMapFlowRouteReady =
    false;


window.geoplayMapFlowRouteStarted =
    false;


window.geoplayMapFlowRouteGeometry =
    null;


// ==================================================
// CALCULATED ROUTE DISTANCE
// ==================================================

window.geoplayDestinationDistanceMiles =
    null;


// ==================================================
// DESTINATION
// ==================================================

window.geoplayDestinationName =
    "Pine Ridge Casino";


// ==================================================
// STORY TIMING
// ==================================================
//
// These are intentionally kept short so the demo has
// good momentum without feeling rushed.
//
// Dialogue pacing is handled by the dialogue system.
// These values control actual map/visual transitions.
//
// ==================================================

var geoplayFlowOpeningPause =
    600;


var geoplayFlowFindPlayerPause =
    450;


var geoplayFlowSearchDuration =
    3200;


var geoplayFlowDestinationPause =
    500;


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
    // RESET SEARCH VISUAL
    // ==================================================

    geoplayMapFlowHideSearchIndicator();


    // ==================================================
    // RESET ROUTE STATE
    // ==================================================

    window.geoplayMapFlowDistanceCameraFinished =
        false;


    window.geoplayMapFlowRouteReady =
        false;


    window.geoplayMapFlowRouteStarted =
        false;


    window.geoplayMapFlowRouteGeometry =
        null;


    window.geoplayDestinationDistanceMiles =
        null;


    // ==================================================
    // KEEP DESTINATION INDICATOR HIDDEN
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
    // OPENING BREATHING ROOM
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowFindPlayer();
        },
        geoplayFlowOpeningPause
    );
}


// ==================================================
// SEARCH VISUAL
// ==================================================

function geoplayMapFlowCreateSearchIndicator()
{
    // ==================================================
    // ALREADY EXISTS
    // ==================================================

    if (
        window.geoplayMapFlowSearchIndicator
    )
    {
        return window.geoplayMapFlowSearchIndicator;
    }


    // ==================================================
    // FIND MAP UI CONTAINER
    // ==================================================

    if (
        !window.geoplayMapUI
    )
    {
        return null;
    }


    // ==================================================
    // CREATE CENTERED SEARCH INDICATOR
    // ==================================================

    var indicator =
        document.createElement(
            "div"
        );


    indicator.id =
        "geoplay-search-indicator";


    indicator.style.position =
        "absolute";


    indicator.style.left =
        "50%";


    indicator.style.top =
        "50%";


    indicator.style.transform =
        "translate(-50%, -50%)";


    indicator.style.width =
        "260px";


    indicator.style.minHeight =
        "150px";


    indicator.style.boxSizing =
        "border-box";


    indicator.style.display =
        "flex";


    indicator.style.flexDirection =
        "column";


    indicator.style.alignItems =
        "center";


    indicator.style.justifyContent =
        "center";


    indicator.style.gap =
        "12px";


    indicator.style.padding =
        "22px 28px";


    indicator.style.borderRadius =
        "24px";


    indicator.style.background =
        "rgba(10, 8, 35, 0.88)";


    indicator.style.border =
        "1.5px solid rgba(94, 190, 255, 0.65)";


    indicator.style.boxShadow =
        "0 0 28px rgba(94, 190, 255, 0.22), inset 0 0 18px rgba(94, 190, 255, 0.06)";


    indicator.style.pointerEvents =
        "none";


    indicator.style.zIndex =
        "105";


    indicator.style.opacity =
        "0";


    indicator.style.visibility =
        "hidden";


    indicator.style.transition =
        "opacity 250ms ease, visibility 250ms ease";


    // ==================================================
    // SEARCH ICON
    // ==================================================

    var icon =
        document.createElement(
            "div"
        );


    icon.style.position =
        "relative";


    icon.style.width =
        "52px";


    icon.style.height =
        "52px";


    icon.style.border =
        "2px solid rgba(94, 190, 255, 0.9)";


    icon.style.borderRadius =
        "50%";


    icon.style.boxSizing =
        "border-box";


    icon.style.animation =
        "geoplaySearchIconPulse 1.5s ease-in-out infinite";


    // ==================================================
    // SEARCH GLASS
    // ==================================================

    var glass =
        document.createElement(
            "div"
        );


    glass.style.position =
        "absolute";


    glass.style.left =
        "11px";


    glass.style.top =
        "9px";


    glass.style.width =
        "23px";


    glass.style.height =
        "23px";


    glass.style.border =
        "3px solid rgba(255, 255, 255, 0.95)";


    glass.style.borderRadius =
        "50%";


    glass.style.boxSizing =
        "border-box";


    // ==================================================
    // SEARCH HANDLE
    // ==================================================

    var handle =
        document.createElement(
            "div"
        );


    handle.style.position =
        "absolute";


    handle.style.width =
        "14px";


    handle.style.height =
        "3px";


    handle.style.left =
        "30px";


    handle.style.top =
        "33px";


    handle.style.borderRadius =
        "3px";


    handle.style.background =
        "rgba(255, 255, 255, 0.95)";


    handle.style.transform =
        "rotate(45deg)";


    handle.style.transformOrigin =
        "left center";


    icon.appendChild(
        glass
    );


    icon.appendChild(
        handle
    );


    // ==================================================
    // SEARCH TEXT
    // ==================================================

    var label =
        document.createElement(
            "div"
        );


    label.style.fontFamily =
        "Arial, sans-serif";


    label.style.fontSize =
        "15px";


    label.style.fontWeight =
        "700";


    label.style.letterSpacing =
        "1.5px";


    label.style.textAlign =
        "center";


    label.style.color =
        "rgba(255, 255, 255, 0.95)";


    label.style.textShadow =
        "0 0 8px rgba(94, 190, 255, 0.45)";


    label.textContent =
        "SEARCHING NEARBY";


    // ==================================================
    // SEARCH DOTS
    // ==================================================

    var dots =
        document.createElement(
            "span"
        );


    dots.textContent =
        "...";


    dots.style.display =
        "inline-block";


    dots.style.width =
        "20px";


    dots.style.textAlign =
        "left";


    dots.style.overflow =
        "hidden";


    dots.style.animation =
        "geoplaySearchDots 1.2s steps(4, end) infinite";


    label.appendChild(
        dots
    );


    // ==================================================
    // BUILD INDICATOR
    // ==================================================

    indicator.appendChild(
        icon
    );


    indicator.appendChild(
        label
    );


    // ==================================================
    // ADD ANIMATION KEYFRAMES
    // ==================================================

    geoplayMapFlowEnsureSearchAnimations();


    // ==================================================
    // ADD TO MAP UI
    // ==================================================

    window.geoplayMapUI.appendChild(
        indicator
    );


    window.geoplayMapFlowSearchIndicator =
        indicator;


    return indicator;
}


// ==================================================
// CREATE SEARCH ANIMATIONS
// ==================================================

function geoplayMapFlowEnsureSearchAnimations()
{
    if (
        document.getElementById(
            "geoplay-search-animation-style"
        )
    )
    {
        return;
    }


    var style =
        document.createElement(
            "style"
        );


    style.id =
        "geoplay-search-animation-style";


    style.textContent =

        "@keyframes geoplaySearchIconPulse {" +

            "0%, 100% {" +
                "transform: scale(0.94);" +
                "opacity: 0.82;" +
            "}" +

            "50% {" +
                "transform: scale(1.06);" +
                "opacity: 1;" +
            "}" +

        "}" +


        "@keyframes geoplaySearchDots {" +

            "0% {" +
                "width: 0px;" +
            "}" +

            "25% {" +
                "width: 7px;" +
            "}" +

            "50% {" +
                "width: 12px;" +
            "}" +

            "75%, 100% {" +
                "width: 20px;" +
            "}" +

        "}";


    document.head.appendChild(
        style
    );
}


// ==================================================
// POSITION SEARCH INDICATOR
// ==================================================

function geoplayMapFlowPositionSearchIndicator()
{
    var indicator =
        window.geoplayMapFlowSearchIndicator;


    if (
        !indicator
    )
    {
        return;
    }


    indicator.style.left =
        "50%";


    indicator.style.top =
        "50%";


    indicator.style.transform =
        "translate(-50%, -50%)";
}


// ==================================================
// SHOW SEARCH INDICATOR
// ==================================================

function geoplayMapFlowShowSearchIndicator()
{
    var indicator =
        geoplayMapFlowCreateSearchIndicator();


    if (
        !indicator
    )
    {
        return 0;
    }


    geoplayMapFlowPositionSearchIndicator();


    indicator.style.visibility =
        "visible";


    indicator.style.opacity =
        "1";


    console.log(
        "GEOPLAY FLOW: Centered search indicator shown."
    );


    return 1;
}


// ==================================================
// HIDE SEARCH INDICATOR
// ==================================================

function geoplayMapFlowHideSearchIndicator()
{
    var indicator =
        window.geoplayMapFlowSearchIndicator;


    if (
        indicator
    )
    {
        indicator.style.opacity =
            "0";


        indicator.style.visibility =
            "hidden";
    }


    console.log(
        "GEOPLAY FLOW: Search indicator hidden."
    );
}


// ==================================================
// 1. FIND PLAYER
// ==================================================

function geoplayMapFlowFindPlayer()
{
    geoplayMapUISay(
        "Hmm... let's see where you are.",
        function()
        {
            console.log(
                "GEOPLAY FLOW: Location dialogue finished."
            );


            geoplayMapFlowRequestPlayerLocation();
        }
    );
}


// ==================================================
// REQUEST PLAYER LOCATION
// ==================================================

function geoplayMapFlowRequestPlayerLocation()
{
    setTimeout(
        function()
        {
            console.log(
                "GEOPLAY FLOW: Requesting real player location."
            );


            if (
                typeof geoplayMapGetRealPlayerLocation !==
                "function"
            )
            {
                console.warn(
                    "GEOPLAY FLOW: Real location function unavailable. Using fallback location."
                );


                geoplayMapFlowPlayerFound();

                return;
            }


            geoplayMapGetRealPlayerLocation(
                function(
                    longitude,
                    latitude
                )
                {
                    console.log(
                        "GEOPLAY FLOW: Real player location found."
                    );


                    if (
                        window.geoplayMap
                    )
                    {
                        window.geoplayMap.once(
                            "moveend",
                            function()
                            {
                                geoplayMapFlowPlayerFound();
                            }
                        );


                        window.geoplayMap.easeTo(
                        {
                            center:
                            [
                                longitude,
                                latitude
                            ],

                            zoom:
                                15.5,

                            bearing:
                                0,

                            pitch:
                                0,

                            duration:
                                1400,

                            essential:
                                true
                        });


                        return;
                    }


                    geoplayMapFlowPlayerFound();
                },


                function(error)
                {
                    console.warn(
                        "GEOPLAY FLOW: Real location could not be determined. Using fallback location.",
                        error
                    );


                    geoplayMapFlowPlayerFound();
                }
            );
        },
        geoplayFlowFindPlayerPause
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
        "There you are!",
        function()
        {
            geoplayMapFlowBeginSearch();
        }
    );
}


// ==================================================
// 3. BEGIN SEARCH
// ==================================================

function geoplayMapFlowBeginSearch()
{
    geoplayMapUISay(
        "Alright... let's see what we can find nearby.",
        function()
        {
            // ==================================================
            // DIALOGUE GETS OUT OF THE WAY
            // ==================================================

            geoplayMapUIHideDialogue();


            // ==================================================
            // BEGIN VISUAL SEARCH EVENT
            // ==================================================

            geoplayMapFlowSearchArea();
        }
    );
}


// ==================================================
// 4. GENERATE NEARBY CASINO
// ==================================================

function geoplayMapFlowGenerateNearbyCasino()
{
    var minimumMiles =
        5;


    var maximumMiles =
        10;


    var distanceMiles =
        minimumMiles +
        (
            Math.random() *
            (
                maximumMiles -
                minimumMiles
            )
        );


    var bearingDegrees =
        Math.random() *
        360;


    var earthRadiusMiles =
        3958.7613;


    var angularDistance =
        distanceMiles /
        earthRadiusMiles;


    var playerLatitudeRadians =
        geoplayMapLatitude *
        Math.PI /
        180;


    var playerLongitudeRadians =
        geoplayMapLongitude *
        Math.PI /
        180;


    var bearingRadians =
        bearingDegrees *
        Math.PI /
        180;


    var destinationLatitudeRadians =
        Math.asin(
            Math.sin(
                playerLatitudeRadians
            ) *
            Math.cos(
                angularDistance
            )
            +
            Math.cos(
                playerLatitudeRadians
            ) *
            Math.sin(
                angularDistance
            ) *
            Math.cos(
                bearingRadians
            )
        );


    var destinationLongitudeRadians =
        playerLongitudeRadians
        +
        Math.atan2(
            Math.sin(
                bearingRadians
            ) *
            Math.sin(
                angularDistance
            ) *
            Math.cos(
                playerLatitudeRadians
            ),

            Math.cos(
                angularDistance
            )
            -
            Math.sin(
                playerLatitudeRadians
            ) *
            Math.sin(
                destinationLatitudeRadians
            )
        );


    var destinationLatitude =
        destinationLatitudeRadians *
        180 /
        Math.PI;


    var destinationLongitude =
        destinationLongitudeRadians *
        180 /
        Math.PI;


    window.geoplayDestinationLongitude =
        destinationLongitude;


    window.geoplayDestinationLatitude =
        destinationLatitude;


    window.geoplayGeneratedDestinationDistanceMiles =
        distanceMiles;


    window.geoplayDestinationDistanceMiles =
        null;


    console.log(
        "GEOPLAY FLOW: Nearby casino generated."
    );


    console.log(
        "GEOPLAY FLOW: Generated distance = " +
        distanceMiles.toFixed(1) +
        " miles."
    );


    console.log(
        "GEOPLAY FLOW: Casino longitude = " +
        destinationLongitude
    );


    console.log(
        "GEOPLAY FLOW: Casino latitude = " +
        destinationLatitude
    );


    return 1;
}


// ==================================================
// 5. SEARCH
// ==================================================

function geoplayMapFlowSearchArea()
{
    console.log(
        "GEOPLAY FLOW: Searching nearby."
    );


    // ==================================================
    // SHOW SEARCH VISUAL
    // ==================================================

    geoplayMapFlowShowSearchIndicator();


    // ==================================================
    // PULL CAMERA BACK
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
                1800,

            essential:
                true
        });
    }


    // ==================================================
    // SEARCH COMPLETION
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
// 6. PROPERTY FOUND
// ==================================================

function geoplayMapFlowSearchComplete()
{
    console.log(
        "GEOPLAY FLOW: Property discovered."
    );


    geoplayMapFlowHideSearchIndicator();


    geoplayMapFlowGenerateNearbyCasino();


    geoplayMapUISay(
        "Oh! I found one!",
        function()
        {
            // ==================================================
            // HIDE DIALOGUE BEFORE CASINO PRESENTATION
            // ==================================================

            geoplayMapUIHideDialogue();


            geoplayMapFlowShowDiscoveredCasino();
        }
    );
}


// ==================================================
// SHOW DISCOVERED CASINO
// ==================================================

function geoplayMapFlowShowDiscoveredCasino()
{
    geoplayMapShowDestinationMarker();


    geoplayMapUIShowDestination();


    // ==================================================
    // SMALL VISUAL PAUSE
    // ==================================================

    setTimeout(
        function()
        {
            geoplayMapFlowTravelToDestination();
        },
        geoplayFlowDestinationPause
    );
}


// ==================================================
// 7. TRAVEL TO DESTINATION
// ==================================================

function geoplayMapFlowTravelToDestination()
{
    console.log(
        "GEOPLAY FLOW: Moving camera to destination."
    );


    // ==================================================
    // DIALOGUE SHOULD NOT COVER CAMERA MOVEMENT
    // ==================================================

    geoplayMapUIHideDialogue();


    if (
        !window.geoplayMap
    )
    {
        geoplayMapFlowDestinationArrived();

        return;
    }


    window.geoplayMap.once(
        "moveend",
        function()
        {
            geoplayMapFlowDestinationArrived();
        }
    );


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
            1400,

        essential:
            true
    });
}


// ==================================================
// 8. DESTINATION ARRIVED
// ==================================================

function geoplayMapFlowDestinationArrived()
{
    console.log(
        "GEOPLAY FLOW: Destination reached."
    );


    // ==================================================
    // DESTINATION DIALOGUE
    // ==================================================

    geoplayMapUISay(
        "There it is — Pine Ridge Casino!",
        function()
        {
            // ==================================================
            // HIDE BEFORE CAMERA REFRAMES
            // ==================================================

            geoplayMapUIHideDialogue();


            geoplayMapFlowReturnToPlayer();
        }
    );
}


// ==================================================
// 9. FRAME PLAYER + DESTINATION
// ==================================================

function geoplayMapFlowReturnToPlayer()
{
    console.log(
        "GEOPLAY FLOW: Framing player and destination."
    );


    window.geoplayMapFlowDistanceCameraFinished =
        false;


    window.geoplayMapFlowRouteReady =
        false;


    window.geoplayMapFlowRouteStarted =
        false;


    window.geoplayMapFlowRouteGeometry =
        null;


    window.geoplayDestinationDistanceMiles =
        null;


    // ==================================================
    // DISTANCE DIALOGUE
    // ==================================================

    geoplayMapUISay(
        "Let's see how far away it is..."
    );


    // ==================================================
    // FAIL SAFE
    // ==================================================

    if (
        !window.geoplayMap
    )
    {
        geoplayMapUIHideDialogue();


        window.geoplayMapFlowDistanceCameraFinished =
            true;


        geoplayMapFlowRequestRoute();

        return;
    }


    // ==================================================
    // VERIFY PLAYER + DESTINATION
    // ==================================================

    if (
        typeof geoplayMapLongitude !==
        "number" ||

        typeof geoplayMapLatitude !==
        "number" ||

        typeof geoplayDestinationLongitude !==
        "number" ||

        typeof geoplayDestinationLatitude !==
        "number"
    )
    {
        console.warn(
            "GEOPLAY FLOW: Player or destination coordinates unavailable. Falling back to player camera."
        );


        window.geoplayMap.once(
            "moveend",
            function()
            {
                console.log(
                    "GEOPLAY FLOW: Fallback player camera movement finished."
                );


                window.geoplayMapFlowDistanceCameraFinished =
                    true;


                // ==================================================
                // HIDE DIALOGUE BEFORE ROUTE VISUAL
                // ==================================================

                geoplayMapUIHideDialogue();


                geoplayMapFlowTryStartRoute();
            }
        );


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
                1700,

            essential:
                true
        });


        geoplayMapFlowRequestRoute();

        return;
    }


    // ==================================================
    // CREATE BOUNDS
    // ==================================================

    var storyBounds =
        new maplibregl.LngLatBounds();


    storyBounds.extend(
        [
            geoplayMapLongitude,
            geoplayMapLatitude
        ]
    );


    storyBounds.extend(
        [
            geoplayDestinationLongitude,
            geoplayDestinationLatitude
        ]
    );


    // ==================================================
    // CAMERA COMPLETION
    // ==================================================

    window.geoplayMap.once(
        "moveend",
        function()
        {
            console.log(
                "GEOPLAY FLOW: Player + destination camera framing finished."
            );


            window.geoplayMapFlowDistanceCameraFinished =
                true;


            // ==================================================
            // HIDE DIALOGUE BEFORE ROUTE STARTS
            // ==================================================

            geoplayMapUIHideDialogue();


            geoplayMapFlowTryStartRoute();
        }
    );


    // ==================================================
    // FIT BOTH LOCATIONS
    // ==================================================

    window.geoplayMap.fitBounds(
        storyBounds,
        {
            padding:
            {
                top:
                    170,

                bottom:
                    240,

                left:
                    55,

                right:
                    55
            },

            maxZoom:
                13.7,

            bearing:
                0,

            pitch:
                0,

            duration:
                1700,

            essential:
                true
        }
    );


    // ==================================================
    // REQUEST ROUTE IMMEDIATELY
    // ==================================================

    geoplayMapFlowRequestRoute();
}


// ==================================================
// 10. CHECK ROUTE SYNCHRONIZATION
// ==================================================

function geoplayMapFlowTryStartRoute()
{
    if (
        window.geoplayMapFlowRouteStarted
    )
    {
        return;
    }


    if (
        !window.geoplayMapFlowDistanceCameraFinished
    )
    {
        return;
    }


    if (
        !window.geoplayMapFlowRouteReady
    )
    {
        return;
    }


    if (
        !window.geoplayMapFlowRouteGeometry
    )
    {
        return;
    }


    window.geoplayMapFlowRouteStarted =
        true;


    // ==================================================
    // ROUTE IS NOW THE VISUAL FOCUS
    // ==================================================

    geoplayMapUIHideDialogue();


    console.log(
        "GEOPLAY FLOW: Camera and route are ready. Starting route animation."
    );


    if (
        typeof geoplayMapRouteAnimate !==
        "function"
    )
    {
        console.error(
            "GEOPLAY ROUTING: Route animation module is not loaded."
        );


        geoplayMapFlowRouteArrived();

        return;
    }


    geoplayMapRouteAnimate(
        window.geoplayMapFlowRouteGeometry,

        geoplayDestinationLongitude,
        geoplayDestinationLatitude,

        function()
        {
            geoplayMapFlowRouteArrived();
        }
    );
}


// ==================================================
// 11. REQUEST ROAD ROUTE
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
// 12. HANDLE ROUTE
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


    // ==================================================
    // STORE ACTUAL ROAD DISTANCE
    // ==================================================

    if (
        typeof distance ===
        "number" &&

        isFinite(distance) &&

        distance > 0
    )
    {
        window.geoplayDestinationDistanceMiles =
            distance /
            1609.344;


        console.log(
            "GEOPLAY ROUTING: Calculated road distance = " +
            window.geoplayDestinationDistanceMiles.toFixed(1) +
            " miles."
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


    window.geoplayMapFlowRouteGeometry =
        geometry;


    window.geoplayMapFlowRouteReady =
        true;


    geoplayMapFlowTryStartRoute();
}


// ==================================================
// 13. FALLBACK ROUTE
// ==================================================

function geoplayMapFlowStartFallbackRoute()
{
    console.warn(
        "GEOPLAY ROUTING: Using fallback route."
    );


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


    var fallbackGeometry =
    {
        type:
            "LineString",

        coordinates:
        [
            [
                geoplayMapLongitude,
                geoplayMapLatitude
            ],

            [
                geoplayDestinationLongitude,
                geoplayDestinationLatitude
            ]
        ]
    };


    if (
        typeof window.geoplayGeneratedDestinationDistanceMiles ===
        "number"
    )
    {
        window.geoplayDestinationDistanceMiles =
            window.geoplayGeneratedDestinationDistanceMiles;
    }


    window.geoplayMapFlowRouteGeometry =
        fallbackGeometry;


    window.geoplayMapFlowRouteReady =
        true;


    geoplayMapFlowTryStartRoute();
}


// ==================================================
// 14. ROUTE ARRIVED
// ==================================================
//
// This function is called by the route engine at the
// exact moment the dotted route finishes.
//
// ==================================================

function geoplayMapFlowRouteArrived()
{
    console.log(
        "GEOPLAY FLOW: Route arrived."
    );


    // ==================================================
    // REVEAL CALCULATED DISTANCE
    // ==================================================

    if (
        typeof geoplayMapUIRefreshDestinationDistance ===
        "function"
    )
    {
        geoplayMapUIRefreshDestinationDistance();
    }


    // ==================================================
    // DIALOGUE RETURNS AFTER ROUTE
    // ==================================================

    geoplayMapUISay(
        "There we go!",
        function()
        {
            geoplayMapFlowPropertyReveal();
        }
    );
}


// ==================================================
// 15. PROPERTY DIALOGUE
// ==================================================

function geoplayMapFlowPropertyReveal()
{
    geoplayMapUISay(
        "You can play Geoplay games here!",
        function()
        {
            geoplayMapFlowFinish();
        }
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


    geoplayMapFlowHideSearchIndicator();


    window.geoplayDestinationIndicatorEnabled =
        true;


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
}


// ==================================================
// BROWSE
// ==================================================

function gmcallback_geoplay_location_browse()
{
    console.log(
        "GEOPLAY FLOW: Browse selected."
    );
}


// ==================================================
// LEGACY CONTINUE
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