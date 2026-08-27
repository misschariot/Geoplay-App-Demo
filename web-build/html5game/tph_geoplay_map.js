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
//
// STORY UI:
// geoplay_map_ui.js
//
// FLOW:
// geoplay_map_flow.js
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

var geoplayMapLongitude =
    -118.1046;

var geoplayMapLatitude =
    34.1123;


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
                15.5,


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
    //
    // The player's geographic coordinate is aligned
    // with the bottom of the avatar itself.
    //
    // The avatar is 74px tall and begins at 2px.
    // Therefore:
    //
    // 2px + 74px = 76px
    //
    // The marker container is 76px tall so its bottom
    // anchor corresponds directly with the bottom of
    // the avatar.
    //
    // The pulse is allowed to render outside the
    // container.
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


    if (
        !document.getElementById(
            "geoplay-player-marker-styles"
        )
    )
    {
        var markerStyle =
            document.createElement(
                "style"
            );


        markerStyle.id =
            "geoplay-player-marker-styles";


        markerStyle.textContent = `

.geoplay-player-marker-ring
{
    position:
        absolute;

    left:
        50%;

    top:
        4px;

    width:
        76px;

    height:
        76px;

    border:
        2px solid
        rgba(
            52,
            210,
            255,
            .90
        );

    border-radius:
        50%;

    background:
        rgba(
            52,
            210,
            255,
            .08
        );

    transform:
        translateX(
            -50%
        );

    box-shadow:
        0 0 10px
        rgba(
            52,
            210,
            255,
            .88
        ),
        0 0 24px
        rgba(
            52,
            210,
            255,
            .45
        );

    animation:
        geoplayPlayerMarkerGlow
        2.8s
        ease-in-out
        infinite;

    pointer-events:
        none;
}


.geoplay-player-marker-pulse
{
    position:
        absolute;

    left:
        50%;

    top:
        42px;

    width:
        86px;

    height:
        86px;

    border:
        1px solid
        rgba(
            52,
            210,
            255,
            .38
        );

    border-radius:
        50%;

    transform:
        translate(
            -50%,
            -50%
        )
        scale(
            .25
        );

    opacity:
        .72;

    animation:
        geoplayPlayerMarkerPulse
        2.8s
        ease-out
        infinite;

    pointer-events:
        none;
}


.geoplay-player-marker-image
{
    position:
        absolute;

    left:
        50%;

    top:
        5px;

    width:
        74px;

    height:
        74px;

    min-width:
        74px;

    min-height:
        74px;

    max-width:
        74px;

    max-height:
        74px;

    flex-shrink:
        0;

    object-fit:
        contain;

    display:
        block;

    transform:
        translateX(
            -50%
        );

    transform-origin:
        center center;

    z-index:
        3;

    pointer-events:
        none;

    user-select:
        none;

    -webkit-user-drag:
        none;
}


.geoplay-player-marker-image.geoplay-player-marker-pop
{
    animation:
        geoplayPlayerMarkerPop
        .45s
        cubic-bezier(
            .22,
            1.25,
            .36,
            1
        );
}


@keyframes geoplayPlayerMarkerGlow
{
    0%,
    100%
    {
        opacity:
            .72;

        box-shadow:
            0 0 10px
            rgba(
                52,
                210,
                255,
                .78
            ),
            0 0 22px
            rgba(
                52,
                210,
                255,
                .34
            );
    }


    50%
    {
        opacity:
            1;

        box-shadow:
            0 0 14px
            rgba(
                52,
                210,
                255,
                .98
            ),
            0 0 32px
            rgba(
                52,
                210,
                255,
                .58
            );
    }
}


@keyframes geoplayPlayerMarkerPop
{
    0%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                .78
            );

        opacity:
            0;
    }


    55%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                1.08
            );

        opacity:
            1;
    }


    78%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                .98
            );

        opacity:
            1;
    }


    100%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                1
            );

        opacity:
            1;
    }
}


@keyframes geoplayPlayerMarkerPulse
{
    0%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                .25
            );

        opacity:
            .72;
    }


    65%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                1.05
            );

        opacity:
            .30;
    }


    100%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                1.55
            );

        opacity:
            0;
    }
}

`;


        document.head.appendChild(
            markerStyle
        );
    }


    var pulse =
        document.createElement(
            "div"
        );


    pulse.className =
        "geoplay-player-marker-pulse";


    markerElement.appendChild(
        pulse
    );


    var ring =
        document.createElement(
            "div"
        );


    ring.className =
        "geoplay-player-marker-ring";


    markerElement.appendChild(
        ring
    );


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
    //
    // Pine Ridge uses the same visual structure as the
    // player marker:
    //
    // - 76px ring
    // - 74px avatar
    // - continuous pulse
    //
    // The destination version uses yellow instead of
    // the player's cyan so the two markers are clearly
    // differentiated.
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


    markerElement.style.pointerEvents =
        "none";


    markerElement.style.boxSizing =
        "border-box";


    markerElement.style.overflow =
        "visible";


    if (
        !document.getElementById(
            "geoplay-destination-marker-styles"
        )
    )
    {
        var destinationStyle =
            document.createElement(
                "style"
            );


        destinationStyle.id =
            "geoplay-destination-marker-styles";


        destinationStyle.textContent = `

.geoplay-destination-marker-ring
{
    position:
        absolute;

    left:
        50%;

    top:
        4px;

    width:
        76px;

    height:
        76px;

    border:
        2px solid
        rgba(
            255,
            190,
            70,
            .95
        );

    border-radius:
        50%;

    background:
        rgba(
            255,
            190,
            70,
            .08
        );

    transform:
        translateX(
            -50%
        );

    box-shadow:
        0 0 10px
        rgba(
            255,
            190,
            70,
            .90
        ),
        0 0 24px
        rgba(
            255,
            190,
            70,
            .45
        );

    animation:
        geoplayDestinationMarkerGlow
        2.8s
        ease-in-out
        infinite;

    pointer-events:
        none;
}


.geoplay-destination-marker-pulse
{
    position:
        absolute;

    left:
        50%;

    top:
        42px;

    width:
        86px;

    height:
        86px;

    border:
        1px solid
        rgba(
            255,
            190,
            70,
            .42
        );

    border-radius:
        50%;

    transform:
        translate(
            -50%,
            -50%
        )
        scale(
            .25
        );

    opacity:
        .72;

    animation:
        geoplayDestinationMarkerPulse
        2.8s
        ease-out
        infinite;

    pointer-events:
        none;
}


.geoplay-destination-marker-image
{
    position:
        absolute;

    left:
        50%;

    top:
        5px;

    width:
        74px;

    height:
        74px;

    min-width:
        74px;

    min-height:
        74px;

    max-width:
        74px;

    max-height:
        74px;

    flex-shrink:
        0;

    object-fit:
        contain;

    display:
        block;

    transform:
        translateX(
            -50%
        );

    transform-origin:
        center center;

    z-index:
        3;

    pointer-events:
        none;

    user-select:
        none;

    -webkit-user-drag:
        none;
}


@keyframes geoplayDestinationMarkerGlow
{
    0%,
    100%
    {
        opacity:
            .72;

        box-shadow:
            0 0 10px
            rgba(
                255,
                190,
                70,
                .82
            ),
            0 0 22px
            rgba(
                255,
                190,
                70,
                .34
            );
    }


    50%
    {
        opacity:
            1;

        box-shadow:
            0 0 14px
            rgba(
                255,
                190,
                70,
                1
            ),
            0 0 32px
            rgba(
                255,
                190,
                70,
                .58
            );
    }
}


@keyframes geoplayDestinationMarkerPulse
{
    0%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                .25
            );

        opacity:
            .72;
    }


    65%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                1.05
            );

        opacity:
            .30;
    }


    100%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                1.55
            );

        opacity:
            0;
    }
}

`;


        document.head.appendChild(
            destinationStyle
        );
    }


    var pulse =
        document.createElement(
            "div"
        );


    pulse.className =
        "geoplay-destination-marker-pulse";


    markerElement.appendChild(
        pulse
    );


    var ring =
        document.createElement(
            "div"
        );


    ring.className =
        "geoplay-destination-marker-ring";


    markerElement.appendChild(
        ring
    );


    var destinationImage =
        document.createElement(
            "img"
        );


    destinationImage.src =
        "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine-ridge.png";


    destinationImage.alt =
        "Pine Ridge";


    destinationImage.className =
        "geoplay-destination-marker-image";


    destinationImage.draggable =
        false;


    destinationImage.onload =
        function()
        {
            console.log(
                "GEOPLAY MAP: Pine Ridge image loaded from Cloudflare R2."
            );
        };


    destinationImage.onerror =
        function(error)
        {
            console.error(
                "GEOPLAY MAP: Pine Ridge image FAILED to load from Cloudflare R2.",
                error
            );
        };


    markerElement.appendChild(
        destinationImage
    );


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


    console.log(
        "GEOPLAY MAP: Pine Ridge destination marker created."
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