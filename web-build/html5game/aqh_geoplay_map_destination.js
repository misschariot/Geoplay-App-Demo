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
        // OFF-SCREEN DESTINATION INDICATOR
        // ==================================================
        //
        // Matches the Pine Ridge casino card:
        // - Deep purple glass interior
        // - Purple -> magenta -> orange gradient border
        // - Soft matching glow
        // - Rounded/polished UI treatment
        // - No hover movement or visual change
        //
        ".geoplay-destination-offscreen {" +

            "box-sizing: border-box;" +

            "position: absolute;" +

            "display: flex;" +

            "align-items: center;" +

            "justify-content: center;" +

            "gap: 7px;" +

            "min-width: 126px;" +

            "height: 34px;" +

            "padding: 0 12px;" +

            "border-radius: 17px;" +

            "background: linear-gradient(rgba(14,9,39,0.96), rgba(14,9,39,0.96)) padding-box, linear-gradient(90deg, #8b3dff 0%, #d52cff 48%, #ff9d00 100%) border-box;" +

            "border: 1.5px solid transparent;" +

            "box-shadow: 0 5px 16px rgba(0,0,0,0.30), 0 0 13px rgba(151,65,255,0.20), 0 0 18px rgba(255,132,0,0.07);" +

            "backdrop-filter: blur(10px);" +

            "-webkit-backdrop-filter: blur(10px);" +

            "color: rgba(255,255,255,0.98);" +

            "cursor: pointer;" +

            "transform: translate(-50%,-50%);" +

            "z-index: 111;" +

            "opacity: 0;" +

            "visibility: hidden;" +

            "pointer-events: none;" +

            "transition: none !important;" +

        "}" +


        ".geoplay-destination-offscreen.visible {" +

            "opacity: 1;" +

            "visibility: visible;" +

            "pointer-events: auto;" +

        "}" +


        // ==================================================
        // INDICATOR - NO HOVER EFFECT
        // ==================================================

        ".geoplay-destination-offscreen:hover," +

        ".geoplay-destination-offscreen:focus," +

        ".geoplay-destination-offscreen:focus-visible," +

        ".geoplay-destination-offscreen:active {" +

            "background: linear-gradient(rgba(14,9,39,0.96), rgba(14,9,39,0.96)) padding-box, linear-gradient(90deg, #8b3dff 0%, #d52cff 48%, #ff9d00 100%) border-box !important;" +

            "border-color: transparent !important;" +

            "box-shadow: 0 5px 16px rgba(0,0,0,0.30), 0 0 13px rgba(151,65,255,0.20), 0 0 18px rgba(255,132,0,0.07) !important;" +

            "color: rgba(255,255,255,0.98) !important;" +

            "transform: translate(-50%,-50%) !important;" +

            "filter: none !important;" +

            "opacity: 1 !important;" +

            "transition: none !important;" +

        "}" +


        // ==================================================
        // INDICATOR ARROW
        // ==================================================

        ".geoplay-destination-offscreen-arrow {" +

            "width: 20px;" +

            "height: 20px;" +

            "flex-shrink: 0;" +

            "display: flex;" +

            "align-items: center;" +

            "justify-content: center;" +

            "font-family: Arial, sans-serif;" +

            "font-size: 17px;" +

            "font-weight: 400;" +

            "line-height: 1;" +

            "color: rgba(255,255,255,0.98);" +

            "text-shadow: 0 0 8px rgba(213,44,255,0.35);" +

            "transform-origin: center center;" +

            "transition: none !important;" +

            "animation: none !important;" +

        "}" +


        // ==================================================
        // INDICATOR NAME
        // ==================================================

        ".geoplay-destination-offscreen-name {" +

            "display: block;" +

            "font-family: Arial, sans-serif;" +

            "font-size: 9px;" +

            "font-weight: 700;" +

            "letter-spacing: 0.55px;" +

            "line-height: 1;" +

            "white-space: nowrap;" +

            "color: rgba(255,255,255,0.96);" +

        "}" +


        // ==================================================
        // MOBILE INDICATOR
        // ==================================================

        "@media (max-width: 480px) {" +

            ".geoplay-destination-offscreen {" +

                "min-width: 116px;" +

                "height: 32px;" +

                "padding: 0 10px;" +

                "gap: 6px;" +

                "border-radius: 16px;" +

            "}" +


            ".geoplay-destination-offscreen-arrow {" +

                "width: 19px;" +

                "height: 19px;" +

                "font-size: 16px;" +

            "}" +


            ".geoplay-destination-offscreen-name {" +

                "font-size: 8.5px;" +

                "letter-spacing: 0.5px;" +

            "}" +

        "}" +


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
        // BALLOON-LIKE POP ANIMATION
        // ==================================================

        "@keyframes geoplayDestinationPopIn {" +

            "0% {" +

                "opacity: 0;" +

                "scale: 0.82;" +

            "}" +

            "68% {" +

                "opacity: 1;" +

                "scale: 1.045;" +

            "}" +

            "100% {" +

                "opacity: 1;" +

                "scale: 1;" +

            "}" +

        "}" +


        "@keyframes geoplayDestinationPopOut {" +

            "0% {" +

                "opacity: 1;" +

                "scale: 1;" +

            "}" +

            "100% {" +

                "opacity: 0;" +

                "scale: 0.84;" +

            "}" +

        "}" +


        ".geoplay-destination.geoplay-destination-pop-in {" +

            "animation: geoplayDestinationPopIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;" +

            "transition: none !important;" +

        "}" +


        ".geoplay-destination.geoplay-destination-pop-out {" +

            "animation: geoplayDestinationPopOut 170ms cubic-bezier(0.4, 0, 1, 1) both;" +

            "transition: none !important;" +

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
// SHOW DESTINATION CARD WITH POP ANIMATION
// ==================================================

function geoplayMapUIShowDestinationCard(
    card
)
{
    if (
        !card
    )
    {
        return;
    }


    if (
        card.classList.contains(
            "visible"
        ) &&

        !card.classList.contains(
            "geoplay-destination-pop-out"
        )
    )
    {
        return;
    }


    card.classList.remove(
        "geoplay-destination-pop-out"
    );


    card.classList.remove(
        "geoplay-destination-pop-in"
    );


    void card.offsetWidth;


    card.classList.add(
        "visible"
    );


    card.classList.add(
        "geoplay-destination-pop-in"
    );


    window.setTimeout(
        function()
        {
            if (
                card
            )
            {
                card.classList.remove(
                    "geoplay-destination-pop-in"
                );
            }
        },
        280
    );
}


// ==================================================
// HIDE DESTINATION CARD WITH POP ANIMATION
// ==================================================

function geoplayMapUIHideDestinationCard(
    card
)
{
    if (
        !card
    )
    {
        return;
    }


    if (
        !card.classList.contains(
            "visible"
        )
    )
    {
        return;
    }


    if (
        card.classList.contains(
            "geoplay-destination-pop-out"
        )
    )
    {
        return;
    }


    card.classList.remove(
        "geoplay-destination-pop-in"
    );


    card.classList.remove(
        "geoplay-destination-pop-out"
    );


    void card.offsetWidth;


    card.classList.add(
        "geoplay-destination-pop-out"
    );


    window.setTimeout(
        function()
        {
            if (
                card &&
                card.classList.contains(
                    "geoplay-destination-pop-out"
                )
            )
            {
                card.classList.remove(
                    "visible"
                );


                card.classList.remove(
                    "geoplay-destination-pop-out"
                );
            }
        },
        180
    );
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
        "geoplay-destination-pop-in"
    );


    card.classList.remove(
        "geoplay-destination-pop-out"
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


            // ==================================================
            // IMPORTANT:
            // Once the user manually moves the map,
            // return to normal marker-based positioning.
            //
            // This means the final presentation state no
            // longer forces the casino card to remain visible.
            // ==================================================

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


            // ==================================================
            // NORMAL MAP MOVEMENT
            //
            // Always recalculate from the casino MARKER.
            // The card itself never determines visibility.
            // ==================================================

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


    if (
        width <= 0 ||
        height <= 0
    )
    {
        return;
    }


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
    //
    // The first frame after the controlled camera movement
    // should present the casino card.
    //
    // Once the user manually moves the map,
    // movestart clears this flag and normal marker-based
    // visibility takes over.
    //
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


    // ==================================================
    // MARKER-ONLY VISIBILITY TEST
    // ==================================================
    //
    // ONLY the casino MARKER determines whether the
    // casino card or the off-screen indicator appears.
    //
    // The card touching an edge does NOT trigger the
    // indicator.
    //
    // ==================================================

    var markerVisible =
        point.x >= margin &&

        point.x <=
            width -
            margin &&

        point.y >= margin &&

        point.y <=
            height -
            margin;


    if (
        markerVisible
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
    //
    // The casino card has ONE permanent relationship
    // to the casino marker:
    //
    //          CASINO MARKER
    //                ▲
    //                │
    //             CARD
    //
    // The card is always positioned directly above the
    // marker when the marker itself is visible.
    //
    // ==================================================

    var markerGap =
        geoplayDestinationMarkerGap;


    // ==================================================
    // DESTINATION IS IN VIEW
    // ==================================================

    indicator.classList.remove(
        "visible"
    );


    window.geoplayDestinationOffscreen =
        false;


    // ==================================================
    // IMPORTANT:
    // POSITION THE CARD BEFORE MAKING IT VISIBLE.
    //
    // Previously, the pop-in animation could begin while
    // the card still had no left/top position. The browser
    // could therefore render one frame at its default
    // position — the top-left corner of the map.
    //
    // We now establish the complete position first.
    // ==================================================

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


    // ==================================================
    // CARD ANCHORED TO MARKER
    // ==================================================
    //
    // Set these BEFORE geoplayMapUIShowDestinationCard()
    // so the very first animation frame is already in the
    // correct location.
    //
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


    // ==================================================
    // NOW SHOW THE CARD
    // ==================================================
    //
    // The card is already positioned correctly, so the
    // browser cannot briefly display it in the top-left
    // corner before the pop-in animation starts.
    //
    // ==================================================

    geoplayMapUIShowDestinationCard(
        card
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
    // ==================================================
    // HIDE CARD
    // ==================================================

    geoplayMapUIHideDestinationCard(
        card
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


    // ==================================================
    // SHOW INDICATOR
    // ==================================================

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


    // ==================================================
    // CALCULATE EDGE POSITION
    // ==================================================
    //
    // The indicator is positioned using the destination
    // MARKER position, never the card position.
    //
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
    // POINT ARROW TOWARD ACTUAL DESTINATION
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
//
// This version explicitly handles the four major
// directions and uses the map viewport as the boundary.
//
// This is particularly important for the NORTH case,
// where the casino marker can move above the viewport.
//
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
    // ==================================================
    // INDICATOR HALF-DIMENSIONS
    // ==================================================
    //
    // Approximate half-size of the indicator so its
    // visual center stays safely inside the viewport.
    //
    // ==================================================

    var indicatorHalfWidth =
        58;


    var indicatorHalfHeight =
        16;


    // ==================================================
    // EDGE PADDING
    // ==================================================

    var horizontalPadding =
        12;


    var verticalPadding =
        12;


    // ==================================================
    // SAFE EDGES
    // ==================================================

    var leftEdge =
        indicatorHalfWidth +
        horizontalPadding;


    var rightEdge =
        width -
        indicatorHalfWidth -
        horizontalPadding;


    var topEdge =
        indicatorHalfHeight +
        verticalPadding;


    var bottomEdge =
        height -
        indicatorHalfHeight -
        verticalPadding;


    // ==================================================
    // SAFETY FOR SMALL VIEWPORTS
    // ==================================================

    if (
        rightEdge <
        leftEdge
    )
    {
        leftEdge =
            width /
            2;

        rightEdge =
            width /
            2;
    }


    if (
        bottomEdge <
        topEdge
    )
    {
        topEdge =
            height /
            2;

        bottomEdge =
            height /
            2;
    }


    // ==================================================
    // DESTINATION DIRECTLY ABOVE
    // ==================================================
    //
    // This is the important NORTH case.
    //
    // If the marker is above the viewport and its
    // horizontal position is reasonably within the
    // viewport, place the indicator directly at the
    // TOP edge.
    //
    // ==================================================

    if (
        dy < 0 &&
        Math.abs(dx) <=
            Math.abs(dy)
    )
    {
        var northRatio =
            dy !== 0
                ?
                (
                    topEdge -
                    centerY
                ) /
                dy
                :
                0;


        var northX =
            centerX +
            dx *
            northRatio;


        northX =
            Math.max(
                leftEdge,
                Math.min(
                    rightEdge,
                    northX
                )
            );


        return {
            x:
                northX,

            y:
                topEdge
        };
    }


    // ==================================================
    // DESTINATION DIRECTLY BELOW
    // ==================================================

    if (
        dy > 0 &&
        Math.abs(dx) <=
            Math.abs(dy)
    )
    {
        var southRatio =
            dy !== 0
                ?
                (
                    bottomEdge -
                    centerY
                ) /
                dy
                :
                0;


        var southX =
            centerX +
            dx *
            southRatio;


        southX =
            Math.max(
                leftEdge,
                Math.min(
                    rightEdge,
                    southX
                )
            );


        return {
            x:
                southX,

            y:
                bottomEdge
        };
    }


    // ==================================================
    // DESTINATION TO THE LEFT
    // ==================================================

    if (
        dx < 0 &&
        Math.abs(dx) >
            Math.abs(dy)
    )
    {
        var westRatio =
            dx !== 0
                ?
                (
                    leftEdge -
                    centerX
                ) /
                dx
                :
                0;


        var westY =
            centerY +
            dy *
            westRatio;


        westY =
            Math.max(
                topEdge,
                Math.min(
                    bottomEdge,
                    westY
                )
            );


        return {
            x:
                leftEdge,

            y:
                westY
        };
    }


    // ==================================================
    // DESTINATION TO THE RIGHT
    // ==================================================

    if (
        dx > 0 &&
        Math.abs(dx) >
            Math.abs(dy)
    )
    {
        var eastRatio =
            dx !== 0
                ?
                (
                    rightEdge -
                    centerX
                ) /
                dx
                :
                0;


        var eastY =
            centerY +
            dy *
            eastRatio;


        eastY =
            Math.max(
                topEdge,
                Math.min(
                    bottomEdge,
                    eastY
                )
            );


        return {
            x:
                rightEdge,

            y:
                eastY
        };
    }


    // ==================================================
    // DIAGONAL / CORNER CASES
    // ==================================================
    //
    // For diagonal destinations, calculate the actual
    // intersection with the viewport boundary.
    //
    // ==================================================

    var scaleX =
        dx !== 0
            ?
            Math.abs(
                (
                    dx > 0
                        ?
                        rightEdge -
                        centerX
                        :
                        leftEdge -
                        centerX
                ) /
                dx
            )
            :
            Infinity;


    var scaleY =
        dy !== 0
            ?
            Math.abs(
                (
                    dy > 0
                        ?
                        bottomEdge -
                        centerY
                        :
                        topEdge -
                        centerY
                ) /
                dy
            )
            :
            Infinity;


    var scale =
        Math.min(
            scaleX,
            scaleY
        );


    if (
        !isFinite(scale)
    )
    {
        scale =
            1;
    }


    var edgeX =
        centerX +
        dx *
        scale;


    var edgeY =
        centerY +
        dy *
        scale;


    edgeX =
        Math.max(
            leftEdge,
            Math.min(
                rightEdge,
                edgeX
            )
        );


    edgeY =
        Math.max(
            topEdge,
            Math.min(
                bottomEdge,
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
        geoplayMapUIHideDestinationCard(
            card
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
        geoplayMapUIHideDestinationCard(
            card
        );
    }


    window.geoplayDestinationOffscreen =
        false;


    window.geoplayDestinationFinalPresentation =
        false;


    window.geoplayDestinationControlledTransition =
        true;


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