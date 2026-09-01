// ==================================================
// GEOPLAY MAP
// MAP ENGINE + MAP MARKERS
// ==================================================
//
// RESPONSIBILITY:
// - Create MapLibre map
// - Load OpenFreeMap Dark map style
// - Apply Geoplay cosmic map palette
// - Show / hide map
// - Resize map
// - Create player marker
// - Create destination marker
// - Lock / unlock player map interaction
// - Keep map UI synchronized with camera movement
// - Get real player location
//
// STORY UI:
// geoplay_map_ui.js
//
// FLOW:
// geoplay_map_flow.js
//
// CSS:
// geoplay_map.css
// ==================================================


window.geoplayMap = null;

window.geoplayMapInitialized =
    false;

window.geoplayMapReady =
    false;


// ==================================================
// STORY INTERACTION STATE
// ==================================================

window.geoplayMapStoryLocked =
    false;


// ==================================================
// PLAYER LOCATION
// ==================================================
//
// These coordinates remain as the fallback location
// used while the map is initializing.
//
// They are replaced with the player's real device
// location once geoplayMapGetRealPlayerLocation()
// succeeds.
//
// ==================================================

var geoplayMapLongitude =
    -118.1046;

var geoplayMapLatitude =
    34.1123;


// ==================================================
// REAL PLAYER LOCATION STATE
// ==================================================

window.geoplayPlayerLocationReady =
    false;


window.geoplayPlayerLocationError =
    false;


// ==================================================
// PLAYER MARKER
// ==================================================

window.geoplayPlayerMarker =
    null;


// ==================================================
// DESTINATION MARKER
// ==================================================

window.geoplayDestinationMarker =
    null;


// ==================================================
// GET REAL PLAYER LOCATION
// ==================================================
//
// Requests the player's actual device/browser location.
//
// On success:
// - Updates geoplayMapLongitude
// - Updates geoplayMapLatitude
// - Updates the existing player marker
// - Calls the supplied success callback
//
// On failure:
// - Keeps the existing fallback coordinates
// - Calls the supplied error callback
//
// ==================================================

function geoplayMapGetRealPlayerLocation(
    onSuccess,
    onError
)
{
    console.log(
        "GEOPLAY MAP: Checking real player location..."
    );


    // ==================================================
    // CHECK GEOLOCATION SUPPORT
    // ==================================================

    if (
        !navigator.geolocation
    )
    {
        console.warn(
            "GEOPLAY MAP: Geolocation is not supported by this browser."
        );


        window.geoplayPlayerLocationError =
            true;


        if (
            typeof onError ===
            "function"
        )
        {
            onError(
                "Geolocation is not supported."
            );
        }


        return 0;
    }


    // ==================================================
    // REQUEST CURRENT LOCATION
    // ==================================================

    navigator.geolocation.getCurrentPosition(
        function(position)
        {
            var longitude =
                position.coords.longitude;


            var latitude =
                position.coords.latitude;


            // ==================================================
            // VALIDATE LOCATION
            // ==================================================

            if (
                typeof longitude !==
                "number" ||

                typeof latitude !==
                "number" ||

                !isFinite(longitude) ||

                !isFinite(latitude)
            )
            {
                console.error(
                    "GEOPLAY MAP: Invalid location received."
                );


                window.geoplayPlayerLocationError =
                    true;


                if (
                    typeof onError ===
                    "function"
                )
                {
                    onError(
                        "Invalid location received."
                    );
                }


                return;
            }


            // ==================================================
            // UPDATE PLAYER LOCATION
            // ==================================================

            geoplayMapLongitude =
                longitude;


            geoplayMapLatitude =
                latitude;


            window.geoplayPlayerLocationReady =
                true;


            window.geoplayPlayerLocationError =
                false;


            console.log(
                "GEOPLAY MAP: Real player location received."
            );


            console.log(
                "GEOPLAY MAP: Longitude = " +
                geoplayMapLongitude
            );


            console.log(
                "GEOPLAY MAP: Latitude = " +
                geoplayMapLatitude
            );


            // ==================================================
            // UPDATE EXISTING PLAYER MARKER
            // ==================================================

            if (
                window.geoplayPlayerMarker
            )
            {
                window.geoplayPlayerMarker.setLngLat(
                [
                    geoplayMapLongitude,
                    geoplayMapLatitude
                ]);
            }


            // ==================================================
            // SUCCESS CALLBACK
            // ==================================================

            if (
                typeof onSuccess ===
                "function"
            )
            {
                onSuccess(
                    geoplayMapLongitude,
                    geoplayMapLatitude
                );
            }
        },


        function(error)
        {
            console.warn(
                "GEOPLAY MAP: Unable to get real player location.",
                error
            );


            window.geoplayPlayerLocationError =
                true;


            // ==================================================
            // ERROR CALLBACK
            // ==================================================

            if (
                typeof onError ===
                "function"
            )
            {
                onError(
                    error
                );
            }
        },


        {
            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                0
        }
    );


    return 1;
}


// ==================================================
// UPDATE DESTINATION MARKER INTERACTION
// ==================================================
//
// During the FTUE:
// - Marker is visible
// - Marker cannot receive pointer/touch input
//
// After the FTUE:
// - Marker becomes interactive
// - Tapping it opens the existing Casino Card
//
// ==================================================

function geoplayMapUpdateDestinationMarkerInteraction()
{
    if (
        !window.geoplayDestinationMarker
    )
    {
        return 0;
    }


    var markerElement =
        window.geoplayDestinationMarker.getElement();


    if (!markerElement)
    {
        return 0;
    }


    if (
        window.geoplayMapStoryLocked
    )
    {
        markerElement.style.pointerEvents =
            "none";

        markerElement.style.cursor =
            "default";
    }
    else
    {
        markerElement.style.pointerEvents =
            "auto";

        markerElement.style.cursor =
            "pointer";
    }


    return 1;
}


// ==================================================
// DESTINATION MARKER INTERACTION
// ==================================================
//
// This is intentionally separate from the FTUE.
//
// The marker only becomes pointer-interactive after
// geoplayMapStoryLocked becomes false.
//
// Tapping the marker shows the existing collapsed
// Casino Card.
//
// ==================================================

function geoplayMapDestinationMarkerSelect()
{
    if (
        window.geoplayMapStoryLocked
    )
    {
        console.log(
            "GEOPLAY MAP: Casino marker selection blocked during story."
        );

        return 0;
    }


    if (
        typeof geoplayMapUIShowDestination !==
        "function"
    )
    {
        console.error(
            "GEOPLAY MAP: Casino destination card system is unavailable."
        );

        return 0;
    }


    console.log(
        "GEOPLAY MAP: Casino marker selected."
    );


    geoplayMapUIShowDestination();


    return 1;
}


// ==================================================
// LOCK MAP INTERACTION
// ==================================================

function geoplayMapLockInteraction()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    window.geoplayMapStoryLocked =
        true;


    if (
        window.geoplayMap.dragPan
    )
    {
        window.geoplayMap.dragPan.disable();
    }


    if (
        window.geoplayMap.scrollZoom
    )
    {
        window.geoplayMap.scrollZoom.disable();
    }


    if (
        window.geoplayMap.boxZoom
    )
    {
        window.geoplayMap.boxZoom.disable();
    }


    if (
        window.geoplayMap.dragRotate
    )
    {
        window.geoplayMap.dragRotate.disable();
    }


    if (
        window.geoplayMap.keyboard
    )
    {
        window.geoplayMap.keyboard.disable();
    }


    if (
        window.geoplayMap.doubleClickZoom
    )
    {
        window.geoplayMap.doubleClickZoom.disable();
    }


    if (
        window.geoplayMap.touchZoomRotate
    )
    {
        window.geoplayMap.touchZoomRotate.disable();
    }


    if (
        window.geoplayMap.touchPitch
    )
    {
        window.geoplayMap.touchPitch.disable();
    }


    // ==================================================
    // LOCK CASINO MARKER
    // ==================================================

    geoplayMapUpdateDestinationMarkerInteraction();


    console.log(
        "GEOPLAY MAP: Player interaction LOCKED for story."
    );


    return 1;
}


// ==================================================
// UNLOCK MAP INTERACTION
// ==================================================

function geoplayMapUnlockInteraction()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    window.geoplayMapStoryLocked =
        false;


    if (
        window.geoplayMap.dragPan
    )
    {
        window.geoplayMap.dragPan.enable();
    }


    if (
        window.geoplayMap.scrollZoom
    )
    {
        window.geoplayMap.scrollZoom.enable();
    }


    if (
        window.geoplayMap.boxZoom
    )
    {
        window.geoplayMap.boxZoom.enable();
    }


    if (
        window.geoplayMap.dragRotate
    )
    {
        window.geoplayMap.dragRotate.enable();
    }


    if (
        window.geoplayMap.keyboard
    )
    {
        window.geoplayMap.keyboard.enable();
    }


    if (
        window.geoplayMap.doubleClickZoom
    )
    {
        window.geoplayMap.doubleClickZoom.enable();
    }


    if (
        window.geoplayMap.touchZoomRotate
    )
    {
        window.geoplayMap.touchZoomRotate.enable();
    }


    if (
        window.geoplayMap.touchPitch
    )
    {
        window.geoplayMap.touchPitch.enable();
    }


    // ==================================================
    // UNLOCK CASINO MARKER
    // ==================================================

    geoplayMapUpdateDestinationMarkerInteraction();


    console.log(
        "GEOPLAY MAP: Player interaction UNLOCKED."
    );


    return 1;
}


// ==================================================
// GEOPLAY COSMIC MAP PALETTE
// ==================================================

function applyGeoplayCosmicMapPalette()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    var map =
        window.geoplayMap;


    var style =
        map.getStyle();


    if (
        !style ||
        !style.layers
    )
    {
        console.warn(
            "GEOPLAY MAP: Style layers not available yet."
        );

        return 0;
    }


    console.log(
        "GEOPLAY MAP: Applying Geoplay cosmic palette..."
    );


    for (
        var i = 0;
        i < style.layers.length;
        i++
    )
    {
        var layer =
            style.layers[i];


        var layerId =
            (
                layer.id ||
                ""
            ).toLowerCase();


        var layerType =
            layer.type;


        if (
            layerType ===
            "background"
        )
        {
            try
            {
                map.setPaintProperty(
                    layer.id,
                    "background-color",
                    "#10132D"
                );
            }
            catch (error)
            {
                console.warn(
                    "GEOPLAY MAP: Could not style background layer:",
                    layer.id
                );
            }


            continue;
        }


        if (
            layerId.indexOf(
                "water"
            ) !== -1
        )
        {
            if (
                layerType ===
                "fill"
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "fill-color",
                        "#101D42"
                    );
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style water layer:",
                        layer.id
                    );
                }
            }


            if (
                layerType ===
                "line"
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "line-color",
                        "#263A73"
                    );
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style water line:",
                        layer.id
                    );
                }
            }


            continue;
        }


        if (
            layerId.indexOf(
                "park"
            ) !== -1 ||

            layerId.indexOf(
                "landcover"
            ) !== -1 ||

            layerId.indexOf(
                "landuse"
            ) !== -1
        )
        {
            if (
                layerType ===
                "fill"
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "fill-color",
                        "#172A35"
                    );
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style green-space layer:",
                        layer.id
                    );
                }
            }


            continue;
        }


        if (
            layerId.indexOf(
                "building"
            ) !== -1
        )
        {
            if (
                layerType ===
                "fill"
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "fill-color",
                        "#18203A"
                    );


                    map.setPaintProperty(
                        layer.id,
                        "fill-opacity",
                        0.78
                    );
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style building layer:",
                        layer.id
                    );
                }
            }


            if (
                layerType ===
                "line"
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "line-color",
                        "#28335B"
                    );
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style building outline:",
                        layer.id
                    );
                }
            }


            continue;
        }


        if (
            layerId.indexOf(
                "road"
            ) !== -1 ||

            layerId.indexOf(
                "transport"
            ) !== -1 ||

            layerId.indexOf(
                "street"
            ) !== -1
        )
        {
            if (
                layerType ===
                "line"
            )
            {
                var majorRoad =
                    layerId.indexOf(
                        "motorway"
                    ) !== -1 ||

                    layerId.indexOf(
                        "trunk"
                    ) !== -1 ||

                    layerId.indexOf(
                        "primary"
                    ) !== -1;


                var secondaryRoad =
                    layerId.indexOf(
                        "secondary"
                    ) !== -1 ||

                    layerId.indexOf(
                        "tertiary"
                    ) !== -1;


                try
                {
                    if (
                        majorRoad
                    )
                    {
                        map.setPaintProperty(
                            layer.id,
                            "line-color",
                            "#7055D9"
                        );


                        map.setPaintProperty(
                            layer.id,
                            "line-opacity",
                            0.92
                        );
                    }
                    else if (
                        secondaryRoad
                    )
                    {
                        map.setPaintProperty(
                            layer.id,
                            "line-color",
                            "#344C91"
                        );


                        map.setPaintProperty(
                            layer.id,
                            "line-opacity",
                            0.88
                        );
                    }
                    else
                    {
                        map.setPaintProperty(
                            layer.id,
                            "line-color",
                            "#273864"
                        );


                        map.setPaintProperty(
                            layer.id,
                            "line-opacity",
                            0.82
                        );
                    }
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style road layer:",
                        layer.id
                    );
                }
            }


            continue;
        }


        if (
            layerId.indexOf(
                "rail"
            ) !== -1 ||

            layerId.indexOf(
                "transit"
            ) !== -1
        )
        {
            if (
                layerType ===
                "line"
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "line-color",
                        "#654AA8"
                    );


                    map.setPaintProperty(
                        layer.id,
                        "line-opacity",
                        0.70
                    );
                }
                catch (error)
                {
                    console.warn(
                        "GEOPLAY MAP: Could not style transit layer:",
                        layer.id
                    );
                }
            }


            continue;
        }


        if (
            layerType ===
            "symbol"
        )
        {
            try
            {
                map.setPaintProperty(
                    layer.id,
                    "text-color",
                    "#C7D5FF"
                );


                map.setPaintProperty(
                    layer.id,
                    "text-halo-color",
                    "#11152E"
                );


                map.setPaintProperty(
                    layer.id,
                    "text-halo-width",
                    1.1
                );


                map.setPaintProperty(
                    layer.id,
                    "text-halo-blur",
                    0.2
                );
            }
            catch (error)
            {
            }


            if (
                layerId.indexOf(
                    "place"
                ) !== -1 ||

                layerId.indexOf(
                    "settlement"
                ) !== -1
            )
            {
                try
                {
                    map.setPaintProperty(
                        layer.id,
                        "text-color",
                        "#D8C8FF"
                    );
                }
                catch (error)
                {
                }
            }


            continue;
        }
    }


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (
        mapContainer &&
        !document.getElementById(
            "geoplay-map-cosmic-overlay"
        )
    )
    {
        var overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "geoplay-map-cosmic-overlay";


        overlay.style.position =
            "absolute";


        overlay.style.left =
            "0";


        overlay.style.top =
            "0";


        overlay.style.right =
            "0";


        overlay.style.bottom =
            "0";


        overlay.style.pointerEvents =
            "none";


        overlay.style.zIndex =
            "5";


        overlay.style.background =
            "linear-gradient(" +
            "135deg," +
            "rgba(31,45,105,0.10) 0%," +
            "rgba(79,38,126,0.08) 52%," +
            "rgba(130,34,115,0.06) 100%" +
            ")";


        mapContainer.appendChild(
            overlay
        );
    }


    console.log(
        "GEOPLAY MAP: Cosmic palette applied."
    );


    return 1;
}


// ==================================================
// INITIALIZE MAP
// ==================================================

function initGeoplayMap()
{
    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (!mapContainer)
    {
        console.error(
            "GEOPLAY MAP: Map container not found."
        );

        return 0;
    }


    if (
        typeof maplibregl ===
        "undefined"
    )
    {
        console.error(
            "GEOPLAY MAP: MapLibre did not load."
        );

        return 0;
    }


    mapContainer.style.display =
        "block";


    if (
        window.geoplayMapInitialized &&
        window.geoplayMap
    )
    {
        window.geoplayMap.resize();


        if (
            window.geoplayMap.isStyleLoaded()
        )
        {
            applyGeoplayCosmicMapPalette();
        }


        return 1;
    }


    console.log(
        "GEOPLAY MAP: Initializing MapLibre..."
    );


    window.geoplayMap =
        new maplibregl.Map(
        {
            container:
                "geoplay-map",


            center:
            [
                geoplayMapLongitude,
                geoplayMapLatitude
            ],


            zoom:
                11.8,


            style:
                "https://tiles.openfreemap.org/styles/dark"
        });


    window.geoplayMap.on(
        "load",
        function()
        {
            console.log(
                "GEOPLAY MAP: MapLibre loaded."
            );


            window.geoplayMapInitialized =
                true;


            window.geoplayMapReady =
                true;


            window.geoplayMap.resize();


            applyGeoplayCosmicMapPalette();


            if (
                typeof geoplayMapLockInteraction ===
                "function"
            )
            {
                geoplayMapLockInteraction();
            }


            if (
                typeof
                window.geoplayMapFlowStart
                ===
                "function"
            )
            {
                window.geoplayMapFlowStart();
            }
        }
    );


    window.geoplayMap.on(
        "move",
        function()
        {
            if (
                typeof
                geoplayMapUIUpdatePositions
                ===
                "function"
            )
            {
                geoplayMapUIUpdatePositions();
            }
        }
    );


    window.geoplayMap.on(
        "error",
        function(event)
        {
            console.error(
                "GEOPLAY MAP: MapLibre error:",
                event
            );
        }
    );


    return 1;
}


// ==================================================
// CREATE PLAYER MARKER
// ==================================================

function geoplayMapCreatePlayerMarker()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    if (
        window.geoplayPlayerMarker
    )
    {
        return 1;
    }


    var markerElement =
        document.createElement(
            "div"
        );


    // ==================================================
    // MARKER CONTAINER
    // ==================================================

    markerElement.style.width =
        "94px";


    markerElement.style.height =
        "76px";


    markerElement.style.position =
        "relative";


    markerElement.style.display =
        "block";


    markerElement.style.pointerEvents =
        "none";


    markerElement.style.boxSizing =
        "border-box";


    markerElement.style.overflow =
        "visible";


    // ==================================================
    // PULSE
    // ==================================================

    var pulse =
        document.createElement(
            "div"
        );


    pulse.className =
        "geoplay-player-marker-pulse";


    markerElement.appendChild(
        pulse
    );


    // ==================================================
    // RING
    // ==================================================

    var ring =
        document.createElement(
            "div"
        );


    ring.className =
        "geoplay-player-marker-ring";


    markerElement.appendChild(
        ring
    );


    // ==================================================
    // PLAYER IMAGE
    // ==================================================

    var playerImage =
        document.createElement(
            "img"
        );


    playerImage.src =
        "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/player-map.png";


    playerImage.alt =
        "Geoplay player";


    playerImage.className =
        "geoplay-player-marker-image";


    playerImage.draggable =
        false;


    playerImage.onload =
        function()
        {
            console.log(
                "GEOPLAY MAP: Player robot image loaded from Cloudflare R2."
            );
        };


    playerImage.onerror =
        function(error)
        {
            console.error(
                "GEOPLAY MAP: Player robot image FAILED to load from Cloudflare R2.",
                error
            );
        };


    markerElement.appendChild(
        playerImage
    );


    // ==================================================
    // CREATE MAP MARKER
    // ==================================================

    window.geoplayPlayerMarker =
        new maplibregl.Marker(
        {
            element:
                markerElement,

            anchor:
                "bottom"
        })
        .setLngLat(
        [
            geoplayMapLongitude,
            geoplayMapLatitude
        ])
        .addTo(
            window.geoplayMap
        );


    console.log(
        "GEOPLAY MAP: Player marker created."
    );


    return 1;
}


// ==================================================
// SHOW PLAYER MARKER
// ==================================================

function geoplayMapShowPlayerMarker()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    if (
        !window.geoplayPlayerMarker
    )
    {
        geoplayMapCreatePlayerMarker();
    }
    else
    {
        window.geoplayPlayerMarker.addTo(
            window.geoplayMap
        );
    }


    return 1;
}


// ==================================================
// PLAYER MARKER POP
// ==================================================

function geoplayMapPlayerMarkerPop()
{
    if (
        !window.geoplayPlayerMarker
    )
    {
        return 0;
    }


    var markerElement =
        window.geoplayPlayerMarker.getElement();


    if (!markerElement)
    {
        return 0;
    }


    var playerImage =
        markerElement.querySelector(
            ".geoplay-player-marker-image"
        );


    if (!playerImage)
    {
        return 0;
    }


    playerImage.classList.remove(
        "geoplay-player-marker-pop"
    );


    void playerImage.offsetWidth;


    playerImage.classList.add(
        "geoplay-player-marker-pop"
    );


    return 1;
}


// ==================================================
// HIDE PLAYER MARKER
// ==================================================

function geoplayMapHidePlayerMarker()
{
    if (
        window.geoplayPlayerMarker
    )
    {
        window.geoplayPlayerMarker.remove();
    }


    return 1;
}


// ==================================================
// CREATE DESTINATION MARKER
// ==================================================

function geoplayMapCreateDestinationMarker()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    if (
        window.geoplayDestinationMarker
    )
    {
        geoplayMapUpdateDestinationMarkerInteraction();

        return 1;
    }


    var longitude =
        window.geoplayDestinationLongitude;


    var latitude =
        window.geoplayDestinationLatitude;


    if (
        typeof longitude ===
        "undefined"
    )
    {
        longitude =
            -118.0735;
    }


    if (
        typeof latitude ===
        "undefined"
    )
    {
        latitude =
            34.1085;
    }


    // ==================================================
    // DESTINATION MARKER CONTAINER
    // ==================================================

    var markerElement =
        document.createElement(
            "div"
        );


    markerElement.style.width =
        "94px";


    markerElement.style.height =
        "76px";


    markerElement.style.position =
        "relative";


    markerElement.style.display =
        "block";


    // IMPORTANT:
    // This is updated immediately below based on
    // whether the FTUE is currently locked.

    markerElement.style.pointerEvents =
        "none";


    markerElement.style.boxSizing =
        "border-box";


    markerElement.style.overflow =
        "visible";


    // ==================================================
    // PULSE
    // ==================================================

    var pulse =
        document.createElement(
            "div"
        );


    pulse.className =
        "geoplay-destination-marker-pulse";


    markerElement.appendChild(
        pulse
    );


    // ==================================================
    // RING
    // ==================================================

    var ring =
        document.createElement(
            "div"
        );


    ring.className =
        "geoplay-destination-marker-ring";


    markerElement.appendChild(
        ring
    );


    // ==================================================
    // DESTINATION IMAGE
    // ==================================================

    var destinationImage =
        document.createElement(
            "img"
        );


    destinationImage.src =
        "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine_ridge_512.png";


    destinationImage.alt =
        "Pine Ridge Casino";


    destinationImage.className =
        "geoplay-destination-marker-image";


    destinationImage.draggable =
        false;


    destinationImage.onload =
        function()
        {
            console.log(
                "GEOPLAY MAP: Pine Ridge Casino logo loaded from Cloudflare R2."
            );
        };


    destinationImage.onerror =
        function(error)
        {
            console.error(
                "GEOPLAY MAP: Pine Ridge Casino logo FAILED to load from Cloudflare R2.",
                error
            );
        };


    markerElement.appendChild(
        destinationImage
    );


    // ==================================================
    // DESTINATION MARKER CLICK / TAP
    // ==================================================

    function handleDestinationMarkerInteraction(
        event
    )
    {
        if (
            window.geoplayMapStoryLocked
        )
        {
            return;
        }


        if (
            event
        )
        {
            event.preventDefault();
            event.stopPropagation();
        }


        geoplayMapDestinationMarkerSelect();
    }


    markerElement.addEventListener(
        "click",
        handleDestinationMarkerInteraction
    );


    markerElement.addEventListener(
        "touchend",
        handleDestinationMarkerInteraction,
        {
            passive: false
        }
    );


    // ==================================================
    // CREATE MAP MARKER
    // ==================================================

    window.geoplayDestinationMarker =
        new maplibregl.Marker(
        {
            element:
                markerElement,

            anchor:
                "bottom"
        })
        .setLngLat(
        [
            longitude,
            latitude
        ])
        .addTo(
            window.geoplayMap
        );


    // ==================================================
    // APPLY CURRENT STORY INTERACTION STATE
    // ==================================================

    geoplayMapUpdateDestinationMarkerInteraction();


    console.log(
        "GEOPLAY MAP: Pine Ridge Casino destination marker created."
    );


    return 1;
}


// ==================================================
// SHOW DESTINATION MARKER
// ==================================================

function geoplayMapShowDestinationMarker()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    if (
        !window.geoplayDestinationMarker
    )
    {
        geoplayMapCreateDestinationMarker();
    }
    else
    {
        window.geoplayDestinationMarker.addTo(
            window.geoplayMap
        );

        geoplayMapUpdateDestinationMarkerInteraction();
    }


    return 1;
}


// ==================================================
// HIDE DESTINATION MARKER
// ==================================================

function geoplayMapHideDestinationMarker()
{
    if (
        window.geoplayDestinationMarker
    )
    {
        window.geoplayDestinationMarker.remove();
    }


    return 1;
}


// ==================================================
// SHOW MAP
// ==================================================

function gmcallback_geoplay_map_show()
{
    console.log(
        "GEOPLAY MAP: Show requested."
    );


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (!mapContainer)
    {
        console.error(
            "GEOPLAY MAP: Map container not found."
        );

        return 0;
    }


    mapContainer.style.display =
        "block";


    setTimeout(
        function()
        {
            initGeoplayMap();

        },
        250
    );


    return 1;
}


// ==================================================
// HIDE MAP
// ==================================================

function gmcallback_geoplay_map_hide()
{
    console.log(
        "GEOPLAY MAP: Hide requested."
    );


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (!mapContainer)
    {
        return 0;
    }


    mapContainer.style.display =
        "none";


    return 1;
}