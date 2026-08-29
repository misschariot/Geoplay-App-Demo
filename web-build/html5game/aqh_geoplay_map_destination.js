// ==================================================
// GEOPLAY MAP DESTINATION
// PINE RIDGE CASINO DESTINATION SYSTEM
// ==================================================
//
// RESPONSIBILITY:
// - Pine Ridge destination callout
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
// DESTINATION NAME
// ==================================================

function geoplayMapUIDestinationName()
{
    if (
        window.geoplayDestinationName
    )
    {
        return window.geoplayDestinationName;
    }

    return "Pine Ridge Casino";
}


// ==================================================
// DESTINATION DISTANCE
// ==================================================

function geoplayMapUIDestinationDistance()
{
    var distance =
        window.geoplayDestinationDistanceMiles;

    if (
        typeof distance !==
        "number" ||

        !isFinite(distance) ||

        distance <= 0
    )
    {
        return "";
    }

    return distance.toFixed(1) +
        " MI AWAY";
}


// ==================================================
// DESTINATION DISTANCE IS READY
// ==================================================

function geoplayMapUIDestinationDistanceReady()
{
    var distance =
        window.geoplayDestinationDistanceMiles;

    return (
        typeof distance ===
        "number" &&

        isFinite(distance) &&

        distance > 0
    );
}


// ==================================================
// REFRESH DESTINATION DISTANCE
// ==================================================

function geoplayMapUIRefreshDestinationDistance()
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
        !geoplayMapUIDestinationDistanceReady()
    )
    {
        return 0;
    }

    console.log(
        "GEOPLAY UI: Destination distance is ready."
    );


    if (
        !window.geoplayDestinationExpanded
    )
    {
        geoplayMapUISetDestinationCollapsed(
            card
        );

        if (
            window.geoplayDestinationVisible
        )
        {
            geoplayMapUIPositionDestination();
        }

        return 1;
    }


    geoplayMapUISetDestinationExpanded(
        card
    );


    if (
        typeof geoplayMapUICenterModal ===
        "function"
    )
    {
        geoplayMapUICenterModal(
            card
        );
    }

    return 1;
}


// ==================================================
// DESTINATION CALLOUT STYLES
// ==================================================

function geoplayMapUIDestinationEnsureStyles()
{
    if (
        document.getElementById(
            "geoplay-destination-card-styles"
        )
    )
    {
        return;
    }


    var style =
        document.createElement(
            "style"
        );


    style.id =
        "geoplay-destination-card-styles";


    style.textContent =

        // ==================================================
        // BASE DESTINATION CALLOUT
        // ==================================================

        ".geoplay-destination {" +

            "box-sizing: border-box;" +

            "width: 214px;" +

            "max-width: calc(100vw - 32px);" +

            "border-radius: 14px;" +

            "position: absolute;" +

            "overflow: visible;" +

            "background: linear-gradient(rgba(14,9,39,0.97), rgba(14,9,39,0.97)) padding-box, linear-gradient(90deg, #8b3dff 0%, #d52cff 48%, #ff9d00 100%) border-box;" +

            "border: 1.5px solid transparent;" +

            "box-shadow: 0 7px 20px rgba(0,0,0,0.32), 0 0 15px rgba(151,65,255,0.18), 0 0 22px rgba(255,132,0,0.07);" +

            "backdrop-filter: blur(10px);" +

            "-webkit-backdrop-filter: blur(10px);" +

            "color: rgba(255,255,255,0.98);" +

            "cursor: pointer;" +

        "}" +


        // ==================================================
        // CALLOUT POINTER
        // ==================================================

        ".geoplay-destination:not(.expanded)::after {" +

            "content: '';" +

            "position: absolute;" +

            "left: 50%;" +

            "bottom: -7px;" +

            "width: 12px;" +

            "height: 12px;" +

            "transform: translateX(-50%) rotate(45deg);" +

            "background: #100a2b;" +

            "border-right: 1.5px solid #ff8f18;" +

            "border-bottom: 1.5px solid #d52cff;" +

            "box-sizing: border-box;" +

            "z-index: -1;" +

        "}" +


        // ==================================================
        // CALLOUT CONTENT
        // ==================================================

        ".geoplay-destination-collapsed {" +

            "min-height: 44px;" +

            "padding: 6px 10px 6px 11px;" +

            "box-sizing: border-box;" +

            "display: flex;" +

            "flex-direction: column;" +

            "justify-content: center;" +

            "gap: 1px;" +

            "position: relative;" +

            "z-index: 1;" +

        "}" +


        // ==================================================
        // TOP ROW
        // ==================================================

        ".geoplay-destination-collapsed-main {" +

            "min-width: 0;" +

            "width: 100%;" +

            "display: flex;" +

            "align-items: center;" +

            "gap: 6px;" +

            "box-sizing: border-box;" +

        "}" +


        // ==================================================
        // PIN ICON
        // ==================================================

        ".geoplay-destination-pin {" +

            "width: 16px;" +

            "height: 16px;" +

            "flex-shrink: 0;" +

            "display: flex;" +

            "align-items: center;" +

            "justify-content: center;" +

            "font-family: Arial, sans-serif;" +

            "font-size: 12px;" +

            "line-height: 1;" +

        "}" +


        // ==================================================
        // CASINO NAME
        // ==================================================

        ".geoplay-destination-title {" +

            "display: block;" +

            "min-width: 0;" +

            "flex: 1;" +

            "font-family: Arial, sans-serif;" +

            "font-size: 11px;" +

            "font-weight: 700;" +

            "letter-spacing: 0.5px;" +

            "line-height: 1.15;" +

            "color: rgba(255,255,255,0.98);" +

            "white-space: nowrap;" +

            "overflow: hidden;" +

            "text-overflow: ellipsis;" +

        "}" +


        // ==================================================
        // SECOND ROW
        // ==================================================

        ".geoplay-destination-bottom-row {" +

            "display: flex;" +

            "align-items: center;" +

            "justify-content: space-between;" +

            "width: 100%;" +

            "min-height: 14px;" +

            "padding-left: 22px;" +

            "box-sizing: border-box;" +

        "}" +


        // ==================================================
        // DISTANCE
        // ==================================================

        ".geoplay-destination-info {" +

            "display: block;" +

            "font-family: Arial, sans-serif;" +

            "font-size: 8.8px;" +

            "font-weight: 700;" +

            "letter-spacing: 0.5px;" +

            "line-height: 1;" +

            "color: rgba(207,229,255,0.88);" +

            "white-space: nowrap;" +

        "}" +


        // ==================================================
        // CHEVRON
        // ==================================================

        ".geoplay-destination-chevron {" +

            "width: auto;" +

            "height: auto;" +

            "margin-left: 8px;" +

            "display: flex;" +

            "align-items: center;" +

            "justify-content: center;" +

            "flex-shrink: 0;" +

            "background: transparent;" +

            "border: 0;" +

            "color: rgba(255,255,255,0.95);" +

            "font-family: Arial, sans-serif;" +

            "font-size: 18px;" +

            "font-weight: 400;" +

            "line-height: 1;" +

            "padding: 0 0 1px 0;" +

            "box-sizing: border-box;" +

        "}" +


        // ==================================================
        // SUBTLE HOVER
        // ==================================================

        ".geoplay-destination:not(.expanded):hover {" +

            "box-shadow: 0 8px 22px rgba(0,0,0,0.35), 0 0 18px rgba(151,65,255,0.24), 0 0 24px rgba(255,132,0,0.10);" +

        "}" +


        // ==================================================
        // MOBILE
        // ==================================================

        "@media (max-width: 480px) {" +

            ".geoplay-destination {" +

                "width: 204px;" +

                "max-width: calc(100vw - 28px);" +

                "border-radius: 13px;" +

            "}" +


            ".geoplay-destination-collapsed {" +

                "min-height: 42px;" +

                "padding: 5px 9px 5px 10px;" +

            "}" +


            ".geoplay-destination-collapsed-main {" +

                "gap: 5px;" +

            "}" +


            ".geoplay-destination-pin {" +

                "width: 15px;" +

                "height: 15px;" +

                "font-size: 11px;" +

            "}" +


            ".geoplay-destination-title {" +

                "font-size: 10.8px;" +

                "letter-spacing: 0.45px;" +

            "}" +


            ".geoplay-destination-bottom-row {" +

                "padding-left: 20px;" +

            "}" +


            ".geoplay-destination-info {" +

                "font-size: 8.5px;" +

            "}" +


            ".geoplay-destination-chevron {" +

                "font-size: 17px;" +

                "margin-left: 7px;" +

            "}" +

        "}";


    document.head.appendChild(
        style
    );
}


// ==================================================
// CREATE DESTINATION CALLOUT
// ==================================================

function geoplayMapUICreateDestinationCard()
{
    geoplayMapUIDestinationEnsureStyles();


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
    // CREATE DESTINATION CALLOUT
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
    // CALLOUT CLICK / TAP
    // ==================================================

    geoplayMapUIDelegateDestinationInteraction(
        card
    );


    console.log(
        "GEOPLAY UI: Pine Ridge destination callout created."
    );


    return 1;
}


// ==================================================
// DESTINATION CALLOUT INTERACTION
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
// SET COLLAPSED DESTINATION CALLOUT
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


    card.style.zIndex =
        geoplayDestinationSceneZIndex;


    var destinationName =
        geoplayMapUIDestinationName();


    var destinationDistance =
        geoplayMapUIDestinationDistance();


    var distanceReady =
        geoplayMapUIDestinationDistanceReady();


    // ==================================================
    // DISTANCE ROW
    // ==================================================

    var distanceMarkup =
        "";


    if (
        distanceReady
    )
    {
        distanceMarkup =

            "<div class='geoplay-destination-bottom-row'>" +

                "<span class='geoplay-destination-info'>" +

                    destinationDistance +

                "</span>" +

                "<span class='geoplay-destination-chevron'>" +

                    "›" +

                "</span>" +

            "</div>";
    }


    // ==================================================
    // CALLOUT CONTENT
    // ==================================================

    card.innerHTML =

        "<div class='geoplay-destination-collapsed'>" +

            "<div class='geoplay-destination-collapsed-main'>" +

                "<span class='geoplay-destination-pin'>" +

                    "📍" +

                "</span>" +

                "<span class='geoplay-destination-title'>" +

                    destinationName.toUpperCase() +

                "</span>" +

            "</div>" +

            distanceMarkup +

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


    card.style.zIndex =
        geoplayDestinationModalZIndex;


    var destinationName =
        geoplayMapUIDestinationName();


    var destinationDistance =
        geoplayMapUIDestinationDistance();


    var distanceReady =
        geoplayMapUIDestinationDistanceReady();


    var distanceMarkup =
        "";


    if (
        distanceReady
    )
    {
        distanceMarkup =

            "<div class='geoplay-destination-expanded-distance'>" +

                "<span class='geoplay-destination-distance-icon'>" +

                    "➜" +

                "</span>" +

                "<span>" +

                    destinationDistance +

                "</span>" +

            "</div>";
    }


    card.innerHTML =

        "<div class='geoplay-destination-expanded-header'>" +

            "<span class='geoplay-destination-expanded-title'>" +

                destinationName.toUpperCase() +

            "</span>" +

            "<button " +

                "type='button' " +

                "class='geoplay-destination-close' " +

                "aria-label='Close " +

                    destinationName +

                    " information'>" +

                "×" +

            "</button>" +

        "</div>" +


        "<img " +

            "class='geoplay-destination-image' " +

            "src='https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine_ridge_casino_image.png' " +

            "alt='" +

                destinationName +

            "' " +

            "draggable='false'>" +


        "<div class='geoplay-destination-expanded-divider'></div>" +


        "<div class='geoplay-destination-expanded-details'>" +

            distanceMarkup +


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


    geoplayMapUISetDestinationExpanded(
        card
    );


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


            geoplayMapUISetDestinationCollapsed(
                window.geoplayDestinationCard
            );


            window.geoplayDestinationCard.style.left =
                "";

            window.geoplayDestinationCard.style.top =
                "";

            window.geoplayDestinationCard.style.transform =
                "";


            window.geoplayDestinationCard.style.zIndex =
                geoplayDestinationSceneZIndex;


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
        geoplayMapUIDestinationName()
            .toUpperCase()
            .replace(
                " CASINO",
                ""
            );


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


    card.style.zIndex =
        geoplayDestinationSceneZIndex;


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
    // KEEP CALLOUT HORIZONTALLY INSIDE VIEWPORT
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
    // POSITION ABOVE DESTINATION
    // ==================================================

    top =
        point.y -
        geoplayDestinationCardGap;


    card.style.transform =
        "translate(-50%,-100%)";


    // ==================================================
    // IF TOO CLOSE TO TOP, PLACE BELOW
    // ==================================================

    if (
        top <
        geoplayDestinationViewportMargin
    )
    {
        top =
            point.y +
            geoplayDestinationCardGap +
            18;


        card.style.transform =
            "translate(-50%,0)";
    }


    // ==================================================
    // KEEP CALLOUT VERTICALLY INSIDE VIEWPORT
    // ==================================================

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


    if (
        indicator
    )
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


// ==================================================
// END GEOPLAY MAP DESTINATION
// ==================================================