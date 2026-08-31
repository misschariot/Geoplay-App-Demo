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
// IMPORTANT:
// - This file does NOT calculate route geometry.
// - This file does NOT animate the route.
// - This file does NOT control route camera movement.
// - Those responsibilities belong to geoplay_map_route.js.
//
// ==================================================


// ==================================================
// STORY STATE
// ==================================================

window.geoplayMapFlowStarted = false;
window.geoplayMapFlowFinished = false;


// ==================================================
// SEARCH VISUAL STATE
// ==================================================

window.geoplayMapFlowSearchIndicator = null;
window.geoplayMapFlowLocationIndicator = null;


// ==================================================
// ROUTE SYNCHRONIZATION STATE
// ==================================================

window.geoplayMapFlowDistanceCameraFinished = false;
window.geoplayMapFlowRouteReady = false;
window.geoplayMapFlowRouteStarted = false;
window.geoplayMapFlowRouteGeometry = null;


// ==================================================
// DESTINATION STATE
// ==================================================

window.geoplayDestinationDistanceMiles = null;

window.geoplayDestinationName =
    "Pine Ridge Casino";


// ==================================================
// STORY TIMING
// ==================================================

var geoplayFlowOpeningPause = 600;
var geoplayFlowFindPlayerPause = 450;
var geoplayFlowSearchDuration = 3200;
var geoplayFlowDestinationPause = 500;


// ==================================================
// START STORY
// ==================================================

function geoplayMapFlowStart()
{
    if (window.geoplayMapFlowStarted)
    {
        return;
    }

    window.geoplayMapFlowStarted = true;
    window.geoplayMapFlowFinished = false;

    geoplayMapFlowHideAllStatusIndicators();

    // Reset route state.
    window.geoplayMapFlowDistanceCameraFinished = false;
    window.geoplayMapFlowRouteReady = false;
    window.geoplayMapFlowRouteStarted = false;
    window.geoplayMapFlowRouteGeometry = null;

    window.geoplayDestinationDistanceMiles = null;

    // Keep destination indicator hidden until appropriate.
    window.geoplayDestinationIndicatorEnabled = false;

    console.log(
        "GEOPLAY FLOW: Story beginning."
    );

    // Lock player interaction during the story.
    if (
        typeof geoplayMapLockInteraction ===
        "function"
    )
    {
        geoplayMapLockInteraction();
    }

    // Create the map UI.
    geoplayMapUICreate();

    // Give the map a short breathing period before
    // beginning the location sequence.
    setTimeout(
        function()
        {
            geoplayMapFlowFindPlayer();
        },
        geoplayFlowOpeningPause
    );
}


// ==================================================
// CREATE STATUS INDICATOR
// ==================================================
//
// Shared visual used by:
//
// - FINDING YOUR LOCATION
// - SEARCHING NEARBY
//
// The magnifying glass remains stable while the
// surrounding scan elements provide the motion.
//
// ==================================================

function geoplayMapFlowCreateStatusIndicator(
    indicatorId,
    labelText
)
{
    var existingIndicator =
        document.getElementById(indicatorId);

    if (existingIndicator)
    {
        return existingIndicator;
    }

    if (!window.geoplayMapUI)
    {
        return null;
    }

    var indicator =
        document.createElement("div");

    indicator.id = indicatorId;

    // --------------------------------------------------
    // CARD
    // --------------------------------------------------

    indicator.style.position = "absolute";
    indicator.style.left = "50%";
    indicator.style.top = "50%";
    indicator.style.transform =
        "translate(-50%, -50%)";

    indicator.style.width = "248px";
    indicator.style.minHeight = "142px";
    indicator.style.boxSizing = "border-box";

    indicator.style.display = "flex";
    indicator.style.flexDirection = "column";
    indicator.style.alignItems = "center";
    indicator.style.justifyContent = "center";

    indicator.style.gap = "10px";
    indicator.style.padding = "20px 24px";
    indicator.style.borderRadius = "16px";

    // --------------------------------------------------
    // GEOPLAY GLASS / GRADIENT
    // --------------------------------------------------

    indicator.style.background =
        "linear-gradient(" +
            "145deg," +
            "rgba(27, 11, 48, 0.98)," +
            "rgba(11, 5, 27, 0.99)" +
        ") padding-box," +

        "linear-gradient(" +
            "105deg," +
            "#ff9b18 0%," +
            "#ff5a58 40%," +
            "#b34cff 72%," +
            "#7138ff 100%" +
        ") border-box";

    indicator.style.border =
        "1px solid transparent";

    indicator.style.boxShadow =
        "0 0 12px rgba(255, 155, 24, 0.22)," +
        "0 0 28px rgba(139, 61, 255, 0.18)," +
        "0 12px 30px rgba(0, 0, 0, 0.38)," +
        "inset 0 1px 0 rgba(255, 255, 255, 0.08)," +
        "inset 0 0 20px rgba(139, 92, 255, 0.05)";

    indicator.style.backdropFilter =
        "blur(10px)";

    indicator.style.webkitBackdropFilter =
        "blur(10px)";

    indicator.style.pointerEvents = "none";
    indicator.style.zIndex = "105";

    indicator.style.opacity = "0";
    indicator.style.visibility = "hidden";

    indicator.style.transition =
        "opacity 250ms ease, visibility 250ms ease";


    // --------------------------------------------------
    // SEARCH ICON
    // --------------------------------------------------

    var icon =
        document.createElement("div");

    icon.style.position = "relative";
    icon.style.width = "56px";
    icon.style.height = "56px";
    icon.style.boxSizing = "border-box";
    icon.style.flexShrink = "0";

    // Outer ring.
    icon.style.border =
        "1.5px solid rgba(139, 92, 255, 0.65)";

    icon.style.borderRadius = "50%";

    icon.style.boxShadow =
        "0 0 12px rgba(139, 92, 255, 0.20)," +
        "inset 0 0 10px rgba(41, 200, 255, 0.06)";

    icon.style.animation =
        "geoplaySearchRingBreathe 1.8s ease-in-out infinite";


    // --------------------------------------------------
    // SEARCH SWEEP
    // --------------------------------------------------

    var sweepTrack =
        document.createElement("div");

    sweepTrack.style.position = "absolute";
    sweepTrack.style.left = "5px";
    sweepTrack.style.top = "5px";

    sweepTrack.style.width = "46px";
    sweepTrack.style.height = "46px";

    sweepTrack.style.border =
        "1px solid transparent";

    sweepTrack.style.borderTop =
        "1.5px solid rgba(41, 200, 255, 0.55)";

    sweepTrack.style.borderRight =
        "1.5px solid rgba(139, 92, 255, 0.45)";

    sweepTrack.style.borderRadius = "50%";
    sweepTrack.style.boxSizing = "border-box";

    sweepTrack.style.animation =
        "geoplaySearchSweepRotate 1.8s linear infinite";


    // --------------------------------------------------
    // SCAN POINT
    // --------------------------------------------------

    var scanPoint =
        document.createElement("div");

    scanPoint.style.position = "absolute";

    scanPoint.style.width = "6px";
    scanPoint.style.height = "6px";

    scanPoint.style.left = "25px";
    scanPoint.style.top = "0px";

    scanPoint.style.marginLeft = "-3px";
    scanPoint.style.marginTop = "-3px";

    scanPoint.style.borderRadius = "50%";

    scanPoint.style.background = "#29C8FF";

    scanPoint.style.boxShadow =
        "0 0 5px rgba(41, 200, 255, 0.95)," +
        "0 0 12px rgba(139, 92, 255, 0.65)";

    scanPoint.style.transformOrigin =
        "3px 31px";

    scanPoint.style.animation =
        "geoplaySearchScanPoint 1.8s linear infinite";


    // --------------------------------------------------
    // MAGNIFYING GLASS
    // --------------------------------------------------

    var glass =
        document.createElement("div");

    glass.style.position = "absolute";

    glass.style.left = "14px";
    glass.style.top = "12px";

    glass.style.width = "24px";
    glass.style.height = "24px";

    glass.style.border =
        "2.5px solid rgba(255, 255, 255, 0.96)";

    glass.style.borderRadius = "50%";
    glass.style.boxSizing = "border-box";

    glass.style.filter =
        "drop-shadow(0 0 5px rgba(41, 200, 255, 0.28))";


    // --------------------------------------------------
    // MAGNIFYING GLASS HANDLE
    // --------------------------------------------------

    var handle =
        document.createElement("div");

    handle.style.position = "absolute";

    handle.style.width = "14px";
    handle.style.height = "2.5px";

    handle.style.left = "31px";
    handle.style.top = "34px";

    handle.style.borderRadius = "3px";

    handle.style.background =
        "rgba(255, 255, 255, 0.96)";

    handle.style.transform = "rotate(45deg)";
    handle.style.transformOrigin =
        "left center";


    // --------------------------------------------------
    // BUILD ICON
    // --------------------------------------------------

    icon.appendChild(sweepTrack);
    icon.appendChild(scanPoint);
    icon.appendChild(glass);
    icon.appendChild(handle);


    // --------------------------------------------------
    // STATUS LABEL
    // --------------------------------------------------

    var label =
        document.createElement("div");

    label.style.fontFamily =
        "'Poppins', Arial, sans-serif";

    label.style.fontSize = "14px";
    label.style.fontWeight = "700";

    label.style.letterSpacing = "1.4px";
    label.style.textAlign = "center";

    label.style.color =
        "rgba(255, 255, 255, 0.96)";

    label.style.lineHeight = "1.2";
    label.style.whiteSpace = "nowrap";

    label.style.textShadow =
        "0 0 8px rgba(139, 92, 255, 0.30)";

    label.textContent = labelText;


    // --------------------------------------------------
    // BUILD INDICATOR
    // --------------------------------------------------

    indicator.appendChild(icon);
    indicator.appendChild(label);

    geoplayMapFlowEnsureSearchAnimations();

    window.geoplayMapUI.appendChild(indicator);

    return indicator;
}


// ==================================================
// CREATE SEARCH INDICATOR
// ==================================================

function geoplayMapFlowCreateSearchIndicator()
{
    var indicator =
        geoplayMapFlowCreateStatusIndicator(
            "geoplay-search-indicator",
            "SEARCHING NEARBY"
        );

    window.geoplayMapFlowSearchIndicator =
        indicator;

    return indicator;
}


// ==================================================
// CREATE LOCATION INDICATOR
// ==================================================

function geoplayMapFlowCreateLocationIndicator()
{
    var indicator =
        geoplayMapFlowCreateStatusIndicator(
            "geoplay-location-indicator",
            "FINDING YOUR LOCATION"
        );

    window.geoplayMapFlowLocationIndicator =
        indicator;

    return indicator;
}


// ==================================================
// SEARCH ANIMATIONS
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
        document.createElement("style");

    style.id =
        "geoplay-search-animation-style";

    style.textContent =

        // Outer ring breathing.
        "@keyframes geoplaySearchRingBreathe {" +

            "0%, 100% {" +
                "transform: scale(0.96);" +
                "opacity: 0.72;" +
            "}" +

            "50% {" +
                "transform: scale(1.03);" +
                "opacity: 1;" +
            "}" +

        "}" +

        // Rotating sweep.
        "@keyframes geoplaySearchSweepRotate {" +

            "0% {" +
                "transform: rotate(0deg);" +
                "opacity: 0.55;" +
            "}" +

            "50% {" +
                "opacity: 1;" +
            "}" +

            "100% {" +
                "transform: rotate(360deg);" +
                "opacity: 0.55;" +
            "}" +

        "}" +

        // Moving scan point.
        "@keyframes geoplaySearchScanPoint {" +

            "0% {" +
                "transform: rotate(0deg);" +
            "}" +

            "100% {" +
                "transform: rotate(360deg);" +
            "}" +

        "}";

    document.head.appendChild(style);
}


// ==================================================
// POSITION STATUS INDICATOR
// ==================================================

function geoplayMapFlowPositionStatusIndicator(
    indicator
)
{
    if (!indicator)
    {
        return;
    }

    indicator.style.left = "50%";
    indicator.style.top = "50%";

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

    if (!indicator)
    {
        return 0;
    }

    geoplayMapFlowPositionStatusIndicator(
        indicator
    );

    indicator.style.visibility = "visible";
    indicator.style.opacity = "1";

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

    if (indicator)
    {
        indicator.style.opacity = "0";
        indicator.style.visibility = "hidden";
    }

    console.log(
        "GEOPLAY FLOW: Search indicator hidden."
    );
}


// ==================================================
// SHOW LOCATION INDICATOR
// ==================================================

function geoplayMapFlowShowLocationIndicator()
{
    var indicator =
        geoplayMapFlowCreateLocationIndicator();

    if (!indicator)
    {
        return 0;
    }

    geoplayMapFlowPositionStatusIndicator(
        indicator
    );

    indicator.style.visibility = "visible";
    indicator.style.opacity = "1";

    console.log(
        "GEOPLAY FLOW: Location indicator shown."
    );

    return 1;
}


// ==================================================
// HIDE LOCATION INDICATOR
// ==================================================

function geoplayMapFlowHideLocationIndicator()
{
    var indicator =
        window.geoplayMapFlowLocationIndicator;

    if (indicator)
    {
        indicator.style.opacity = "0";
        indicator.style.visibility = "hidden";
    }

    console.log(
        "GEOPLAY FLOW: Location indicator hidden."
    );
}


// ==================================================
// HIDE ALL STATUS INDICATORS
// ==================================================

function geoplayMapFlowHideAllStatusIndicators()
{
    geoplayMapFlowHideSearchIndicator();
    geoplayMapFlowHideLocationIndicator();
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

            // Show feedback for the actual location lookup.
            geoplayMapFlowShowLocationIndicator();

            if (
                typeof geoplayMapGetRealPlayerLocation !==
                "function"
            )
            {
                console.warn(
                    "GEOPLAY FLOW: Real location function unavailable. Using fallback location."
                );

                geoplayMapFlowHideLocationIndicator();
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

                    geoplayMapFlowHideLocationIndicator();

                    if (window.geoplayMap)
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

                            zoom: 15.5,
                            bearing: 0,
                            pitch: 0,

                            duration: 1400,
                            essential: true
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

                    geoplayMapFlowHideLocationIndicator();
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
            geoplayMapUIHideDialogue();
            geoplayMapFlowSearchArea();
        }
    );
}


// ==================================================
// GENERATE NEARBY CASINO
// ==================================================

function geoplayMapFlowGenerateNearbyCasino()
{
    var minimumMiles = 5;
    var maximumMiles = 10;

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
        Math.random() * 360;

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

    geoplayMapFlowShowSearchIndicator();

    if (window.geoplayMap)
    {
        window.geoplayMap.easeTo(
        {
            center:
            [
                geoplayMapLongitude,
                geoplayMapLatitude
            ],

            zoom: 13.7,
            bearing: 0,
            pitch: 0,

            duration: 1800,
            essential: true
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
// 6. PROPERTY FOUND
// ==================================================

function geoplayMapFlowSearchComplete()
{
    console.log(
        "GEOPLAY FLOW: Property discovered."
    );

    geoplayMapFlowHideSearchIndicator();

    geoplayMapFlowGenerateNearbyCasino();

    // Show the marker, but keep the destination card hidden.
    // The card will not appear until the route has finished
    // drawing and the final destination camera has completed.

    geoplayMapShowDestinationMarker();

    geoplayMapUISay(
        "Oh! I found one!",
        function()
        {
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
    // Keep the casino marker visible during travel.
    geoplayMapShowDestinationMarker();

    // Keep the destination card completely hidden while
    // the route journey is being prepared and displayed.
    geoplayMapUIHideDestination();

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

    geoplayMapUIHideDialogue();

    if (!window.geoplayMap)
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

        zoom: 15.2,
        bearing: 0,
        pitch: 0,

        duration: 1400,
        essential: true
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

    // Keep the destination card hidden while the story
    // frames the player and prepares the road route.
    geoplayMapUIHideDestination();

    geoplayMapUISay(
        "There it is — Pine Ridge Casino!",
        function()
        {
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

    // Make absolutely sure the destination card remains
    // hidden before the distance sequence begins.
    geoplayMapUIHideDestination();

    geoplayMapUISay(
        "Let's see how far away it is..."
    );

    if (!window.geoplayMap)
    {
        geoplayMapUIHideDialogue();

        window.geoplayMapFlowDistanceCameraFinished =
            true;

        geoplayMapFlowRequestRoute();

        return;
    }

    // --------------------------------------------------
    // VERIFY COORDINATES
    // --------------------------------------------------

    if (
        typeof geoplayMapLongitude !== "number" ||
        typeof geoplayMapLatitude !== "number" ||
        typeof geoplayDestinationLongitude !== "number" ||
        typeof geoplayDestinationLatitude !== "number"
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

            zoom: 13.7,
            bearing: 0,
            pitch: 0,

            duration: 1700,
            essential: true
        });

        geoplayMapFlowRequestRoute();

        return;
    }

    // --------------------------------------------------
    // CREATE STORY BOUNDS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // CAMERA COMPLETION
    // --------------------------------------------------

    window.geoplayMap.once(
        "moveend",
        function()
        {
            console.log(
                "GEOPLAY FLOW: Player + destination camera framing finished."
            );

            window.geoplayMapFlowDistanceCameraFinished =
                true;

            geoplayMapUIHideDialogue();

            geoplayMapFlowTryStartRoute();
        }
    );

    // --------------------------------------------------
    // FRAME BOTH LOCATIONS
    // --------------------------------------------------

    window.geoplayMap.fitBounds(
        storyBounds,
        {
            padding:
            {
                top: 170,
                bottom: 240,
                left: 55,
                right: 55
            },

            maxZoom: 13.2,
            bearing: 0,
            pitch: 0,

            duration: 1700,
            essential: true
        }
    );

    // Request the route while the camera is moving.
    geoplayMapFlowRequestRoute();
}


// ==================================================
// 10. CHECK ROUTE SYNCHRONIZATION
// ==================================================

function geoplayMapFlowTryStartRoute()
{
    if (window.geoplayMapFlowRouteStarted)
    {
        return;
    }

    if (!window.geoplayMapFlowDistanceCameraFinished)
    {
        return;
    }

    if (!window.geoplayMapFlowRouteReady)
    {
        return;
    }

    if (!window.geoplayMapFlowRouteGeometry)
    {
        return;
    }

    window.geoplayMapFlowRouteStarted =
        true;

    geoplayMapUIHideDialogue();

    // Keep the destination card hidden for the entire
    // route animation.
    geoplayMapUIHideDestination();

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

    // Store actual road distance.
    if (
        typeof distance === "number" &&
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

    if (typeof duration === "number")
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
        type: "LineString",

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

function geoplayMapFlowRouteArrived()
{
    console.log(
        "GEOPLAY FLOW: Route arrived."
    );

    // The route has finished drawing. Now perform the
    // final destination camera move so the casino marker
    // becomes the visual focus before the card appears.

    if (
        !window.geoplayMap ||
        typeof geoplayDestinationLongitude !==
            "number" ||
        typeof geoplayDestinationLatitude !==
            "number"
    )
    {
        console.warn(
            "GEOPLAY FLOW: Destination camera unavailable. Showing final destination presentation."
        );

        geoplayMapFlowShowFinalDestinationPresentation();

        return;
    }

    window.geoplayDestinationControlledTransition =
        true;

    geoplayMapUIHideDestination();

    window.geoplayMap.once(
        "moveend",
        function()
        {
            window.geoplayDestinationControlledTransition =
                false;

            geoplayMapFlowShowFinalDestinationPresentation();
        }
    );

    window.geoplayMap.easeTo(
    {
        center:
        [
            geoplayDestinationLongitude,
            geoplayDestinationLatitude
        ],

        zoom: 15.2,
        bearing: 0,
        pitch: 0,

        duration: 1100,
        essential: true
    });
}


// ==================================================
// FINAL DESTINATION PRESENTATION
// ==================================================

function geoplayMapFlowShowFinalDestinationPresentation()
{
    console.log(
        "GEOPLAY FLOW: Final destination camera finished."
    );

    // Refresh the destination card using the final
    // calculated road distance before displaying it.
    if (
        typeof geoplayMapUIRefreshDestinationDistance ===
        "function"
    )
    {
        geoplayMapUIRefreshDestinationDistance();
    }

    geoplayMapUIShowDestination();

    if (
        typeof geoplayMapUIUpdatePositions ===
        "function"
    )
    {
        geoplayMapUIUpdatePositions();
    }

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
    if (window.geoplayMapFlowFinished)
    {
        return;
    }

    window.geoplayMapFlowFinished =
        true;

    geoplayMapFlowHideAllStatusIndicators();

    // The final destination camera and destination card
    // presentation have already happened in
    // geoplayMapFlowRouteArrived().
    window.geoplayDestinationIndicatorEnabled =
        true;

    geoplayMapFlowCompleteAfterFinalPresentation();
}


// ==================================================
// COMPLETE AFTER FINAL PRESENTATION
// ==================================================

function geoplayMapFlowCompleteAfterFinalPresentation()
{
    if (
        typeof geoplayMapUIUpdatePositions ===
        "function"
    )
    {
        geoplayMapUIUpdatePositions();
    }

    console.log(
        "GEOPLAY FLOW: Story complete. Final casino presentation is visible."
    );

    if (
        typeof geoplayMapUnlockInteraction ===
        "function"
    )
    {
        geoplayMapUnlockInteraction();
    }

    // Clear robot dialogue.
    geoplayMapUISay("");

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