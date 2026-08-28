// ==================================================
// GEOPLAY MAP DESTINATION
// PINE RIDGE CASINO DESTINATION SYSTEM
// ==================================================
//
// RESPONSIBILITY:
// - Pine Ridge destination card
// - Collapsed / expanded states
// - Casino image
// - Distance / address
// - PLAY HERE
// - Off-screen indicator
// - Destination positioning
// - Directional arrow
// - Go-to-destination behavior
//
// DEPENDENCIES:
// - geoplay_map_ui.js
// - geoplay_map_flow.js
// - geoplay_map.js
//
// ==================================================


// ==================================================
// DESTINATION STATE
// ==================================================

window.geoplayDestinationCard =
    null;

window.geoplayDestinationOffscreenArrow =
    null;

window.geoplayDestinationVisible =
    false;

window.geoplayDestinationOffscreen =
    false;

window.geoplayDestinationExpanded =
    false;

window.geoplayDestinationOverlay =
    null;


// ==================================================
// CREATE DESTINATION CARD
// ==================================================

function geoplayMapUICreateDestinationCard()
{
    // ==================================================
    // CREATE DESTINATION OVERLAY
    // ==================================================

    var overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "geoplay-destination-overlay";


    overlay.className =
        "geoplay-destination-overlay";


    window.geoplayMapUI.appendChild(
        overlay
    );


    window.geoplayDestinationOverlay =
        overlay;


    // ==================================================
    // CREATE DESTINATION CARD
    // ==================================================

    var card =
        document.createElement(
            "div"
        );


    card.id =
        "geoplay-destination";


    card.className =
        "geoplay-destination";


    geoplayMapUISetDestinationCollapsed(
        card
    );


    window.geoplayMapUI.appendChild(
        card
    );


    window.geoplayDestinationCard =
        card;


    card.addEventListener(
        "click",
        function(event)
        {
            if (
                event.target.closest(
                    ".geoplay-destination-close"
                )
            )
            {
                return;
            }


            if (
                event.target.closest(
                    ".geoplay-destination-play"
                )
            )
            {
                return;
            }


            if (
                window.geoplayMapStoryLocked
            )
            {
                return;
            }


            if (
                !window.geoplayDestinationExpanded
            )
            {
                geoplayMapUIExpandDestination();
            }
        }
    );


    card.addEventListener(
        "touchend",
        function(event)
        {
            if (
                event.target.closest(
                    ".geoplay-destination-close"
                )
            )
            {
                return;
            }


            if (
                event.target.closest(
                    ".geoplay-destination-play"
                )
            )
            {
                return;
            }


            if (
                window.geoplayMapStoryLocked
            )
            {
                return;
            }


            event.preventDefault();


            if (
                !window.geoplayDestinationExpanded
            )
            {
                geoplayMapUIExpandDestination();
            }
        },
        {
            passive:
                false
        }
    );
}


// ==================================================
// COLLAPSED DESTINATION CONTENT
// ==================================================

function geoplayMapUISetDestinationCollapsed(
    card
)
{
    card.classList.remove(
        "expanded"
    );


    card.innerHTML =
        "<div class='geoplay-destination-collapsed'>" +

            "<div class='geoplay-destination-collapsed-main'>" +

                "<span class='geoplay-destination-title'>" +
                    "📍 PINE RIDGE CASINO" +
                "</span>" +

                "<span class='geoplay-destination-info'>" +
                    "2.4 MI AWAY" +
                "</span>" +

            "</div>" +

            "<span class='geoplay-destination-chevron'>" +
                "›" +
            "</span>" +

        "</div>";


    window.geoplayDestinationExpanded =
        false;
}


// ==================================================
// EXPANDED DESTINATION CONTENT
// ==================================================

function geoplayMapUISetDestinationExpanded(
    card
)
{
    card.classList.add(
        "expanded"
    );


    card.innerHTML =
        "<div class='geoplay-destination-expanded-header'>" +

            "<span class='geoplay-destination-expanded-title'>" +
                "PINE RIDGE CASINO" +
            "</span>" +

            "<button " +
                "type='button' " +
                "class='geoplay-destination-close' " +
                "aria-label='Close Pine Ridge information'>" +
                "×" +
            "</button>" +

        "</div>" +


        "<img " +
            "class='geoplay-destination-image' " +
            "src='https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine_ridge_casino_image.png' " +
            "alt='Pine Ridge Casino' " +
            "draggable='false'>" +


        "<div class='geoplay-destination-expanded-divider'></div>" +


        "<div class='geoplay-destination-expanded-details'>" +


            "<div class='geoplay-destination-expanded-distance'>" +

                "<span class='geoplay-destination-distance-icon'>" +
                    "➜" +
                "</span>" +

                "<span>" +
                    "2.4 MI AWAY" +
                "</span>" +

            "</div>" +


            "<div class='geoplay-destination-expanded-address'>" +

                "<span class='geoplay-destination-address-icon'>" +
                    "📍" +
                "</span>" +

                "<span class='geoplay-destination-address-text'>" +
                    "777 Pine Ridge Road<br>" +
                    "Pine Ridge, CA 95563" +
                "</span>" +

            "</div>" +


        "</div>" +


        "<button " +
            "type='button' " +
            "class='geoplay-destination-play'>" +

            "<span>" +
                "PLAY HERE" +
            "</span>" +

            "<span class='geoplay-destination-play-arrow'>" +
                "→" +
            "</span>" +

        "</button>";


    window.geoplayDestinationExpanded =
        true;


    var closeButton =
        card.querySelector(
            ".geoplay-destination-close"
        );


    if (closeButton)
    {
        closeButton.addEventListener(
            "click",
            function(event)
            {
                event.preventDefault();

                event.stopPropagation();


                geoplayMapUICollapseDestination();
            }
        );


        closeButton.addEventListener(
            "touchend",
            function(event)
            {
                event.preventDefault();

                event.stopPropagation();


                geoplayMapUICollapseDestination();
            },
            {
                passive:
                    false
            }
        );
    }


    var playButton =
        card.querySelector(
            ".geoplay-destination-play"
        );


    if (playButton)
    {
        playButton.addEventListener(
            "click",
            function(event)
            {
                event.preventDefault();

                event.stopPropagation();


                geoplayMapUIPlayHere();
            }
        );


        playButton.addEventListener(
            "touchend",
            function(event)
            {
                event.preventDefault();

                event.stopPropagation();


                geoplayMapUIPlayHere();
            },
            {
                passive:
                    false
            }
        );
    }
}


// ==================================================
// EXPAND DESTINATION
// ==================================================

function geoplayMapUIExpandDestination()
{
    if (
        !window.geoplayDestinationCard
    )
    {
        return 0;
    }


    if (
        window.geoplayMapStoryLocked
    )
    {
        return 0;
    }


    geoplayMapUISetDestinationExpanded(
        window.geoplayDestinationCard
    );


    // ==================================================
    // SHOW DESTINATION OVERLAY
    // ==================================================

    if (
        window.geoplayDestinationOverlay
    )
    {
        window.geoplayDestinationOverlay.classList.add(
            "visible"
        );
    }


    geoplayMapUIPositionDestination();


    console.log(
        "GEOPLAY UI: Pine Ridge information card expanded."
    );


    return 1;
}


// ==================================================
// COLLAPSE DESTINATION
// ==================================================

function geoplayMapUICollapseDestination()
{
    if (
        !window.geoplayDestinationCard
    )
    {
        return 0;
    }


    geoplayMapUISetDestinationCollapsed(
        window.geoplayDestinationCard
    );


    // ==================================================
    // HIDE DESTINATION OVERLAY
    // ==================================================

    if (
        window.geoplayDestinationOverlay
    )
    {
        window.geoplayDestinationOverlay.classList.remove(
            "visible"
        );
    }


    geoplayMapUIPositionDestination();


    console.log(
        "GEOPLAY UI: Pine Ridge information card collapsed."
    );


    return 1;
}


// ==================================================
// PLAY HERE
// ==================================================
//
// FUTURE FUNCTIONALITY:
// - PLAY HERE behavior will be added later.
//
// For now, the expanded Pine Ridge popup
// remains open when this button is tapped.
//
// ==================================================

function geoplayMapUIPlayHere()
{
    if (
        window.geoplayMapStoryLocked
    )
    {
        return 0;
    }


    console.log(
        "GEOPLAY UI: PLAY HERE selected."
    );


    // ==================================================
    // FUTURE PLAY HERE FUNCTIONALITY
    // ==================================================
    //
    // Intentionally left inactive for now.
    //
    // The popup stays open.
    //
    // ==================================================


    return 1;
}


// ==================================================
// CREATE OFF-SCREEN INDICATOR
// ==================================================

function geoplayMapUICreateOffscreenIndicator()
{
    var indicator =
        document.createElement(
            "div"
        );


    indicator.id =
        "geoplay-destination-offscreen";


    indicator.className =
        "geoplay-destination-offscreen";


    var arrow =
        document.createElement(
            "span"
        );


    arrow.id =
        "geoplay-destination-offscreen-arrow";


    arrow.className =
        "geoplay-destination-offscreen-arrow";


    arrow.textContent =
        "➜";


    var name =
        document.createElement(
            "span"
        );


    name.className =
        "geoplay-destination-offscreen-name";


    name.textContent =
        "PINE RIDGE";


    indicator.appendChild(
        arrow
    );


    indicator.appendChild(
        name
    );


    window.geoplayDestinationOffscreenArrow =
        arrow;


    window.geoplayMapUI.appendChild(
        indicator
    );


    indicator.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            if (
                window.geoplayMapStoryLocked
            )
            {
                return;
            }


            geoplayMapUIGoToDestination();
        }
    );


    indicator.addEventListener(
        "touchend",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            if (
                window.geoplayMapStoryLocked
            )
            {
                return;
            }


            geoplayMapUIGoToDestination();
        },
        {
            passive:
                false
        }
    );
}


// ==================================================
// SHOW DESTINATION
// ==================================================

function geoplayMapUIShowDestination()
{
    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    var card =
        document.getElementById(
            "geoplay-destination"
        );


    if (!card)
    {
        return 0;
    }


    window.geoplayDestinationVisible =
        true;


    geoplayMapUICollapseDestination();


    geoplayMapUIPositionDestination();


    console.log(
        "GEOPLAY UI: Pine Ridge destination presentation activated."
    );


    return 1;
}


// ==================================================
// POSITION DESTINATION
// ==================================================

function geoplayMapUIPositionDestination()
{
    if (
        !window.geoplayMap ||
        !window.geoplayDestinationVisible
    )
    {
        return;
    }


    var card =
        document.getElementById(
            "geoplay-destination"
        );


    var indicator =
        document.getElementById(
            "geoplay-destination-offscreen"
        );


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (
        !card ||
        !indicator ||
        !mapContainer
    )
    {
        return;
    }


    // ==================================================
    // EXPANDED DESTINATION = VIEWPORT-CENTERED MODAL
    // ==================================================
    //
    // Once the Pine Ridge card is expanded, it is no
    // longer treated as map-attached UI.
    //
    // It is centered relative to the visible map/browser
    // viewport instead.
    //
    // This also means the expanded card remains centered
    // if the map moves underneath it.
    //
    // ==================================================

    if (
        window.geoplayDestinationExpanded
    )
    {
        card.classList.add(
            "visible"
        );


        indicator.classList.remove(
            "visible"
        );


        window.geoplayDestinationOffscreen =
            false;


        var expandedWidth =
            mapContainer.clientWidth;


        var expandedHeight =
            mapContainer.clientHeight;


        card.style.left =
            (
                expandedWidth /
                2
            ) +
            "px";


        card.style.top =
            (
                expandedHeight /
                2
            ) +
            "px";


        card.style.transform =
            "translate(-50%,-50%)";


        return;
    }


    // ==================================================
    // DESTINATION COORDINATES
    // ==================================================

    if (
        typeof geoplayDestinationLongitude ===
        "undefined" ||

        typeof geoplayDestinationLatitude ===
        "undefined"
    )
    {
        console.error(
            "GEOPLAY UI: Destination coordinates are missing."
        );

        return;
    }


    var point =
        window.geoplayMap.project(
        [
            geoplayDestinationLongitude,
            geoplayDestinationLatitude
        ]);


    var width =
        mapContainer.clientWidth;


    var height =
        mapContainer.clientHeight;


    var margin =
        45;


    var visible =
        point.x >= margin &&

        point.x <=
            width -
            margin &&

        point.y >= margin &&

        point.y <=
            height -
            margin;


    if (visible)
    {
        window.geoplayDestinationOffscreen =
            false;


        indicator.classList.remove(
            "visible"
        );


        card.classList.add(
            "visible"
        );


        var cardWidth =
            card.offsetWidth;


        var cardHeight =
            card.offsetHeight;


        var left =
            point.x;


        var top;


        var halfWidth =
            cardWidth /
            2;


        if (
            left -
            halfWidth <
            10
        )
        {
            left =
                halfWidth +
                10;
        }


        if (
            left +
            halfWidth >
            width -
            10
        )
        {
            left =
                width -
                halfWidth -
                10;
        }


        if (
            point.y -
            cardHeight -
            52 <
            10
        )
        {
            top =
                point.y +
                18;


            card.style.transform =
                "translate(-50%,0)";
        }
        else
        {
            top =
                point.y -
                52;


            card.style.transform =
                "translate(-50%,-100%)";
        }


        if (
            top <
            10
        )
        {
            top =
                10;
        }


        if (
            top +
            cardHeight >
            height -
            10
        )
        {
            top =
                height -
                cardHeight -
                10;
        }


        card.style.left =
            left +
            "px";


        card.style.top =
            top +
            "px";


        return;
    }


    // ==================================================
    // DESTINATION IS OFF-SCREEN
    // ==================================================

    card.classList.remove(
        "visible"
    );


    if (
        !window.geoplayDestinationIndicatorEnabled
    )
    {
        indicator.classList.remove(
            "visible"
        );


        window.geoplayDestinationOffscreen =
            false;


        return;
    }


    indicator.classList.add(
        "visible"
    );


    window.geoplayDestinationOffscreen =
        true;


    var centerX =
        width /
        2;


    var centerY =
        height /
        2;


    var dx =
        point.x -
        centerX;


    var dy =
        point.y -
        centerY;


    var edgeX =
        centerX;


    var edgeY =
        centerY;


    var padding =
        24;


    if (
        Math.abs(dx) >
        Math.abs(dy)
    )
    {
        edgeX =
            dx > 0
                ?
            width -
            padding
                :
            padding;


        var ratioX =
            dx !== 0
                ?
            (
                edgeX -
                centerX
            ) /
            dx
                :
            1;


        edgeY =
            centerY +
            dy *
            ratioX;
    }
    else
    {
        edgeY =
            dy > 0
                ?
            height -
            padding
                :
            padding;


        var ratioY =
            dy !== 0
                ?
            (
                edgeY -
                centerY
            ) /
            dy
                :
            1;


        edgeX =
            centerX +
            dx *
            ratioY;
    }


    edgeX =
        Math.max(
            60,
            Math.min(
                width -
                60,
                edgeX
            )
        );


    edgeY =
        Math.max(
            40,
            Math.min(
                height -
                40,
                edgeY
            )
        );


    indicator.style.left =
        edgeX +
        "px";


    indicator.style.top =
        edgeY +
        "px";


    var angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI;


    if (
        window.geoplayDestinationOffscreenArrow
    )
    {
        window.geoplayDestinationOffscreenArrow.style.transform =
            "rotate(" +
            angle +
            "deg)";
    }
}


// ==================================================
// HIDE DESTINATION
// ==================================================

function geoplayMapUIHideDestination()
{
    var card =
        document.getElementById(
            "geoplay-destination"
        );


    var indicator =
        document.getElementById(
            "geoplay-destination-offscreen"
        );


    if (card)
    {
        card.classList.remove(
            "visible"
        );

        card.classList.remove(
            "expanded"
        );
    }


    if (indicator)
    {
        indicator.classList.remove(
            "visible"
        );
    }


    if (
        window.geoplayDestinationOverlay
    )
    {
        window.geoplayDestinationOverlay.classList.remove(
            "visible"
        );
    }


    window.geoplayDestinationVisible =
        false;


    window.geoplayDestinationOffscreen =
        false;


    window.geoplayDestinationExpanded =
        false;


    return 1;
}


// ==================================================
// UPDATE POSITIONS
// ==================================================

function geoplayMapUIUpdatePositions()
{
    if (
        window.geoplayDestinationVisible
    )
    {
        geoplayMapUIPositionDestination();
    }
}


// ==================================================
// GO TO DESTINATION
// ==================================================

function geoplayMapUIGoToDestination()
{
    if (
        window.geoplayMapStoryLocked
    )
    {
        console.log(
            "GEOPLAY UI: Destination selection blocked during story."
        );

        return 0;
    }


    if (
        !window.geoplayMap
    )
    {
        return 0;
    }


    if (
        typeof geoplayDestinationLongitude ===
        "undefined" ||

        typeof geoplayDestinationLatitude ===
        "undefined"
    )
    {
        console.error(
            "GEOPLAY UI: Destination coordinates are missing."
        );

        return 0;
    }


    console.log(
        "GEOPLAY UI: Pine Ridge indicator selected."
    );


    var indicator =
        document.getElementById(
            "geoplay-destination-offscreen"
        );


    if (indicator)
    {
        indicator.classList.remove(
            "visible"
        );
    }


    window.geoplayDestinationOffscreen =
        false;


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


    window.geoplayMap.once(
        "moveend",
        function()
        {
            geoplayMapUIShowDestination();


            geoplayMapUISay(
                "There it is!"
            );
        }
    );


    return 1;
}