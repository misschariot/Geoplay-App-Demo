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
// - geoplay_map_modal.js
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

window.geoplayDestinationClosing =
    false;


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


    // ==================================================
    // SHARED MODAL BACKDROP SETUP
    // ==================================================

    overlay.style.position =
        "absolute";


    overlay.style.left =
        "0";


    overlay.style.top =
        "0";


    overlay.style.width =
        "100%";


    overlay.style.height =
        "100%";


    overlay.style.background =
        "rgba(5,2,18,.42)";


    overlay.style.opacity =
        "0";


    overlay.style.visibility =
        "hidden";


    overlay.style.pointerEvents =
        "none";


    // ==================================================
    // MODAL BACKDROP LAYER
    // ==================================================
    //
    // The backdrop sits above the normal map UI.
    //
    // Normal destination card:
    //     z-index 110
    //
    // Modal backdrop:
    //     z-index 500
    //
    // Expanded destination card:
    //     z-index 501
    //
    // ==================================================

    overlay.style.zIndex =
        "500";


    overlay.style.transition =
        "opacity 300ms ease, visibility 300ms ease";


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


    // ==================================================
    // IMPORTANT:
    // DESTINATION CARD IS NORMAL MAP UI BY DEFAULT.
    //
    // It must stay BELOW a modal backdrop until the
    // player actually opens the Pine Ridge modal.
    //
    // ==================================================

    card.style.position =
        "absolute";


    card.style.zIndex =
        "110";


    geoplayMapUISetDestinationCollapsed(
        card
    );


    window.geoplayMapUI.appendChild(
        card
    );


    window.geoplayDestinationCard =
        card;


    // ==================================================
    // PROTECT MODAL FROM MAP INPUT
    // ==================================================

    if (
        typeof geoplayMapUIProtectModalPanel ===
        "function"
    )
    {
        geoplayMapUIProtectModalPanel(
            overlay,
            card
        );
    }


    // ==================================================
    // DESTINATION CARD CLICK
    // ==================================================

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
                !window.geoplayDestinationExpanded &&
                !window.geoplayDestinationClosing
            )
            {
                geoplayMapUIExpandDestination();
            }
        }
    );


    // ==================================================
    // DESTINATION CARD TOUCH
    // ==================================================

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


            if (
                window.geoplayDestinationClosing
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


    card.classList.remove(
        "modal-closing"
    );


    card.classList.remove(
        "visible"
    );


    // ==================================================
    // IMPORTANT:
    // COLLAPSED DESTINATION IS NORMAL MAP UI.
    //
    // ==================================================

    card.style.zIndex =
        "110";


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


    card.classList.remove(
        "modal-closing"
    );


    // ==================================================
    // IMPORTANT:
    // EXPANDED DESTINATION IS A MODAL.
    //
    // It must sit above the backdrop.
    //
    // ==================================================

    card.style.zIndex =
        "501";


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

        "</button>";


    window.geoplayDestinationExpanded =
        true;


    // ==================================================
    // CLOSE BUTTON
    // ==================================================

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


    // ==================================================
    // PLAY HERE BUTTON
    // ==================================================

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


    if (
        window.geoplayDestinationClosing
    )
    {
        return 0;
    }


    if (
        typeof geoplayMapUIOpenModal !==
        "function"
    )
    {
        console.error(
            "GEOPLAY UI: Shared modal system is unavailable."
        );

        return 0;
    }


    // ==================================================
    // SET EXPANDED CONTENT
    // ==================================================

    geoplayMapUISetDestinationExpanded(
        window.geoplayDestinationCard
    );


    // ==================================================
    // OPEN USING SHARED GEOPLAY MODAL SYSTEM
    // ==================================================

    geoplayMapUIOpenModal(
        window.geoplayDestinationOverlay,
        window.geoplayDestinationCard
    );


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


    if (
        window.geoplayDestinationClosing
    )
    {
        return 0;
    }


    if (
        typeof geoplayMapUICloseModal !==
        "function"
    )
    {
        console.error(
            "GEOPLAY UI: Shared modal system is unavailable."
        );

        return 0;
    }


    // ==================================================
    // BEGIN SHARED MODAL CLOSE
    // ==================================================

    window.geoplayDestinationClosing =
        true;


    geoplayMapUICloseModal(
        window.geoplayDestinationOverlay,
        window.geoplayDestinationCard,
        function()
        {
            if (
                !window.geoplayDestinationCard
            )
            {
                window.geoplayDestinationClosing =
                    false;

                return;
            }


            // ==================================================
            // RETURN CARD TO COLLAPSED STATE
            // ==================================================

            geoplayMapUISetDestinationCollapsed(
                window.geoplayDestinationCard
            );


            window.geoplayDestinationCard.style.left =
                "";


            window.geoplayDestinationCard.style.top =
                "";


            window.geoplayDestinationCard.style.transform =
                "";


            // ==================================================
            // IMPORTANT:
            // RETURN TO NORMAL MAP UI LAYER.
            //
            // This is what allows SEARCH to sit above
            // Pine Ridge when SEARCH is opened.
            //
            // ==================================================

            window.geoplayDestinationCard.style.zIndex =
                "110";


            // ==================================================
            // RETURN DESTINATION TO MAP POSITION
            // ==================================================

            geoplayMapUIPositionDestination();


            window.geoplayDestinationClosing =
                false;


            console.log(
                "GEOPLAY UI: Pine Ridge information card collapsed."
            );
        }
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


    geoplayMapUISetDestinationCollapsed(
        card
    );


    // ==================================================
    // IMPORTANT:
    // COLLAPSED DESTINATION RETURNS TO NORMAL MAP UI.
    // ==================================================

    card.style.zIndex =
        "110";


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
    // EXPANDED DESTINATION
    // ==================================================
    //
    // Expanded Pine Ridge is a shared Geoplay modal.
    //
    // ==================================================

    if (
        window.geoplayDestinationExpanded
    )
    {
        indicator.classList.remove(
            "visible"
        );


        window.geoplayDestinationOffscreen =
            false;


        // ==================================================
        // MODAL POPUP MUST SIT ABOVE BACKDROP.
        // ==================================================

        card.style.zIndex =
            "501";


        if (
            typeof geoplayMapUICenterModal ===
            "function"
        )
        {
            geoplayMapUICenterModal(
                card
            );
        }
        else
        {
            card.style.left =
                (
                    mapContainer.clientWidth /
                    2
                ) +
                "px";


            card.style.top =
                (
                    mapContainer.clientHeight /
                    2
                ) +
                "px";
        }


        return;
    }


    // ==================================================
    // NORMAL COLLAPSED DESTINATION
    // ==================================================
    //
    // This card belongs to the map scene and must remain
    // below any modal backdrop.
    //
    // ==================================================

    card.style.zIndex =
        "110";


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


    // ==================================================
    // DESTINATION VISIBLE ON MAP
    // ==================================================

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


        card.classList.remove(
            "modal-closing"
        );


        card.style.transform =
            "";


        card.style.left =
            "";


        card.style.top =
            "";


        // ==================================================
        // HIDDEN DESTINATION RETURNS TO NORMAL MAP LAYER.
        // ==================================================

        card.style.zIndex =
            "110";
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


        window.geoplayDestinationOverlay.style.opacity =
            "0";


        window.geoplayDestinationOverlay.style.visibility =
            "hidden";


        window.geoplayDestinationOverlay.style.pointerEvents =
            "none";
    }


    window.geoplayDestinationVisible =
        false;


    window.geoplayDestinationOffscreen =
        false;


    window.geoplayDestinationExpanded =
        false;


    window.geoplayDestinationClosing =
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