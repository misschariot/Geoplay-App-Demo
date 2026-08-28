// ==================================================
// GEOPLAY MAP ROUTE
// ROUTE ENGINE
// ==================================================
//
// RESPONSIBILITY:
// - OSRM route requests
// - Route validation
// - Route distance calculations
// - Route geometry interpolation
// - Route drawing / animation
// - Section-based camera movement
// - Route fallback
//
// DEPENDENCIES:
// - geoplay_map.js
//
// CALLBACK:
// - Route completion is returned to the caller.
//
// NOTE:
// - Destination coordinates are shared map configuration.
// - They remain global because the destination UI also
//   uses them.
// ==================================================


// ==================================================
// SHARED DESTINATION
// ==================================================

var geoplayDestinationLongitude =
    -118.0735;

var geoplayDestinationLatitude =
    34.1085;


// ==================================================
// ROUTE TIMING
// ==================================================

var geoplayFlowRouteDuration =
    4500;


// ==================================================
// ROUTE CAMERA
// ==================================================

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
// REQUEST ROAD ROUTE
// ==================================================

function geoplayMapRouteRequest(
    startLongitude,
    startLatitude,
    destinationLongitude,
    destinationLatitude,
    onSuccess,
    onFailure
)
{
    var start =
        startLongitude +
        "," +
        startLatitude;


    var destination =
        destinationLongitude +
        "," +
        destinationLatitude;


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
            geoplayMapRouteHandle(
                data,
                onSuccess,
                onFailure
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


            if (
                typeof onFailure ===
                "function"
            )
            {
                onFailure();
            }
        }
    );
}


// ==================================================
// HANDLE ROUTE
// ==================================================

function geoplayMapRouteHandle(
    data,
    onSuccess,
    onFailure
)
{
    if (
        !data ||
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
    )
    {
        if (
            typeof onFailure ===
            "function"
        )
        {
            onFailure();
        }

        return;
    }


    var route =
        data.routes[0];


    if (
        !route.geometry ||
        !route.geometry.coordinates ||
        route.geometry.coordinates.length < 2
    )
    {
        if (
            typeof onFailure ===
            "function"
        )
        {
            onFailure();
        }

        return;
    }


    if (
        typeof onSuccess ===
        "function"
    )
    {
        onSuccess(
            route.geometry,
            route.distance,
            route.duration
        );
    }
}


// ==================================================
// ROUTE DISTANCES
// ==================================================

function geoplayMapRouteBuildDistances(
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
            geoplayMapRouteDistance(
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

function geoplayMapRouteDistance(
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

function geoplayMapRouteGetPosition(
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

function geoplayMapRouteGetCoordinateAtProgress(
    coordinates,
    distances,
    total,
    progress
)
{
    return geoplayMapRouteGetPosition(
        coordinates,
        distances,
        total,
        progress
    );
}


// ==================================================
// ROUTE CAMERA PADDING
// ==================================================

function geoplayMapRouteGetCameraPadding()
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

function geoplayMapRouteNeedsCameraMove(
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

function geoplayMapRouteGetCameraSectionTarget(
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


    return geoplayMapRouteGetCoordinateAtProgress(
        coordinates,
        distances,
        total,
        lookAheadProgress
    );
}


// ==================================================
// MOVE CAMERA TO NEXT ROUTE SECTION
// ==================================================

function geoplayMapRouteMoveCamera(
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
        geoplayMapRouteGetCameraSectionTarget(
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
            geoplayMapRouteGetCameraPadding()
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
// ANIMATE ROUTE
// ==================================================

function geoplayMapRouteAnimate(
    geometry,
    destinationLongitude,
    destinationLatitude,
    onComplete
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
        if (
            typeof onComplete ===
            "function"
        )
        {
            onComplete();
        }

        return;
    }


    console.log(
        "GEOPLAY ROUTING: Animating route with section-based camera."
    );


    geoplayMapRouteStopAnimation();


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
        geoplayMapRouteBuildDistances(
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
            geoplayMapRouteGetPosition(
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
                geoplayMapRouteNeedsCameraMove(
                    currentScreenPoint
                )
            )
            {
                geoplayMapRouteMoveCamera(
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
            "GEOPLAY ROUTING: Route animation complete."
        );


        window.geoplayMap.easeTo(
        {
            center:
            [
                destinationLongitude,
                destinationLatitude
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
                if (
                    typeof onComplete ===
                    "function"
                )
                {
                    onComplete();
                }
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
// STOP ROUTE ANIMATION
// ==================================================

function geoplayMapRouteStopAnimation()
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

function geoplayMapRouteFallback(
    startLongitude,
    startLatitude,
    destinationLongitude,
    destinationLatitude,
    onComplete
)
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
                startLongitude,
                startLatitude
            ],

            [
                destinationLongitude,
                destinationLatitude
            ]
        ]
    };


    geoplayMapRouteAnimate(
        fallbackGeometry,
        destinationLongitude,
        destinationLatitude,
        onComplete
    );
}