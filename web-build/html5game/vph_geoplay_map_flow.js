// ==================================================
// GEOPLAY MAP FLOW
// STORY ORCHESTRATION
// ==================================================
//
// ROUTE CAMERA BEHAVIOR:
//
// The camera does NOT continuously follow the route.
//
// Instead:
//
// 1. Route begins at YOU.
// 2. Route draws smoothly.
// 3. When the active route section approaches
//    the edge of the viewport, the camera smoothly
//    moves to the next section.
// 4. Route continues.
// 5. Repeat only when necessary.
// 6. Camera never rotates or tilts.
//
// STORY INTERACTION:
//
// 1. Player interaction is LOCKED when story begins.
// 2. All scripted camera movement continues normally.
// 3. Player interaction remains locked during the
//    entire story.
// 4. Player interaction is UNLOCKED only when the
//    story has finished.
// ==================================================


window.geoplayMapFlowStarted =
    false;

window.geoplayMapFlowFinished =
    false;


// ==================================================
// DESTINATION
// ==================================================

var geoplayDestinationLongitude =
    -118.0735;

var geoplayDestinationLatitude =
    34.1085;


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

var geoplayFlowRouteDuration =
    4500;

var geoplayFlowPropertyPause =
    2200;

var geoplayFlowCompletePause =
    3000;


// ==================================================
// ROUTE CAMERA
// ==================================================

var geoplayRouteCameraEdgePercent =
    0.78;

var geoplayRouteCameraLookAhead =
    0.12;

var geoplayRouteCameraMoveDuration =
    700;

var geoplayRouteCameraPause =
    120;


// ==================================================
// ROUTE STATE
// ==================================================

window.geoplayRouteAnimation =
    null;

window.geoplayRouteCoordinates =
    null;

window.geoplayRouteStartedAt =
    0;

window.geoplayRouteCameraMoving =
    false;

window.geoplayRouteCameraQueued =
    false;


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

function geoplayMapFlowRequestRoute()
{
    console.log(
        "GEOPLAY ROUTING: Requesting road route."
    );


    var start =
        geoplayMapLongitude +
        "," +
        geoplayMapLatitude;


    var destination =
        geoplayDestinationLongitude +
        "," +
        geoplayDestinationLatitude;


    var url =
        "https://router.project-osrm.org/route/v1/driving/" +
        start +
        ";" +
        destination +
        "?overview=full&geometries=geojson";


    fetch(
        url
    )
    .then(
        function(response)
        {
            if (!response.ok)
            {
                throw new Error(
                    "Routing request failed: " +
                    response.status
                );
            }


            return response.json();
        }
    )
    .then(
        function(data)
        {
            geoplayMapFlowHandleRoute(
                data
            );
        }
    )
    .catch(
        function(error)
        {
            console.error(
                "GEOPLAY ROUTING ERROR:",
                error
            );


            geoplayMapFlowRouteFallback();
        }
    );
}


// ==================================================
// HANDLE ROUTE
// ==================================================

function geoplayMapFlowHandleRoute(
    data
)
{
    if (
        !data ||
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
    )
    {
        geoplayMapFlowRouteFallback();

        return;
    }


    var route =
        data.routes[0];


    if (
        !route.geometry ||
        !route.geometry.coordinates
    )
    {
        geoplayMapFlowRouteFallback();

        return;
    }


    console.log(
        "GEOPLAY ROUTING: Real road route received."
    );


    console.log(
        "GEOPLAY ROUTING: Distance = " +
        route.distance +
        " meters"
    );


    console.log(
        "GEOPLAY ROUTING: Duration = " +
        route.duration +
        " seconds"
    );


    geoplayMapFlowAnimateRoute(
        route.geometry
    );
}


// ==================================================
// ROUTE DISTANCES
// ==================================================

function geoplayMapFlowBuildRouteDistances(
    coordinates
)
{
    var distances =
        [
            0
        ];


    var total =
        0;


    for (
        var i = 1;
        i < coordinates.length;
        i++
    )
    {
        total +=
            geoplayMapFlowDistance(
                coordinates[i - 1],
                coordinates[i]
            );


        distances.push(
            total
        );
    }


    return {
        distances:
            distances,

        total:
            total
    };
}


// ==================================================
// DISTANCE
// ==================================================

function geoplayMapFlowDistance(
    a,
    b
)
{
    var dx =
        b[0] -
        a[0];


    var dy =
        b[1] -
        a[1];


    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ==================================================
// ROUTE POSITION
// ==================================================

function geoplayMapFlowGetRoutePosition(
    coordinates,
    distances,
    total,
    progress
)
{
    if (progress <= 0)
    {
        return coordinates[0];
    }


    if (progress >= 1)
    {
        return coordinates[
            coordinates.length - 1
        ];
    }


    var target =
        total *
        progress;


    var low =
        1;


    var high =
        distances.length - 1;


    while (low < high)
    {
        var middle =
            Math.floor(
                (
                    low +
                    high
                ) /
                2
            );


        if (
            distances[middle] <
            target
        )
        {
            low =
                middle +
                1;
        }
        else
        {
            high =
                middle;
        }
    }


    var index =
        low;


    var previousDistance =
        distances[
            index - 1
        ];


    var currentDistance =
        distances[
            index
        ];


    var segmentLength =
        currentDistance -
        previousDistance;


    var segmentProgress =
        segmentLength > 0
            ?
        (
            target -
            previousDistance
        ) /
        segmentLength
            :
        0;


    var a =
        coordinates[
            index - 1
        ];


    var b =
        coordinates[
            index
        ];


    return [
        a[0] +
        (
            b[0] -
            a[0]
        ) *
        segmentProgress,

        a[1] +
        (
            b[1] -
            a[1]
        ) *
        segmentProgress
    ];
}


// ==================================================
// GET ROUTE COORDINATE AT PROGRESS
// ==================================================

function geoplayMapFlowGetRouteCoordinateAtProgress(
    coordinates,
    distances,
    total,
    progress
)
{
    return geoplayMapFlowGetRoutePosition(
        coordinates,
        distances,
        total,
        progress
    );
}


// ==================================================
// ROUTE CAMERA PADDING
// ==================================================

function geoplayMapFlowGetRouteCameraPadding()
{
    if (!window.geoplayMap)
    {
        return {
            top:
                70,

            bottom:
                175,

            left:
                45,

            right:
                45
        };
    }


    var container =
        document.getElementById(
            "geoplay-map"
        );


    if (!container)
    {
        return {
            top:
                70,

            bottom:
                175,

            left:
                45,

            right:
                45
        };
    }


    var width =
        container.clientWidth;


    var height =
        container.clientHeight;


    return {
        top:
            Math.max(
                65,
                Math.round(
                    height *
                    0.08
                )
            ),

        bottom:
            Math.max(
                165,
                Math.round(
                    height *
                    0.20
                )
            ),

        left:
            Math.max(
                40,
                Math.round(
                    width *
                    0.08
                )
            ),

        right:
            Math.max(
                40,
                Math.round(
                    width *
                    0.08
                )
            )
    };
}


// ==================================================
// ROUTE CAMERA SECTION CHECK
// ==================================================

function geoplayMapFlowRouteNeedsCameraMove(
    point
)
{
    if (!window.geoplayMap)
    {
        return false;
    }


    var container =
        document.getElementById(
            "geoplay-map"
        );


    if (!container)
    {
        return false;
    }


    var width =
        container.clientWidth;


    var height =
        container.clientHeight;


    var horizontalMargin =
        width *
        0.20;


    var verticalTopMargin =
        height *
        0.18;


    var verticalBottomMargin =
        height *
        0.25;


    if (
        point.x <
        horizontalMargin
    )
    {
        return true;
    }


    if (
        point.x >
        width -
        horizontalMargin
    )
    {
        return true;
    }


    if (
        point.y <
        verticalTopMargin
    )
    {
        return true;
    }


    if (
        point.y >
        height -
        verticalBottomMargin
    )
    {
        return true;
    }


    return false;
}


// ==================================================
// FIND CAMERA TARGET FOR NEXT SECTION
// ==================================================

function geoplayMapFlowGetCameraSectionTarget(
    coordinates,
    distances,
    total,
    progress
)
{
    var lookAheadProgress =
        Math.min(
            progress +
            geoplayRouteCameraLookAhead,
            1
        );


    return geoplayMapFlowGetRouteCoordinateAtProgress(
        coordinates,
        distances,
        total,
        lookAheadProgress
    );
}


// ==================================================
// MOVE CAMERA TO NEXT ROUTE SECTION
// ==================================================

function geoplayMapFlowMoveCameraToNextSection(
    coordinates,
    distances,
    total,
    progress
)
{
    if (!window.geoplayMap)
    {
        return false;
    }


    if (
        window.geoplayRouteCameraMoving
    )
    {
        return true;
    }


    if (
        window.geoplayRouteCameraQueued
    )
    {
        return true;
    }


    window.geoplayRouteCameraQueued =
        true;


    var target =
        geoplayMapFlowGetCameraSectionTarget(
            coordinates,
            distances,
            total,
            progress
        );


    var targetPoint =
        window.geoplayMap.project(
            target
        );


    var container =
        document.getElementById(
            "geoplay-map"
        );


    if (!container)
    {
        window.geoplayRouteCameraQueued =
            false;

        return false;
    }


    var width =
        container.clientWidth;


    var height =
        container.clientHeight;


    var safeLeft =
        width *
        0.24;


    var safeRight =
        width *
        0.76;


    var safeTop =
        height *
        0.22;


    var safeBottom =
        height *
        0.72;


    var targetAlreadyComfortable =
        targetPoint.x >= safeLeft &&
        targetPoint.x <= safeRight &&
        targetPoint.y >= safeTop &&
        targetPoint.y <= safeBottom;


    if (targetAlreadyComfortable)
    {
        window.geoplayRouteCameraQueued =
            false;

        return false;
    }


    window.geoplayRouteCameraMoving =
        true;


    window.geoplayRouteCameraQueued =
        false;


    console.log(
        "GEOPLAY ROUTING: Moving camera to next route section."
    );


    window.geoplayMap.easeTo(
    {
        center:
            target,

        bearing:
            0,

        pitch:
            0,

        duration:
            geoplayRouteCameraMoveDuration,

        essential:
            true,

        padding:
            geoplayMapFlowGetRouteCameraPadding()
    });


    setTimeout(
        function()
        {
            window.geoplayRouteCameraMoving =
                false;

        },
        geoplayRouteCameraMoveDuration +
        geoplayRouteCameraPause
    );


    return true;
}


// ==================================================
// 10. ANIMATE ROUTE
// ==================================================

function geoplayMapFlowAnimateRoute(
    geometry
)
{
    if (!window.geoplayMap)
    {
        return;
    }


    var coordinates =
        geometry.coordinates;


    if (
        !coordinates ||
        coordinates.length < 2
    )
    {
        geoplayMapFlowRouteFallback();

        return;
    }


    console.log(
        "GEOPLAY ROUTING: Animating route with section-based camera."
    );


    geoplayMapFlowStopRouteAnimation();


    window.geoplayRouteCoordinates =
        coordinates;


    window.geoplayRouteCameraMoving =
        false;


    window.geoplayRouteCameraQueued =
        false;


    // ==================================================
    // REMOVE OLD ROUTE GLOW
    // ==================================================

    if (
        window.geoplayMap.getLayer(
            "geoplay-route-glow"
        )
    )
    {
        window.geoplayMap.removeLayer(
            "geoplay-route-glow"
        );
    }


    // ==================================================
    // REMOVE OLD ROUTE CORE
    // ==================================================

    if (
        window.geoplayMap.getLayer(
            "geoplay-route-line"
        )
    )
    {
        window.geoplayMap.removeLayer(
            "geoplay-route-line"
        );
    }


    // ==================================================
    // REMOVE OLD ROUTE SOURCE
    // ==================================================

    if (
        window.geoplayMap.getSource(
            "geoplay-route"
        )
    )
    {
        window.geoplayMap.removeSource(
            "geoplay-route"
        );
    }


    // ==================================================
    // CREATE ROUTE SOURCE
    // ==================================================

    window.geoplayMap.addSource(
        "geoplay-route",
        {
            type:
                "geojson",

            data:
            {
                type:
                    "Feature",

                geometry:
                {
                    type:
                        "LineString",

                    coordinates:
                    [
                        coordinates[0],
                        coordinates[0]
                    ]
                }
            }
        }
    );


    // ==================================================
    // ROUTE GLOW
    // ==================================================

    window.geoplayMap.addLayer(
    {
        id:
            "geoplay-route-glow",

        type:
            "line",

        source:
            "geoplay-route",

        layout:
        {
            "line-cap":
                "round",

            "line-join":
                "round"
        },

        paint:
        {
            "line-color":
                "#4B8DFF",

            "line-width":
                10,

            "line-opacity":
                0.22,

            "line-blur":
                3.5,

            "line-dasharray":
            [
                0.5,
                2.2
            ]
        }
    });


    // ==================================================
    // ROUTE CORE
    // ==================================================

    window.geoplayMap.addLayer(
    {
        id:
            "geoplay-route-line",

        type:
            "line",

        source:
            "geoplay-route",

        layout:
        {
            "line-cap":
                "round",

            "line-join":
                "round"
        },

        paint:
        {
            "line-color":
                "#29C8FF",

            "line-width":
                4.5,

            "line-opacity":
                1,

            "line-dasharray":
            [
                0.5,
                2.2
            ]
        }
    });


    var routeInfo =
        geoplayMapFlowBuildRouteDistances(
            coordinates
        );


    var distances =
        routeInfo.distances;


    var totalDistance =
        routeInfo.total;


    var startTime =
        performance.now();


    window.geoplayRouteStartedAt =
        startTime;


    function animate(
        now
    )
    {
        if (!window.geoplayMap)
        {
            return;
        }


        var elapsed =
            now -
            startTime;


        var progress =
            Math.min(
                elapsed /
                geoplayFlowRouteDuration,
                1
            );


        var easedProgress =
            progress < .5
                ?
            2 *
            progress *
            progress
                :
            1 -
            (
                Math.pow(
                    -2 *
                    progress +
                    2,
                    2
                )
                /
                2
            );


        var currentPoint =
            geoplayMapFlowGetRoutePosition(
                coordinates,
                distances,
                totalDistance,
                easedProgress
            );


        var targetDistance =
            totalDistance *
            easedProgress;


        var low =
            0;


        var high =
            distances.length -
            1;


        while (
            low <
            high
        )
        {
            var middle =
                Math.ceil(
                    (
                        low +
                        high
                    ) /
                    2
                );


            if (
                distances[middle] <=
                targetDistance
            )
            {
                low =
                    middle;
            }
            else
            {
                high =
                    middle -
                    1;
            }
        }


        var currentIndex =
            low;


        var routeCoordinates =
            coordinates.slice(
                0,
                currentIndex +
                1
            );


        if (
            routeCoordinates.length ===
            0
        )
        {
            routeCoordinates.push(
                coordinates[0]
            );
        }


        var last =
            routeCoordinates[
                routeCoordinates.length -
                1
            ];


        if (
            !last ||
            last[0] !==
            currentPoint[0] ||
            last[1] !==
            currentPoint[1]
        )
        {
            routeCoordinates.push(
                currentPoint
            );
        }


        var source =
            window.geoplayMap.getSource(
                "geoplay-route"
            );


        if (source)
        {
            source.setData(
            {
                type:
                    "Feature",

                geometry:
                {
                    type:
                        "LineString",

                    coordinates:
                        routeCoordinates
                }
            });
        }


        // ==================================================
        // SECTION CAMERA CHECK
        // ==================================================

        if (
            progress >
            0.03 &&
            progress <
            0.96 &&
            !window.geoplayRouteCameraMoving
        )
        {
            var currentScreenPoint =
                window.geoplayMap.project(
                    currentPoint
                );


            if (
                geoplayMapFlowRouteNeedsCameraMove(
                    currentScreenPoint
                )
            )
            {
                geoplayMapFlowMoveCameraToNextSection(
                    coordinates,
                    distances,
                    totalDistance,
                    easedProgress
                );
            }
        }


        if (progress < 1)
        {
            window.geoplayRouteAnimation =
                requestAnimationFrame(
                    animate
                );

            return;
        }


        window.geoplayRouteAnimation =
            null;


        if (source)
        {
            source.setData(
            {
                type:
                    "Feature",

                geometry:
                {
                    type:
                        "LineString",

                    coordinates:
                        coordinates
                }
            });
        }


        window.geoplayRouteCameraMoving =
            false;


        console.log(
            "GEOPLAY FLOW: Route animation complete."
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
                900,

            essential:
                true
        });


        setTimeout(
            function()
            {
                geoplayMapFlowRouteArrived();
            },
            950
        );
    }


    window.geoplayRouteAnimation =
        requestAnimationFrame(
            animate
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
// STOP ROUTE
// ==================================================

function geoplayMapFlowStopRouteAnimation()
{
    if (
        window.geoplayRouteAnimation
    )
    {
        cancelAnimationFrame(
            window.geoplayRouteAnimation
        );


        window.geoplayRouteAnimation =
            null;
    }


    window.geoplayRouteCameraMoving =
        false;


    window.geoplayRouteCameraQueued =
        false;
}


// ==================================================
// FALLBACK ROUTE
// ==================================================

function geoplayMapFlowRouteFallback()
{
    console.warn(
        "GEOPLAY ROUTING: Using fallback route."
    );


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


    geoplayMapFlowAnimateRoute(
        fallbackGeometry
    );
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
//

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