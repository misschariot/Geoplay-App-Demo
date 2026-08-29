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
// - Calm route overview camera
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
//
// Slightly faster than the previous 4.5 second route.
// The route should remain easy to follow without
// slowing down the overall demo.
//
// ==================================================

var geoplayFlowRouteDuration =
    3600;


// ==================================================
// ROUTE CAMERA
// ==================================================
//
// The route camera uses one calm overview.
//
// Instead of following the dotted line section by section,
// the map fits the complete route into the viewport first.
// The camera then stays still while the route draws.
//
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
                    0.10
                )
            ),

        bottom:
            Math.max(
                165,
                Math.round(
                    height *
                    0.22
                )
            ),

        left:
            Math.max(
                40,
                Math.round(
                    width *
                    0.10
                )
            ),

        right:
            Math.max(
                40,
                Math.round(
                    width *
                    0.10
                )
            )
    };
}


// ==================================================
// FIT COMPLETE ROUTE IN VIEW
// ==================================================
//
// Fits the player and destination into one calm map view.
// The camera does not follow the animated route afterward.
//
// ==================================================

function geoplayMapRouteFitOverview(
    coordinates
)
{
    if (
        !window.geoplayMap ||
        !coordinates ||
        coordinates.length < 2
    )
    {
        return false;
    }


    var bounds =
        new maplibregl.LngLatBounds(
            coordinates[0],
            coordinates[0]
        );


    for (
        var i = 1;
        i < coordinates.length;
        i++
    )
    {
        bounds.extend(
            coordinates[i]
        );
    }


    console.log(
        "GEOPLAY ROUTING: Fitting complete route into view."
    );


    window.geoplayMap.fitBounds(
        bounds,
        {
            padding:
                geoplayMapRouteGetCameraPadding(),

            duration:
                1200,

            maxZoom:
                14.5,

            essential:
                true
        }
    );


    return true;
}


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
        "GEOPLAY ROUTING: Animating route with fixed overview camera."
    );


    geoplayMapRouteStopAnimation();


    window.geoplayRouteCoordinates =
        coordinates;


    window.geoplayRouteCameraMoving =
        false;


    window.geoplayRouteCameraQueued =
        false;


    // ==================================================
    // FIT COMPLETE ROUTE BEFORE DRAWING
    // ==================================================
    //
    // The camera moves once to a view containing both
    // the player and casino. It then remains still while
    // the dotted route animates.
    //
    // ==================================================

    geoplayMapRouteFitOverview(
        coordinates
    );


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
        // CAMERA DOES NOT FOLLOW THE ROUTE
        // ==================================================
        //
        // The complete route was already fitted into view
        // before the animation began.
        //
        // The camera remains stationary while the route
        // draws.
        //
        // ==================================================


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


        // ==================================================
        // COMPLETE IMMEDIATELY WHEN THE ROUTE FINISHES
        // ==================================================
        //
        // No additional camera movement or artificial
        // delay is added here. The story can immediately
        // continue to "There we go!"
        //
        // ==================================================

        if (
            typeof onComplete ===
            "function"
        )
        {
            onComplete();
        }
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