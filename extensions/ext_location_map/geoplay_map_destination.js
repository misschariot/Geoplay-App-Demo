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
// - geoplay_map.js
// - geoplay_map_ui.js
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
// DESTINATION CONSTANTS
// ==================================================

var geoplayDestinationModalZIndex =
    501;

var geoplayDestinationSceneZIndex =
    110;

var geoplayDestinationOverlayZIndex =
    500;

var geoplayDestinationViewportMargin =
    10;

var geoplayDestinationVisibilityMargin =
    45;

var geoplayDestinationCardGap =
    12;

var geoplayDestinationModalShift =
    "-2vh";


// ==================================================
// CREATE DESTINATION CARD
// ==================================================

function geoplayMapUICreateDestinationCard()
{
    if (
        !window.geoplayMapUI
    )
    {
        console.error(
            "GEOPLAY UI: Map UI container not found."
        );

        return 0;
    }


    // ==================================================
    // CREATE MODAL OVERLAY
    // ==================================================

    var overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "geoplay-destination-overlay";


    overlay.className =
        "geoplay-destination-overlay";


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


    overlay.style.zIndex =
        geoplayDestinationOverlayZIndex;


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


    card.style.position =
        "absolute";


    card.style.zIndex =
        geoplayDestinationSceneZIndex;


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
    // CARD CLICK / TAP
    // ==================================================

    geoplayMapUIDelegateDestinationInteraction(
        card
    );


    console.log(
        "GEOPLAY UI: Pine Ridge destination card created."
    );


    return 1;
}


// ==================================================
// DESTINATION CARD INTERACTION
// ==================================================
//
// Centralizes the click/touch behavior used by the
// collapsed destination card.
//
// ==================================================

function geoplayMapUIDelegateDestinationInteraction(
    card
)
{
    if (
        !card
    )
    {
        return;
    }


    card.addEventListener(
        "click",
        function(event)
        {
            if (
                geoplayMapUIDestinationEventIsInternal(
                    event
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
                window.geoplayDestinationExpanded
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


            geoplayMapUIExpandDestination();
        }
    );


    card.addEventListener(
        "touchend",
        function(event)
        {
            if (
                geoplayMapUIDestinationEventIsInternal(
                    event
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
                window.geoplayDestinationExpanded
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


            geoplayMapUIExpandDestination();
        },
        {
            passive:
                false
        }
    );
}


// ==================================================
// CHECK DESTINATION INTERNAL EVENT
// ==================================================

function geoplayMapUIDestinationEventIsInternal(
    event
)
{
    if (
        !event ||
        !event.target
    )
    {
        return false;
    }


    if (
        event.target.closest(
            ".geoplay-destination-close"
        )
    )
    {
        return true;
    }


    if (
        event.target.closest(
            ".geoplay-destination-play"
        )
    )
    {
        return true;
    }


    return false;
}


// ==================================================
// SET COLLAPSED DESTINATION CONTENT
// ==================================================

function geoplayMapUISetDestinationCollapsed(
    card
)
{
    if (
        !card
    )
    {
        return;
    }


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
    // COLLAPSED CARD IS NORMAL MAP UI
    // ==================================================

    card.style.zIndex =
        geoplayDestinationSceneZIndex;


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
// SET EXPANDED DESTINATION CONTENT
// ==================================================

function geoplayMapUISetDestinationExpanded(
    card
)
{
    if (
        !card
    )
    {
        return;
    }


    card.classList.add(
        "expanded"
    );


    card.classList.remove(
        "modal-closing"
    );


    // ==================================================
    // EXPANDED CARD IS A MODAL
    // ==================================================

    card.style.zIndex =
        geoplayDestinationModalZIndex;


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
    // ATTACH EXPANDED CARD CONTROLS
    // ==================================================

    geoplayMapUIAttachDestinationClose(
        card
    );


    geoplayMapUIAttachDestinationPlay(
        card
    );
}


// ==================================================
// ATTACH CLOSE BUTTON
// ==================================================

function geoplayMapUIAttachDestinationClose(
    card
)
{
    var closeButton =
        card.querySelector(
            ".geoplay-destination-close"
        );


    if (
        !closeButton
    )
    {
        return;
    }


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
// ATTACH PLAY HERE BUTTON
// ==================================================

function geoplayMapUIAttachDestinationPlay(
    card
)
{
    var playButton =
        card.querySelector(
            ".geoplay-destination-play"
        );


    if (
        !playButton
    )
    {
        return;
    }


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


// ==================================================
// EXPAND DESTINATION
// ==================================================

function geoplayMapUIExpandDestination()
{
    var card =
        window.geoplayDestinationCard;


    if (
        !card
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
        card
    );


    // ==================================================
    // OPEN SHARED MODAL
    // ==================================================

    geoplayMapUIOpenModal(
        window.geoplayDestinationOverlay,
        card
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
    var card =
        window.geoplayDestinationCard;


    if (
        !card
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
    // BEGIN MODAL CLOSE
    // ==================================================

    window.geoplayDestinationClosing =
        true;


    geoplayMapUICloseModal(
        window.geoplayDestinationOverlay,
        card,
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
            // RETURN TO COLLAPSED CONTENT
            // ==================================================

            geoplayMapUISetDestinationCollapsed(
                window.geoplayDestinationCard
            );


            // ==================================================
            // CLEAR MODAL POSITIONING
            // ==================================================

            window.geoplayDestinationCard.style.left =
                "";

            window.geoplayDestinationCard.style.top =
                "";

            window.geoplayDestinationCard.style.transform =
                "";


            // ==================================================
            // RETURN TO NORMAL MAP LAYER
            // ==================================================
            //
            // SEARCH must be able to appear above the
            // destination card when its modal opens.
            //
            // ==================================================

            window.geoplayDestinationCard.style.zIndex =
                geoplayDestinationSceneZIndex;


            // ==================================================
            // RETURN CARD TO MAP POSITION
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
// Future functionality will connect this action
// to the selected property's gameplay experience.
//
// For now, the popup remains open.
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


    return 1;
}


// ==================================================
// CREATE OFF-SCREEN INDICATOR
// ==================================================

function geoplayMapUICreateOffscreenIndicator()
{
    if (
        !window.geoplayMapUI
    )
    {
        return 0;
    }


    var indicator =
        document.createElement(
            "div"
        );


    indicator.id =
        "geoplay-destination-offscreen";


    indicator.className =
        "geoplay-destination-offscreen";


    // ==================================================
    // DIRECTION ARROW
    // ==================================================

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


    // ==================================================
    // DESTINATION NAME
    // ==================================================

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


    // ==================================================
    // INDICATOR CLICK / TOUCH
    // ==================================================

    geoplayMapUIAttachOffscreenIndicatorInteraction(
        indicator
    );


    return 1;
}


// ==================================================
// OFF-SCREEN INDICATOR INTERACTION
// ==================================================

function geoplayMapUIAttachOffscreenIndicatorInteraction(
    indicator
)
{
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


    if (
        !card
    )
    {
        return 0;
    }


    window.geoplayDestinationVisible =
        true;


    geoplayMapUISetDestinationCollapsed(
        card
    );


    // ==================================================
    // COLLAPSED CARD IS NORMAL MAP UI
    // ==================================================

    card.style.zIndex =
        geoplayDestinationSceneZIndex;


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
        geoplayMapUIPositionExpandedDestination(
            card,
            indicator,
            mapContainer
        );

        return;
    }


    // ==================================================
    // NORMAL COLLAPSED DESTINATION
    // ==================================================

    card.style.zIndex =
        geoplayDestinationSceneZIndex;


    // ==================================================
    // VERIFY DESTINATION COORDINATES
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


    // ==================================================
    // PROJECT DESTINATION TO SCREEN
    // ==================================================

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
        geoplayDestinationVisibilityMargin;


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

    if (
        visible
    )
    {
        geoplayMapUIPositionVisibleDestination(
            card,
            indicator,
            point,
            width,
            height
        );

        return;
    }


    // ==================================================
    // DESTINATION OFF-SCREEN
    // ==================================================

    geoplayMapUIPositionOffscreenDestination(
        card,
        indicator,
        point,
        width,
        height
    );
}


// ==================================================
// POSITION EXPANDED DESTINATION
// ==================================================

function geoplayMapUIPositionExpandedDestination(
    card,
    indicator,
    mapContainer
)
{
    indicator.classList.remove(
        "visible"
    );


    window.geoplayDestinationOffscreen =
        false;


    card.style.zIndex =
        geoplayDestinationModalZIndex;


    if (
        typeof geoplayMapUICenterModal ===
        "function"
    )
    {
        geoplayMapUICenterModal(
            card
        );

        return;
    }


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


// ==================================================
// POSITION VISIBLE DESTINATION
// ==================================================

function geoplayMapUIPositionVisibleDestination(
    card,
    indicator,
    point,
    width,
    height
)
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


    // ==================================================
    // KEEP CARD HORIZONTALLY INSIDE VIEWPORT
    // ==================================================

    if (
        left -
        halfWidth <
        geoplayDestinationViewportMargin
    )
    {
        left =
            halfWidth +
            geoplayDestinationViewportMargin;
    }


    if (
        left +
        halfWidth >
        width -
        geoplayDestinationViewportMargin
    )
    {
        left =
            width -
            halfWidth -
            geoplayDestinationViewportMargin;
    }


    // ==================================================
    // CHOOSE ABOVE / BELOW DESTINATION
    // ==================================================

    if (
        point.y -
        cardHeight -
        geoplayDestinationCardGap <
        geoplayDestinationViewportMargin
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
            geoplayDestinationCardGap;


        card.style.transform =
            "translate(-50%,-100%)";
    }


    // ==================================================
    // KEEP CARD VERTICALLY INSIDE VIEWPORT
    // ==================================================

    if (
        top <
        geoplayDestinationViewportMargin
    )
    {
        top =
            geoplayDestinationViewportMargin;
    }


    if (
        top +
        cardHeight >
        height -
        geoplayDestinationViewportMargin
    )
    {
        top =
            height -
            cardHeight -
            geoplayDestinationViewportMargin;
    }


    card.style.left =
        left +
        "px";


    card.style.top =
        top +
        "px";
}


// ==================================================
// POSITION OFF-SCREEN DESTINATION
// ==================================================

function geoplayMapUIPositionOffscreenDestination(
    card,
    indicator,
    point,
    width,
    height
)
{
    card.classList.remove(
        "visible"
    );


    // ==================================================
    // INDICATOR REMAINS HIDDEN UNTIL STORY FINISHES
    // ==================================================

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


    // ==================================================
    // CALCULATE SCREEN CENTER
    // ==================================================

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


    // ==================================================
    // FIND SCREEN EDGE
    // ==================================================

    var edge =
        geoplayMapUICalculateDestinationEdge(
            centerX,
            centerY,
            dx,
            dy,
            width,
            height
        );


    indicator.style.left =
        edge.x +
        "px";


    indicator.style.top =
        edge.y +
        "px";


    // ==================================================
    // ROTATE ARROW TOWARD DESTINATION
    // ==================================================

    var angle =
        Math.atan2(
            dy,
            dx
        )
        *
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
// CALCULATE OFF-SCREEN EDGE
// ==================================================

function geoplayMapUICalculateDestinationEdge(
    centerX,
    centerY,
    dx,
    dy,
    width,
    height
)
{
    var edgeX =
        centerX;


    var edgeY =
        centerY;


    var padding =
        24;


    // ==================================================
    // HORIZONTAL EDGE
    // ==================================================

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


    // ==================================================
    // VERTICAL EDGE
    // ==================================================

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


    // ==================================================
    // KEEP INDICATOR INSIDE SAFE AREA
    // ==================================================

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


    return {
        x:
            edgeX,

        y:
            edgeY
    };
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


    // ==================================================
    // RESET CARD
    // ==================================================

    if (
        card
    )
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


        card.style.zIndex =
            geoplayDestinationSceneZIndex;
    }


    // ==================================================
    // RESET INDICATOR
    // ==================================================

    if (
        indicator
    )
    {
        indicator.classList.remove(
            "visible"
        );
    }


    // ==================================================
    // RESET MODAL OVERLAY
    // ==================================================

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


    // ==================================================
    // RESET STATE
    // ==================================================

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
//
// Called whenever the MapLibre camera moves.
//
// This keeps the collapsed destination card and
// off-screen indicator synchronized with the map.
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


    if (
        indicator
    )
    {
        indicator.classList.remove(
            "visible"
        );
    }


    window.geoplayDestinationOffscreen =
        false;


    // ==================================================
    // MOVE CAMERA TO DESTINATION
    // ==================================================

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


    // ==================================================
    // SHOW DESTINATION AFTER CAMERA ARRIVES
    // ==================================================

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


// ==================================================
// END GEOPLAY MAP DESTINATION
// ==================================================