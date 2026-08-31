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

window.geoplayDestinationCard = null;
window.geoplayDestinationOffscreenArrow = null;
window.geoplayDestinationVisible = false;
window.geoplayDestinationOffscreen = false;
window.geoplayDestinationExpanded = false;
window.geoplayDestinationOverlay = null;
window.geoplayDestinationClosing = false;
window.geoplayDestinationFinalPresentation = false;
window.geoplayDestinationControlledTransition = false;
window.geoplayDestinationMapListenersAttached = false;


// ==================================================
// DESTINATION CONSTANTS
// ==================================================

var geoplayDestinationModalZIndex = 501;
var geoplayDestinationSceneZIndex = 110;
var geoplayDestinationOverlayZIndex = 500;
var geoplayDestinationVisibilityMargin = 45;
var geoplayDestinationMarkerGap = 16;


// ==================================================
// DESTINATION MARKETING CAROUSEL
// ==================================================

window.geoplayDestinationCarouselImages =
[
    "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine1.png",
    "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine2.png",
    "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine3.png",
    "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/pine4.png"
];

window.geoplayDestinationCarouselIndex = 0;
window.geoplayDestinationCarouselTouchStartX = null;
window.geoplayDestinationCarouselTouchStartY = null;


// ==================================================
// DESTINATION NAME
// ==================================================

function geoplayMapUIDestinationName()
{
    return window.geoplayDestinationName ||
        "Pine Ridge Casino";
}


// ==================================================
// DESTINATION DISTANCE
// ==================================================

function geoplayMapUIDestinationDistanceReady()
{
    var distance =
        window.geoplayDestinationDistanceMiles;

    return (
        typeof distance === "number" &&
        isFinite(distance) &&
        distance > 0
    );
}


function geoplayMapUIDestinationDistance()
{
    if (!geoplayMapUIDestinationDistanceReady())
    {
        return "";
    }

    return (
        window.geoplayDestinationDistanceMiles.toFixed(1) +
        " MI AWAY"
    );
}


// ==================================================
// REFRESH DESTINATION DISTANCE
// ==================================================

function geoplayMapUIRefreshDestinationDistance()
{
    var card =
        window.geoplayDestinationCard;

    if (!card ||
        !geoplayMapUIDestinationDistanceReady())
    {
        return 0;
    }

    console.log(
        "GEOPLAY UI: Destination distance is ready."
    );

    if (!window.geoplayDestinationExpanded)
    {
        geoplayMapUISetDestinationCollapsed(card);

        if (window.geoplayDestinationVisible)
        {
            geoplayMapUIPositionDestination();
        }

        return 1;
    }

    geoplayMapUISetDestinationExpanded(card);

    if (typeof geoplayMapUICenterModal === "function")
    {
        geoplayMapUICenterModal(card);
    }

    return 1;
}


// ==================================================
// CREATE DESTINATION CALLOUT
// ==================================================

function geoplayMapUICreateDestinationCard()
{
    if (!window.geoplayMapUI)
    {
        console.error(
            "GEOPLAY UI: Map UI container not found."
        );

        return 0;
    }

    var overlay =
        document.createElement("div");

    overlay.id =
        "geoplay-destination-overlay";

    overlay.className =
        "geoplay-destination-overlay";

    Object.assign(
        overlay.style,
        {
            position: "absolute",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            background: "rgba(5,2,18,.42)",
            opacity: "0",
            visibility: "hidden",
            pointerEvents: "none",
            zIndex: geoplayDestinationOverlayZIndex,
            transition:
                "opacity 300ms ease, visibility 300ms ease"
        }
    );

    window.geoplayMapUI.appendChild(overlay);

    window.geoplayDestinationOverlay =
        overlay;

    var card =
        document.createElement("div");

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

    geoplayMapUISetDestinationCollapsed(card);

    window.geoplayMapUI.appendChild(card);

    window.geoplayDestinationCard =
        card;

    geoplayMapUIAttachDestinationMapListeners();

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

    geoplayMapUIDelegateDestinationInteraction(
        card
    );

    console.log(
        "GEOPLAY UI: Pine Ridge destination callout created."
    );

    return 1;
}


// ==================================================
// DESTINATION INTERACTION
// ==================================================

function geoplayMapUIDelegateDestinationInteraction(card)
{
    if (!card)
    {
        return;
    }

    function handleInteraction(event)
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
            window.geoplayMapStoryLocked ||
            window.geoplayDestinationExpanded ||
            window.geoplayDestinationClosing
        )
        {
            return;
        }

        if (event.type === "touchend")
        {
            event.preventDefault();
        }

        geoplayMapUIExpandDestination();
    }

    card.addEventListener(
        "click",
        handleInteraction
    );

    card.addEventListener(
        "touchend",
        handleInteraction,
        {
            passive: false
        }
    );
}


function geoplayMapUIDestinationEventIsInternal(event)
{
    if (!event || !event.target)
    {
        return false;
    }

    return !!event.target.closest(
        ".geoplay-destination-close, " +
        ".geoplay-destination-play"
    );
}


// ==================================================
// CARD VISIBILITY ANIMATION
// ==================================================

function geoplayMapUIShowDestinationCard(card)
{
    if (!card)
    {
        return;
    }

    if (
        card.classList.contains("visible") &&
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

    card.classList.add("visible");
    card.classList.add(
        "geoplay-destination-pop-in"
    );

    window.setTimeout(
        function()
        {
            if (card)
            {
                card.classList.remove(
                    "geoplay-destination-pop-in"
                );
            }
        },
        280
    );
}


function geoplayMapUIHideDestinationCard(card)
{
    if (!card ||
        !card.classList.contains("visible") ||
        card.classList.contains(
            "geoplay-destination-pop-out"
        ))
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
// COLLAPSED DESTINATION
// ==================================================

function geoplayMapUISetDestinationCollapsed(card)
{
    if (!card)
    {
        return;
    }

    card.classList.remove("expanded");
    card.classList.remove("modal-closing");
    card.classList.remove(
        "geoplay-destination-pop-in"
    );
    card.classList.remove(
        "geoplay-destination-pop-out"
    );
    card.classList.remove("visible");

    card.style.zIndex =
        geoplayDestinationSceneZIndex;

    var name =
        geoplayMapUIDestinationName();

    var distanceReady =
        geoplayMapUIDestinationDistanceReady();

    var distanceMarkup =
        distanceReady
            ? (
                "<div class='geoplay-destination-bottom-row'>" +
                    "<span class='geoplay-destination-info'>" +
                        geoplayMapUIDestinationDistance() +
                    "</span>" +
                "</div>"
            )
            : "";

    card.innerHTML =
        "<div class='geoplay-destination-collapsed'>" +
            "<div class='geoplay-destination-collapsed-main'>" +
                "<span class='geoplay-destination-pin'>📍</span>" +
                "<span class='geoplay-destination-title'>" +
                    name.toUpperCase() +
                "</span>" +
            "</div>" +
            distanceMarkup +
            "<span class='geoplay-destination-chevron'>›</span>" +
        "</div>";

    card.setAttribute(
        "data-pointer-side",
        card.getAttribute("data-pointer-side") ||
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

    window.geoplayDestinationExpanded =
        false;
}


// ==================================================
// EXPANDED DESTINATION
// ==================================================

function geoplayMapUISetDestinationExpanded(card)
{
    if (!card)
    {
        return;
    }

    var name =
        geoplayMapUIDestinationName();

    var distanceReady =
        geoplayMapUIDestinationDistanceReady();

    var distanceMarkup =
        distanceReady
            ? (
                "<div class='geoplay-destination-expanded-distance'>" +
                    "<span class='geoplay-destination-distance-icon'>➜</span>" +
                    "<span>" +
                        geoplayMapUIDestinationDistance() +
                    "</span>" +
                "</div>"
            )
            : "";

    card.classList.add("expanded");
    card.classList.remove("modal-closing");

    card.style.zIndex =
        geoplayDestinationModalZIndex;

    card.innerHTML =
        "<div class='geoplay-destination-expanded-header'>" +
            "<span class='geoplay-destination-expanded-title'>" +
                name.toUpperCase() +
            "</span>" +

            "<button type='button' " +
                "class='geoplay-destination-close' " +
                "aria-label='Close " +
                    name +
                    " information'>" +
                "×" +
            "</button>" +
        "</div>" +

        "<div class='geoplay-destination-carousel' " +
            "aria-label='Pine Ridge Casino photos'>" +

            "<div class='geoplay-destination-carousel-track'>" +
                "<img class='geoplay-destination-carousel-image' " +
                    "src='" +
                        window.geoplayDestinationCarouselImages[0] +
                    "' " +
                    "alt='" +
                        name +
                    "' " +
                    "draggable='false'>" +
            "</div>" +

            "<button type='button' " +
                "class='geoplay-destination-carousel-arrow geoplay-destination-carousel-arrow-left' " +
                "aria-label='Previous image'>‹</button>" +

            "<button type='button' " +
                "class='geoplay-destination-carousel-arrow geoplay-destination-carousel-arrow-right' " +
                "aria-label='Next image'>›</button>" +

            "<div class='geoplay-destination-carousel-dots'></div>" +
        "</div>" +

        "<div class='geoplay-destination-marketing'>" +
            "<div class='geoplay-destination-tagline'>" +
                "Your night starts here." +
            "</div>" +

            "<div class='geoplay-destination-marketing-copy'>" +
                "Big games. Great food. Unforgettable nights." +
            "</div>" +
        "</div>" +

        "<div class='geoplay-destination-expanded-divider'></div>" +

        "<div class='geoplay-destination-expanded-details'>" +
            distanceMarkup +

            "<div class='geoplay-destination-expanded-address'>" +
                "<span class='geoplay-destination-address-icon'>⌖</span>" +

                "<span class='geoplay-destination-address-text'>" +
                    "777 Pine Ridge Road<br>" +
                    "Pine Ridge, CA 95563" +
                "</span>" +
            "</div>" +
        "</div>" +

        "<button type='button' " +
            "class='geoplay-destination-play'>" +
            "<span>PLAY HERE</span>" +
        "</button>";

    window.geoplayDestinationExpanded =
        true;

    window.geoplayDestinationCarouselIndex =
        0;

    geoplayMapUIAttachDestinationCarousel(card);
    geoplayMapUIAttachDestinationClose(card);
    geoplayMapUIAttachDestinationPlay(card);
}


// ==================================================
// CAROUSEL
// ==================================================

function geoplayMapUIDestinationNormalizeCarouselIndex(
    index,
    total
)
{
    if (!total)
    {
        return 0;
    }

    return (
        (
            index % total
        ) +
        total
    ) % total;
}


function geoplayMapUIDestinationSetCarouselImage(
    image,
    imageUrl
)
{
    if (!image)
    {
        return;
    }

    image.style.opacity =
        "0";

    window.setTimeout(
        function()
        {
            image.src =
                imageUrl;

            image.onload =
                function()
                {
                    image.style.opacity =
                        "1";
                };

            image.onerror =
                function()
                {
                    image.style.opacity =
                        "1";
                };

            if (image.complete)
            {
                image.style.opacity =
                    "1";
            }
        },
        90
    );
}


function geoplayMapUIDestinationUpdateCarouselDots(
    dots,
    index
)
{
    if (!dots)
    {
        return;
    }

    dots.querySelectorAll(
        ".geoplay-destination-carousel-dot"
    ).forEach(
        function(dot, dotIndex)
        {
            dot.classList.toggle(
                "active",
                dotIndex === index
            );
        }
    );
}


function geoplayMapUIDestinationCarouselShow(
    card,
    index
)
{
    if (!card)
    {
        return;
    }

    var images =
        window.geoplayDestinationCarouselImages ||
        [];

    if (!images.length)
    {
        return;
    }

    index =
        geoplayMapUIDestinationNormalizeCarouselIndex(
            index,
            images.length
        );

    window.geoplayDestinationCarouselIndex =
        index;

    var image =
        card.querySelector(
            ".geoplay-destination-carousel-image"
        );

    geoplayMapUIDestinationSetCarouselImage(
        image,
        images[index]
    );

    geoplayMapUIDestinationUpdateCarouselDots(
        card.querySelector(
            ".geoplay-destination-carousel-dots"
        ),
        index
    );
}


function geoplayMapUIAttachDestinationCarousel(card)
{
    if (!card)
    {
        return;
    }

    var carousel =
        card.querySelector(
            ".geoplay-destination-carousel"
        );

    var image =
        card.querySelector(
            ".geoplay-destination-carousel-image"
        );

    var previousButton =
        card.querySelector(
            ".geoplay-destination-carousel-arrow-left"
        );

    var nextButton =
        card.querySelector(
            ".geoplay-destination-carousel-arrow-right"
        );

    var dots =
        card.querySelector(
            ".geoplay-destination-carousel-dots"
        );

    if (
        !carousel ||
        !image ||
        !previousButton ||
        !nextButton ||
        !dots
    )
    {
        return;
    }

    var images =
        window.geoplayDestinationCarouselImages ||
        [];

    if (!images.length)
    {
        return;
    }

    dots.innerHTML = "";

    images.forEach(
        function(imageUrl, index)
        {
            var dot =
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "geoplay-destination-carousel-dot";

            dot.setAttribute(
                "aria-label",
                "Show image " +
                (index + 1)
            );

            dot.dataset.index =
                index;

            dot.addEventListener(
                "click",
                function(event)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    geoplayMapUIDestinationCarouselShow(
                        card,
                        parseInt(
                            event.currentTarget.dataset.index,
                            10
                        )
                    );
                }
            );

            dots.appendChild(dot);
        }
    );

    previousButton.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();
            event.stopPropagation();

            geoplayMapUIDestinationCarouselShow(
                card,
                window.geoplayDestinationCarouselIndex -
                1
            );
        }
    );

    nextButton.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();
            event.stopPropagation();

            geoplayMapUIDestinationCarouselShow(
                card,
                window.geoplayDestinationCarouselIndex +
                1
            );
        }
    );

    carousel.addEventListener(
        "touchstart",
        function(event)
        {
            if (
                !event.touches ||
                !event.touches.length
            )
            {
                return;
            }

            window.geoplayDestinationCarouselTouchStartX =
                event.touches[0].clientX;

            window.geoplayDestinationCarouselTouchStartY =
                event.touches[0].clientY;
        },
        {
            passive: true
        }
    );

    carousel.addEventListener(
        "touchend",
        function(event)
        {
            var startX =
                window.geoplayDestinationCarouselTouchStartX;

            var startY =
                window.geoplayDestinationCarouselTouchStartY;

            if (
                startX === null ||
                !event.changedTouches ||
                !event.changedTouches.length
            )
            {
                return;
            }

            var deltaX =
                event.changedTouches[0].clientX -
                startX;

            var deltaY =
                event.changedTouches[0].clientY -
                startY;

            window.geoplayDestinationCarouselTouchStartX =
                null;

            window.geoplayDestinationCarouselTouchStartY =
                null;

            if (
                Math.abs(deltaX) < 35 ||
                Math.abs(deltaX) < Math.abs(deltaY)
            )
            {
                return;
            }

            geoplayMapUIDestinationCarouselShow(
                card,
                window.geoplayDestinationCarouselIndex +
                (
                    deltaX < 0
                        ? 1
                        : -1
                )
            );
        },
        {
            passive: true
        }
    );

    images.forEach(
        function(imageUrl)
        {
            var preload =
                new Image();

            preload.src =
                imageUrl;
        }
    );

    geoplayMapUIDestinationCarouselShow(
        card,
        0
    );
}


// ==================================================
// CLOSE / PLAY BUTTONS
// ==================================================

function geoplayMapUIAttachDestinationClose(card)
{
    var closeButton =
        card.querySelector(
            ".geoplay-destination-close"
        );

    if (!closeButton)
    {
        return;
    }

    function handleClose(event)
    {
        event.preventDefault();
        event.stopPropagation();

        geoplayMapUICollapseDestination();
    }

    closeButton.addEventListener(
        "click",
        handleClose
    );

    closeButton.addEventListener(
        "touchend",
        handleClose,
        {
            passive: false
        }
    );
}


function geoplayMapUIAttachDestinationPlay(card)
{
    var playButton =
        card.querySelector(
            ".geoplay-destination-play"
        );

    if (!playButton)
    {
        return;
    }

    function handlePlay(event)
    {
        event.preventDefault();
        event.stopPropagation();

        geoplayMapUIPlayHere();
    }

    playButton.addEventListener(
        "click",
        handlePlay
    );

    playButton.addEventListener(
        "touchend",
        handlePlay,
        {
            passive: false
        }
    );
}


// ==================================================
// EXPAND / COLLAPSE
// ==================================================

function geoplayMapUIExpandDestination()
{
    var card =
        window.geoplayDestinationCard;

    if (
        !card ||
        window.geoplayMapStoryLocked ||
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

    geoplayMapUISetDestinationExpanded(card);

    geoplayMapUIOpenModal(
        window.geoplayDestinationOverlay,
        card
    );

    console.log(
        "GEOPLAY UI: Pine Ridge information card expanded."
    );

    return 1;
}


function geoplayMapUICollapseDestination()
{
    var card =
        window.geoplayDestinationCard;

    if (
        !card ||
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
            if (!window.geoplayDestinationCard)
            {
                window.geoplayDestinationClosing =
                    false;

                return;
            }

            geoplayMapUISetDestinationCollapsed(
                window.geoplayDestinationCard
            );

            var destinationCard =
                window.geoplayDestinationCard;

            destinationCard.style.left = "";
            destinationCard.style.top = "";
            destinationCard.style.transform = "";

            destinationCard.style.zIndex =
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


function geoplayMapUIPlayHere()
{
    if (window.geoplayMapStoryLocked)
    {
        return 0;
    }

    console.log(
        "GEOPLAY UI: PLAY HERE selected."
    );

    return 1;
}


// ==================================================
// OFF-SCREEN INDICATOR
// ==================================================

function geoplayMapUICreateOffscreenIndicator()
{
    if (!window.geoplayMapUI)
    {
        return 0;
    }

    var indicator =
        document.createElement("div");

    indicator.id =
        "geoplay-destination-offscreen";

    indicator.className =
        "geoplay-destination-offscreen";

    var arrow =
        document.createElement("span");

    arrow.id =
        "geoplay-destination-offscreen-arrow";

    arrow.className =
        "geoplay-destination-offscreen-arrow";

    arrow.textContent =
        "➜";

    var name =
        document.createElement("span");

    name.className =
        "geoplay-destination-offscreen-name";

    name.textContent =
        geoplayMapUIDestinationName()
            .toUpperCase()
            .replace(
                " CASINO",
                ""
            );

    indicator.appendChild(arrow);
    indicator.appendChild(name);

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


function geoplayMapUIAttachOffscreenIndicatorInteraction(
    indicator
)
{
    function handleInteraction(event)
    {
        event.preventDefault();
        event.stopPropagation();

        if (window.geoplayMapStoryLocked)
        {
            return;
        }

        geoplayMapUIGoToDestination();
    }

    indicator.addEventListener(
        "click",
        handleInteraction
    );

    indicator.addEventListener(
        "touchend",
        handleInteraction,
        {
            passive: false
        }
    );
}


// ==================================================
// MAP LISTENERS
// ==================================================

function geoplayMapUIAttachDestinationMapListeners()
{
    if (
        window.geoplayDestinationMapListenersAttached ||
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
                window.geoplayDestinationControlledTransition ||
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
                !window.geoplayDestinationVisible ||
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

                if (card)
                {
                    card.classList.remove(
                        "visible"
                    );
                }

                if (indicator)
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
    if (!window.geoplayMap)
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

    if (window.geoplayDestinationExpanded)
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
            ]
        );

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

    var markerVisible =
        point.x >= margin &&
        point.x <= width - margin &&
        point.y >= margin &&
        point.y <= height - margin;

    if (markerVisible)
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
// EXPANDED POSITION
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
        geoplayMapUICenterModal(card);
        return;
    }

    card.style.left =
        (
            mapContainer.clientWidth /
            2
        ) + "px";

    card.style.top =
        (
            mapContainer.clientHeight /
            2
        ) + "px";
}


// ==================================================
// VISIBLE POSITION
// ==================================================

function geoplayMapUIPositionVisibleDestination(
    card,
    indicator,
    point
)
{
    indicator.classList.remove(
        "visible"
    );

    window.geoplayDestinationOffscreen =
        false;

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

    card.style.left =
        point.x + "px";

    card.style.top =
        (
            point.y -
            geoplayDestinationMarkerGap
        ) + "px";

    card.style.transform =
        "translate(-50%,-100%)";

    geoplayMapUIShowDestinationCard(
        card
    );
}


// ==================================================
// OFF-SCREEN POSITION
// ==================================================

function geoplayMapUIPositionOffscreenDestination(
    card,
    indicator,
    point,
    width,
    height
)
{
    geoplayMapUIHideDestinationCard(
        card
    );

    if (!window.geoplayDestinationIndicatorEnabled)
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
        width / 2;

    var centerY =
        height / 2;

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
        edge.x + "px";

    indicator.style.top =
        edge.y + "px";

    if (
        window.geoplayDestinationOffscreenArrow
    )
    {
        var angle =
            Math.atan2(
                dy,
                dx
            ) *
            180 /
            Math.PI;

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
    var indicatorHalfWidth =
        58;

    var indicatorHalfHeight =
        16;

    var horizontalPadding =
        12;

    var verticalPadding =
        12;

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

    if (rightEdge < leftEdge)
    {
        leftEdge =
            width / 2;

        rightEdge =
            width / 2;
    }

    if (bottomEdge < topEdge)
    {
        topEdge =
            height / 2;

        bottomEdge =
            height / 2;
    }

    if (
        dy < 0 &&
        Math.abs(dx) <= Math.abs(dy)
    )
    {
        var northRatio =
            dy !== 0
                ? (
                    topEdge -
                    centerY
                ) / dy
                : 0;

        return {
            x: Math.max(
                leftEdge,
                Math.min(
                    rightEdge,
                    centerX +
                    dx *
                    northRatio
                )
            ),
            y: topEdge
        };
    }

    if (
        dy > 0 &&
        Math.abs(dx) <= Math.abs(dy)
    )
    {
        var southRatio =
            dy !== 0
                ? (
                    bottomEdge -
                    centerY
                ) / dy
                : 0;

        return {
            x: Math.max(
                leftEdge,
                Math.min(
                    rightEdge,
                    centerX +
                    dx *
                    southRatio
                )
            ),
            y: bottomEdge
        };
    }

    if (
        dx < 0 &&
        Math.abs(dx) > Math.abs(dy)
    )
    {
        var westRatio =
            dx !== 0
                ? (
                    leftEdge -
                    centerX
                ) / dx
                : 0;

        return {
            x: leftEdge,
            y: Math.max(
                topEdge,
                Math.min(
                    bottomEdge,
                    centerY +
                    dy *
                    westRatio
                )
            )
        };
    }

    if (
        dx > 0 &&
        Math.abs(dx) > Math.abs(dy)
    )
    {
        var eastRatio =
            dx !== 0
                ? (
                    rightEdge -
                    centerX
                ) / dx
                : 0;

        return {
            x: rightEdge,
            y: Math.max(
                topEdge,
                Math.min(
                    bottomEdge,
                    centerY +
                    dy *
                    eastRatio
                )
            )
        };
    }

    var scaleX =
        dx !== 0
            ? Math.abs(
                (
                    dx > 0
                        ? rightEdge -
                          centerX
                        : leftEdge -
                          centerX
                ) / dx
            )
            : Infinity;

    var scaleY =
        dy !== 0
            ? Math.abs(
                (
                    dy > 0
                        ? bottomEdge -
                          centerY
                        : topEdge -
                          centerY
                ) / dy
            )
            : Infinity;

    var scale =
        Math.min(
            scaleX,
            scaleY
        );

    if (!isFinite(scale))
    {
        scale = 1;
    }

    return {
        x: Math.max(
            leftEdge,
            Math.min(
                rightEdge,
                centerX +
                dx *
                scale
            )
        ),

        y: Math.max(
            topEdge,
            Math.min(
                bottomEdge,
                centerY +
                dy *
                scale
            )
        )
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

    if (card)
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

        card.style.transform = "";
        card.style.left = "";
        card.style.top = "";

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

    if (indicator)
    {
        indicator.classList.remove(
            "visible"
        );
    }

    if (window.geoplayDestinationOverlay)
    {
        var overlay =
            window.geoplayDestinationOverlay;

        overlay.classList.remove(
            "visible"
        );

        overlay.style.opacity =
            "0";

        overlay.style.visibility =
            "hidden";

        overlay.style.pointerEvents =
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
    if (window.geoplayDestinationVisible)
    {
        geoplayMapUIPositionDestination();
    }
}


// ==================================================
// GO TO DESTINATION
// ==================================================

function geoplayMapUIGoToDestination()
{
    if (window.geoplayMapStoryLocked)
    {
        console.log(
            "GEOPLAY UI: Destination selection blocked during story."
        );

        return 0;
    }

    if (!window.geoplayMap)
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

    var card =
        document.getElementById(
            "geoplay-destination"
        );

    if (card)
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

        zoom: 14.7,
        bearing: 0,
        pitch: 0,
        duration: 900,
        essential: true
    });

    return 1;
}


// ==================================================
// END GEOPLAY MAP DESTINATION
// ==================================================