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

window.geoplayDestinationFinalPresentation =
    false;

window.geoplayDestinationControlledTransition =
    false;

window.geoplayDestinationMapListenersAttached =
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

var geoplayDestinationMarkerGap =
    16;

var geoplayDestinationSideGap =
    18;

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

            "width: 218px;" +

            "max-width: calc(100vw - 20px);" +

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

            "--geoplay-pointer-left: 50%;" +

            "--geoplay-pointer-top: 50%;" +

        "}" +


        // ==================================================
        // DEFAULT POINTER
        // ==================================================

        ".geoplay-destination:not(.expanded)::after {" +

            "content: '';" +

            "position: absolute;" +

            "width: 12px;" +

            "height: 12px;" +

            "box-sizing: border-box;" +

            "background: #100a2b;" +

            "z-index: -1;" +

        "}" +


        // ==================================================
        // POINTER - CARD ABOVE MARKER
        // ==================================================

        ".geoplay-destination[data-pointer-side='top']::after {" +

            "left: var(--geoplay-pointer-left);" +

            "bottom: -7px;" +

            "transform: translateX(-50%) rotate(45deg);" +

            "border-right: 1.5px solid #ff8f18;" +

            "border-bottom: 1.5px solid #d52cff;" +

        "}" +


        // ==================================================
        // POINTER - CARD BELOW MARKER
        // ==================================================

        ".geoplay-destination[data-pointer-side='bottom']::after {" +

            "left: var(--geoplay-pointer-left);" +

            "top: -7px;" +

            "transform: translateX(-50%) rotate(45deg);" +

            "border-left: 1.5px solid #8b3dff;" +

            "border-top: 1.5px solid #d52cff;" +

        "}" +


        // ==================================================
        // POINTER - CARD LEFT OF MARKER
        // ==================================================

        ".geoplay-destination[data-pointer-side='left']::after {" +

            "right: -7px;" +

            "top: var(--geoplay-pointer-top);" +

            "transform: translateY(-50%) rotate(45deg);" +

            "border-top: 1.5px solid #d52cff;" +

            "border-right: 1.5px solid #ff8f18;" +

        "}" +


        // ==================================================
        // POINTER - CARD RIGHT OF MARKER
        // ==================================================

        ".geoplay-destination[data-pointer-side='right']::after {" +

            "left: -7px;" +

            "top: var(--geoplay-pointer-top);" +

            "transform: translateY(-50%) rotate(45deg);" +

            "border-left: 1.5px solid #8b3dff;" +

            "border-bottom: 1.5px solid #d52cff;" +

        "}" +


        // ==================================================
        // CALLOUT CONTENT
        // ==================================================

        ".geoplay-destination-collapsed {" +

            "min-height: 40px;" +

            "padding: 4px 8px 4px 10px;" +

            "box-sizing: border-box;" +

            "display: flex;" +

            "flex-direction: column;" +

            "justify-content: center;" +

            "gap: 0;" +

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

            "gap: 5px;" +

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

            "padding-right: 4px;" +

            "font-family: Arial, sans-serif;" +

            "font-size: 11px;" +

            "font-weight: 700;" +

            "letter-spacing: 0.5px;" +

            "line-height: 1.15;" +

            "color: rgba(255,255,255,0.98);" +

            "white-space: nowrap;" +

            "overflow: visible;" +

            "text-overflow: clip;" +

        "}" +


        // ==================================================
        // SECOND ROW
        // ==================================================

        ".geoplay-destination-bottom-row {" +

            "display: flex;" +

            "align-items: center;" +

            "justify-content: flex-start;" +

            "width: 100%;" +

            "min-height: 13px;" +

            "padding-left: 31px;" +

            "padding-right: 0;" +

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

            "position: absolute;" +

            "right: 13px;" +

            "top: 50%;" +

            "width: auto;" +

            "height: auto;" +

            "margin: 0;" +

            "display: block;" +

            "background: transparent !important;" +

            "background-image: none !important;" +

            "border: 0 !important;" +

            "border-radius: 0 !important;" +

            "outline: 0 !important;" +

            "box-shadow: none !important;" +

            "color: rgba(255,255,255,0.95);" +

            "font-family: Arial, sans-serif;" +

            "font-size: 18px;" +

            "font-weight: 400;" +

            "line-height: 1;" +

            "padding: 0;" +

            "transform: translateY(-50%);" +

            "box-sizing: content-box;" +

            "appearance: none;" +

            "-webkit-appearance: none;" +

            "text-decoration: none;" +

            "text-shadow: none;" +

            "filter: none;" +

            "pointer-events: none;" +

            "transition: none !important;" +

            "animation: none !important;" +

        "}" +


        // ==================================================
        // CHEVRON - NO HOVER / FOCUS / ACTIVE EFFECT
        // ==================================================

        ".geoplay-destination:hover .geoplay-destination-chevron," +

        ".geoplay-destination-chevron:hover," +

        ".geoplay-destination-chevron:focus," +

        ".geoplay-destination-chevron:focus-visible," +

        ".geoplay-destination-chevron:active {" +

            "color: rgba(255,255,255,0.95) !important;" +

            "background: transparent !important;" +

            "background-image: none !important;" +

            "border: 0 !important;" +

            "border-radius: 0 !important;" +

            "outline: 0 !important;" +

            "box-shadow: none !important;" +

            "filter: none !important;" +

            "opacity: 1 !important;" +

            "transform: translateY(-50%) !important;" +

            "transition: none !important;" +

            "animation: none !important;" +

        "}" +


        // ==================================================
        // MOBILE
        // ==================================================

        "@media (max-width: 480px) {" +

            ".geoplay-destination {" +

                "width: 202px;" +

                "max-width: calc(100vw - 20px);" +

                "border-radius: 13px;" +

            "}" +


            ".geoplay-destination-collapsed {" +

                "min-height: 38px;" +

                "padding: 4px 8px 4px 9px;" +

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

                "padding-right: 4px;" +

            "}" +


            ".geoplay-destination-bottom-row {" +

                "padding-left: 29px;" +

                "padding-right: 0;" +

            "}" +


            ".geoplay-destination-info {" +

                "font-size: 8.5px;" +

            "}" +


            ".geoplay-destination-chevron {" +

                "right: 11px;" +

                "font-size: 17px;" +

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


    card.setAttribute(
        "data-pointer-side",
        "bottom"
    );


    geoplayMapUISetDestinationCollapsed(
        card
    );


    window.geoplayMapUI.appendChild(
        card
    );


    window.geoplayDestinationCard =
        card;


    // ==================================================
    // ATTACH MAP POSITION LISTENERS
    // ==================================================

    geoplayMapUIAttachDestinationMapListeners();


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

            "<span class='geoplay-destination-chevron'>" +

                "›" +

            "</span>" +

        "</div>";


    // ==================================================
    // DEFAULT POINTER STATE
    // ==================================================

    if (
        !card.getAttribute(
            "data-pointer-side"
        )
    )
    {
        card.setAttribute(
            "data-pointer-side",
            "top"
        );
    }


    card.style.setProperty(
        "--geoplay-pointer-left",
        "50%"
    );


    card.style.setProperty(
        "--geoplay-pointer-top",
        "50%"
    );


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
// ATTACH DESTINATION MAP LISTENERS
// ==================================================

function geoplayMapUIAttachDestinationMapListeners()
{
    if (
        window.geoplayDestinationMapListenersAttached
    )
    {
        return;
    }


    if (
        !window.geoplayMap ||
        typeof window.geoplayMap.on !==
        "function"
    )
    {
        return;
    }


    window.geoplayDestinationMapListenersAttached =
        true;


    window.geoplayMap.on(
        "movestart",
        function()
        {
            if (
                window.geoplayDestinationControlledTransition
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


            window.geoplayDestinationFinalPresentation =
                false;
        }
    );


    window.geoplayMap.on(
        "move",
        function()
        {
            if (
                !window.geoplayDestinationVisible
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
                window.geoplayDestinationControlledTransition
            )
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
                }


                if (
                    indicator
                )
                {
                    indicator.classList.remove(
                        "visible"
                    );
                }


                return;
            }


            geoplayMapUIPositionDestination();
        }
    );


    window.geoplayMap.on(
        "moveend",
        function()
        {
            if (
                window.geoplayDestinationControlledTransition
            )
            {
                window.geoplayDestinationControlledTransition =
                    false;


                geoplayMapUIShowDestination();


                // "There it is!" removed.
                // The casino card now appears silently
                // when the camera reaches the destination.


                return;
            }


            if (
                window.geoplayDestinationVisible &&
                !window.geoplayDestinationExpanded
            )
            {
                geoplayMapUIPositionDestination();
            }
        }
    );


    window.geoplayMap.on(
        "resize",
        function()
        {
            if (
                window.geoplayDestinationVisible &&
                !window.geoplayDestinationExpanded
            )
            {
                geoplayMapUIPositionDestination();
            }
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


    // ==================================================
    // FINAL DESTINATION PRESENTATION
    // ==================================================

    window.geoplayDestinationFinalPresentation =
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


    // ==================================================
    // CONTROLLED CAMERA TRANSITION
    // ==================================================

    if (
        window.geoplayDestinationControlledTransition
    )
    {
        card.classList.remove(
            "visible"
        );


        indicator.classList.remove(
            "visible"
        );


        return;
    }


    // ==================================================
    // FINAL DESTINATION PRESENTATION
    // ==================================================

    if (
        window.geoplayDestinationFinalPresentation
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
    // ==================================================
    // SIMPLE DESTINATION RULE
    // ==================================================
    // The casino card has ONE permanent home:
    // directly above the casino marker.
    //
    // If the marker is not in view, OR there is not
    // enough room for the complete card above it,
    // use the separate off-screen indicator instead.
    //
    // The card never moves to the sides or below the
    // marker.
    // ==================================================

    var cardWidth =
        card.offsetWidth;

    var cardHeight =
        card.offsetHeight;

    var margin =
        geoplayDestinationViewportMargin;

    var markerGap =
        geoplayDestinationMarkerGap;

    // ==================================================
    // REQUIRED VISIBLE AREA
    // ==================================================

    var cardLeft =
        point.x -
        (
            cardWidth /
            2
        );

    var cardTop =
        point.y -
        markerGap -
        cardHeight;

    var cardRight =
        cardLeft +
        cardWidth;

    var cardBottom =
        cardTop +
        cardHeight;

    // ==================================================
    // CARD MUST FIT COMPLETELY IN VIEW
    // ==================================================

    var cardFitsViewport =
        cardLeft >= margin &&
        cardRight <=
            width -
            margin &&
        cardTop >= margin &&
        cardBottom <=
            height -
            margin;

    // ==================================================
    // IF CARD CANNOT FIT ABOVE MARKER:
    // SHOW THE SEPARATE OFF-SCREEN INDICATOR.
    // ==================================================

    if (
        !cardFitsViewport
    )
    {
        card.classList.remove(
            "visible"
        );

        if (
            window.geoplayDestinationIndicatorEnabled
        )
        {
            geoplayMapUIPositionOffscreenDestination(
                card,
                indicator,
                point,
                width,
                height
            );
        }
        else
        {
            indicator.classList.remove(
                "visible"
            );

            window.geoplayDestinationOffscreen =
                false;
        }

        return;
    }

    // ==================================================
    // DESTINATION IS FULLY PRESENTABLE
    // ==================================================

    indicator.classList.remove(
        "visible"
    );

    window.geoplayDestinationOffscreen =
        false;

    card.classList.add(
        "visible"
    );

    card.style.zIndex =
        geoplayDestinationSceneZIndex;

    // ==================================================
    // ALWAYS POINT DOWN FROM THE CARD
    // ==================================================

    card.setAttribute(
        "data-pointer-side",
        "top"
    );

    // The pointer is horizontally aligned with the
    // casino marker, which remains the center anchor.
    card.style.setProperty(
        "--geoplay-pointer-left",
        "50%"
    );

    // Not used by the top/bottom pointer, but keep it
    // deterministic so no stale side-positioning values
    // can affect the card.
    card.style.setProperty(
        "--geoplay-pointer-top",
        "50%"
    );

    // ==================================================
    // FIXED CARD POSITION:
    // CENTERED DIRECTLY ABOVE THE CASINO MARKER.
    // ==================================================

    card.style.left =
        point.x +
        "px";

    card.style.top =
        (
            point.y -
            markerGap
        ) +
        "px";

    card.style.transform =
        "translate(-50%,-100%)";

    console.log(
        "GEOPLAY UI: Destination card positioned directly above casino marker."
    );
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


        card.setAttribute(
            "data-pointer-side",
            "top"
        );


        card.style.setProperty(
            "--geoplay-pointer-left",
            "50%"
        );


        card.style.setProperty(
            "--geoplay-pointer-top",
            "50%"
        );
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


    window.geoplayDestinationFinalPresentation =
        false;


    window.geoplayDestinationControlledTransition =
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


    var card =
        document.getElementById(
            "geoplay-destination"
        );


    if (
        card
    )
    {
        card.classList.remove(
            "visible"
        );
    }


    window.geoplayDestinationOffscreen =
        false;


    window.geoplayDestinationFinalPresentation =
        false;


    window.geoplayDestinationControlledTransition =
        true;


    // Make sure the movement listeners are available before
    // starting the controlled camera flight.
    geoplayMapUIAttachDestinationMapListeners();


    window.geoplayMap.easeTo(
    {
        center:
        [
            geoplayDestinationLongitude,
            geoplayDestinationLatitude
        ],

        zoom:
            14.7,

        bearing:
            0,

        pitch:
            0,

        duration:
            900,

        essential:
            true
    });


    return 1;
}


// ==================================================
// END GEOPLAY MAP DESTINATION
// ==================================================