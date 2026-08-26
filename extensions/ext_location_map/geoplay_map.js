// ==================================================
// CREATE PLAYER MARKER
// ==================================================
//
// PLAYER AVATAR MARKER
//
// - Existing Cloudflare R2 avatar remains unchanged.
// - Avatar has a fixed screen size.
// - Zooming IN never makes the avatar smaller.
// - Zooming OUT allows a small size increase.
// - Geographic position remains anchored to the
//   player's actual location.
// - Avatar visual scaling is handled explicitly.
//
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


    // --------------------------------------------------
    // MAPLIBRE MARKER CONTAINER
    // --------------------------------------------------

    var markerElement =
        document.createElement(
            "div"
        );


    markerElement.style.width =
        "96px";


    markerElement.style.height =
        "112px";


    markerElement.style.position =
        "relative";


    markerElement.style.display =
        "block";


    markerElement.style.pointerEvents =
        "none";


    markerElement.style.overflow =
        "visible";


    markerElement.style.boxSizing =
        "border-box";


    // --------------------------------------------------
    // FIXED-SIZE VISUAL CONTAINER
    // --------------------------------------------------

    var markerVisual =
        document.createElement(
            "div"
        );


    markerVisual.style.position =
        "absolute";


    markerVisual.style.left =
        "50%";


    markerVisual.style.bottom =
        "0";


    markerVisual.style.width =
        "96px";


    markerVisual.style.height =
        "112px";


    markerVisual.style.marginLeft =
        "-48px";


    markerVisual.style.transform =
        "none";


    markerVisual.style.transformOrigin =
        "50% 100%";


    markerVisual.style.pointerEvents =
        "none";


    markerVisual.style.overflow =
        "visible";


    markerElement.appendChild(
        markerVisual
    );


    // --------------------------------------------------
    // PLAYER MARKER STYLES
    // --------------------------------------------------

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

.geoplay-player-marker-ring-outer
{
    position:
        absolute;

    left:
        50%;

    top:
        3px;

    width:
        82px;

    height:
        82px;

    border:
        2px solid
        rgba(
            58,
            218,
            255,
            .48
        );

    border-radius:
        50%;

    transform:
        translateX(
            -50%
        );

    box-shadow:
        0 0 18px
        rgba(
            58,
            218,
            255,
            .28
        );

    animation:
        geoplayPlayerOuterPulse
        2.8s
        ease-out
        infinite;

    pointer-events:
        none;
}


.geoplay-player-marker-ring
{
    position:
        absolute;

    left:
        50%;

    top:
        9px;

    width:
        72px;

    height:
        72px;

    border:
        3px solid
        rgba(
            55,
            220,
            255,
            1
        );

    border-radius:
        50%;

    background:
        rgba(
            40,
            190,
            255,
            .13
        );

    transform:
        translateX(
            -50%
        );

    box-shadow:
        0 0 12px
        rgba(
            55,
            220,
            255,
            1
        ),

        0 0 28px
        rgba(
            55,
            220,
            255,
            .72
        ),

        0 0 46px
        rgba(
            55,
            220,
            255,
            .28
        );

    animation:
        geoplayPlayerMarkerGlow
        2.6s
        ease-in-out
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
        16px;

    width:
        58px;

    height:
        58px;

    min-width:
        58px;

    min-height:
        58px;

    max-width:
        none;

    max-height:
        none;

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

    filter:
        drop-shadow(
            0 0 5px
            rgba(
                40,
                210,
                255,
                .85
            )
        )
        drop-shadow(
            0 0 12px
            rgba(
                40,
                210,
                255,
                .45
            )
        );
}


.geoplay-player-marker-point-line
{
    position:
        absolute;

    left:
        50%;

    bottom:
        23px;

    width:
        3px;

    height:
        18px;

    background:
        linear-gradient(
            to bottom,
            rgba(
                55,
                220,
                255,
                .15
            ),
            rgba(
                55,
                220,
                255,
                .95
            )
        );

    transform:
        translateX(
            -50%
        );

    box-shadow:
        0 0 8px
        rgba(
            55,
            220,
            255,
            .85
        );

    z-index:
        2;

    pointer-events:
        none;
}


.geoplay-player-marker-point
{
    position:
        absolute;

    left:
        50%;

    bottom:
        8px;

    width:
        15px;

    height:
        15px;

    background:
        #42DDFF;

    border:
        3px solid
        #FFFFFF;

    border-radius:
        50%;

    transform:
        translateX(
            -50%
        );

    box-shadow:
        0 0 10px
        rgba(
            66,
            221,
            255,
            1
        ),

        0 0 22px
        rgba(
            66,
            221,
            255,
            .95
        ),

        0 0 38px
        rgba(
            66,
            221,
            255,
            .55
        );

    z-index:
        5;

    pointer-events:
        none;
}


.geoplay-player-ground-ring
{
    position:
        absolute;

    left:
        50%;

    bottom:
        1px;

    width:
        42px;

    height:
        14px;

    border:
        2px solid
        rgba(
            55,
            220,
            255,
            .82
        );

    border-radius:
        50%;

    transform:
        translateX(
            -50%
        )
        scale(
            .65
        );

    opacity:
        .9;

    animation:
        geoplayPlayerGroundPulse
        2.2s
        ease-out
        infinite;

    pointer-events:
        none;
}


@keyframes geoplayPlayerMarkerGlow
{
    0%,
    100%
    {
        opacity:
            .82;

        box-shadow:
            0 0 12px
            rgba(
                55,
                220,
                255,
                .85
            ),

            0 0 26px
            rgba(
                55,
                220,
                255,
                .55
            ),

            0 0 42px
            rgba(
                55,
                220,
                255,
                .22
            );
    }


    50%
    {
        opacity:
            1;

        box-shadow:
            0 0 16px
            rgba(
                55,
                220,
                255,
                1
            ),

            0 0 34px
            rgba(
                55,
                220,
                255,
                .78
            ),

            0 0 54px
            rgba(
                55,
                220,
                255,
                .38
            );
    }
}


@keyframes geoplayPlayerOuterPulse
{
    0%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                .86
            );

        opacity:
            .65;
    }


    70%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                1.08
            );

        opacity:
            .22;
    }


    100%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                1.16
            );

        opacity:
            0;
    }
}


@keyframes geoplayPlayerGroundPulse
{
    0%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                .65
            );

        opacity:
            .88;
    }


    70%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                1.55
            );

        opacity:
            .16;
    }


    100%
    {
        transform:
            translateX(
                -50%
            )
            scale(
                1.85
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


    // --------------------------------------------------
    // OUTER RING
    // --------------------------------------------------

    var outerRing =
        document.createElement(
            "div"
        );


    outerRing.className =
        "geoplay-player-marker-ring-outer";


    markerVisual.appendChild(
        outerRing
    );


    // --------------------------------------------------
    // MAIN RING
    // --------------------------------------------------

    var ring =
        document.createElement(
            "div"
        );


    ring.className =
        "geoplay-player-marker-ring";


    markerVisual.appendChild(
        ring
    );


    // --------------------------------------------------
    // PLAYER AVATAR
    // --------------------------------------------------

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
                "GEOPLAY MAP: Player avatar loaded from Cloudflare R2."
            );
        };


    playerImage.onerror =
        function(error)
        {
            console.error(
                "GEOPLAY MAP: Player avatar FAILED to load.",
                error
            );
        };


    markerVisual.appendChild(
        playerImage
    );


    // --------------------------------------------------
    // LOCATION STEM
    // --------------------------------------------------

    var pointLine =
        document.createElement(
            "div"
        );


    pointLine.className =
        "geoplay-player-marker-point-line";


    markerVisual.appendChild(
        pointLine
    );


    // --------------------------------------------------
    // LOCATION POINT
    // --------------------------------------------------

    var point =
        document.createElement(
            "div"
        );


    point.className =
        "geoplay-player-marker-point";


    markerVisual.appendChild(
        point
    );


    // --------------------------------------------------
    // GROUND PULSE
    // --------------------------------------------------

    var groundRing =
        document.createElement(
            "div"
        );


    groundRing.className =
        "geoplay-player-ground-ring";


    markerVisual.appendChild(
        groundRing
    );


    // --------------------------------------------------
    // CREATE MAPLIBRE MARKER
    // --------------------------------------------------

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
        "GEOPLAY MAP: Player marker created with fixed screen size."
    );


    return 1;
}