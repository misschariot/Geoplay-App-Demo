// ==================================================
// GEOPLAY MAP UI
// ==================================================
//
// RESPONSIBILITY:
// - General map UI initialization
// - Searching visual
// - Story actions
//
// DIALOGUE:
// geoplay_map_dialogue.js
//
// DESTINATION:
// geoplay_map_destination.js
//
// ==================================================


window.geoplayMapUI = null;

window.geoplayMapUIInitialized = false;

window.geoplaySearchVisible = false;


// ==================================================
// CREATE UI
// ==================================================

function geoplayMapUICreate()
{
    if (
        window.geoplayMapUIInitialized &&
        window.geoplayMapUI
    )
    {
        return 1;
    }


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (!mapContainer)
    {
        console.error(
            "GEOPLAY UI: Map container not found."
        );

        return 0;
    }


    var ui =
        document.createElement(
            "div"
        );


    ui.id =
        "geoplay-map-ui";


    ui.style.position =
        "absolute";


    ui.style.left =
        "0";


    ui.style.top =
        "0";


    ui.style.width =
        "100%";


    ui.style.height =
        "100%";


    ui.style.pointerEvents =
        "none";


    ui.style.zIndex =
        "1000";


    ui.style.overflow =
        "hidden";


    mapContainer.appendChild(
        ui
    );


    window.geoplayMapUI =
        ui;


    geoplayMapUIAddStyles();

    geoplayMapUICreateDialogue();

    geoplayMapUICreateSearchVisual();

    geoplayMapUICreateDestinationCard();

    geoplayMapUICreateOffscreenIndicator();

    geoplayMapUICreateStoryActions();


    window.geoplayMapUIInitialized =
        true;


    console.log(
        "GEOPLAY UI: Story UI created."
    );


    return 1;
}


// ==================================================
// STYLES
// ==================================================
//
// Dialogue styles have moved to:
// geoplay_map_dialogue.js
//
// Destination styles will eventually move to:
// geoplay_map_destination.js
//
// For now, destination styles remain here so this
// first refactor remains isolated and low-risk.
// ==================================================

function geoplayMapUIAddStyles()
{
    if (
        document.getElementById(
            "geoplay-map-ui-styles"
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
        "geoplay-map-ui-styles";


    style.textContent = `

/* ==================================================
   POPPINS
   ================================================== */

@import url(
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'
);


#geoplay-map-ui
{
    font-family:
        'Poppins',
        Arial,
        sans-serif;

    color:
        #ffffff;
}


/* ==================================================
   SEARCH
   ================================================== */

.geoplay-search-visual
{
    position:
        absolute;

    left:
        0;

    top:
        0;

    width:
        100%;

    height:
        100%;

    opacity:
        0;

    pointer-events:
        none;

    z-index:
        20;

    transition:
        opacity .35s ease;
}


.geoplay-search-visual.visible
{
    opacity:
        1;
}


.geoplay-search-robot
{
    position:
        absolute;

    left:
        12px;

    bottom:
        90px;

    width:
        clamp(
            78px,
            20vw,
            145px
        );

    height:
        auto;

    opacity:
        0;
}


.geoplay-search-visual.visible
.geoplay-search-robot
{
    opacity:
        1;
}


/* ==================================================
   PINE RIDGE DESTINATION CARD
   ================================================== */

.geoplay-destination
{
    position:
        absolute;

    width:
        min(
            70vw,
            285px
        );

    max-width:
        calc(
            100% - 20px
        );

    box-sizing:
        border-box;

    padding:
        11px 14px;

    border-radius:
        16px;

    background:
        rgba(
            20,
            7,
            31,
            .97
        );

    border:
        1px solid
        rgba(
            255,
            173,
            34,
            .95
        );

    box-shadow:
        0 0 15px
        rgba(
            255,
            173,
            34,
            .4
        );

    opacity:
        0;

    pointer-events:
        none;

    z-index:
        110;

    transition:
        opacity .2s ease,
        width .25s ease,
        max-height .25s ease,
        transform .25s ease;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    cursor:
        pointer;

    user-select:
        none;

    -webkit-user-select:
        none;

    -webkit-tap-highlight-color:
        transparent;
}


.geoplay-destination.visible
{
    opacity:
        1;

    pointer-events:
        auto;
}


/* ==================================================
   COLLAPSED CARD
   ================================================== */

.geoplay-destination-collapsed
{
    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        12px;

    width:
        100%;
}


.geoplay-destination-collapsed-main
{
    min-width:
        0;

    flex:
        1;
}


.geoplay-destination-title
{
    display:
        block;

    color:
        #ffb52e;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            12px,
            3vw,
            15px
        );

    font-weight:
        800;

    letter-spacing:
        .2px;

    white-space:
        nowrap;

    overflow:
        hidden;

    text-overflow:
        ellipsis;
}


.geoplay-destination-info
{
    display:
        block;

    margin-top:
        4px;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            10px,
            2.5vw,
            12px
        );

    font-weight:
        700;

    color:
        #ffffff;

    white-space:
        nowrap;
}


.geoplay-destination-chevron
{
    flex:
        0 0 auto;

    width:
        24px;

    height:
        24px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    color:
        #ffb52e;

    font-size:
        20px;

    font-weight:
        800;

    line-height:
        1;

    transition:
        transform .2s ease;
}


.geoplay-destination:hover
.geoplay-destination-chevron
{
    transform:
        translateX(
            2px
        );
}


/* ==================================================
   EXPANDED CARD
   ================================================== */

.geoplay-destination.expanded
{
    width:
        min(
            88vw,
            360px
        );

    padding:
        13px;

    border-radius:
        18px;

    cursor:
        default;
}


.geoplay-destination-expanded-header
{
    display:
        flex;

    align-items:
        center;

    justify-content:
        space-between;

    gap:
        8px;

    width:
        100%;

    margin-bottom:
        10px;
}


.geoplay-destination-expanded-title
{
    min-width:
        0;

    flex:
        1;

    color:
        #ffb52e;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            13px,
            3.5vw,
            16px
        );

    font-weight:
        800;

    letter-spacing:
        .2px;

    white-space:
        nowrap;

    overflow:
        hidden;

    text-overflow:
        ellipsis;
}


.geoplay-destination-close
{
    flex:
        0 0 auto;

    width:
        34px;

    height:
        34px;

    padding:
        0;

    border:
        0;

    border-radius:
        50%;

    background:
        rgba(
            123,
            69,
            170,
            .24
        );

    color:
        #ffffff;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        18px;

    font-weight:
        600;

    line-height:
        1;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    cursor:
        pointer;

    -webkit-tap-highlight-color:
        transparent;
}


.geoplay-destination-close:active
{
    transform:
        scale(
            .92
        );
}


/* ==================================================
   EXPANDED IMAGE
   ================================================== */

.geoplay-destination-image
{
    display:
        block;

    width:
        100%;

    height:
        clamp(
            120px,
            31vw,
            155px
        );

    object-fit:
        cover;

    border-radius:
        13px;

    border:
        1px solid
        rgba(
            255,
            173,
            34,
            .45
        );

    box-shadow:
        0 0 10px
        rgba(
            255,
            173,
            34,
            .15
        );

    background:
        #160a24;
}


/* ==================================================
   EXPANDED DETAILS
   ================================================== */

.geoplay-destination-expanded-divider
{
    width:
        100%;

    height:
        1px;

    margin:
        11px 0;

    background:
        rgba(
            173,
            78,
            255,
            .35
        );
}


/* ==================================================
   DISTANCE + ADDRESS TWO-COLUMN LAYOUT
   ================================================== */

.geoplay-destination-expanded-details
{
    display:
        grid;

    grid-template-columns:
        minmax(
            0,
            1fr
        )
        minmax(
            0,
            1.35fr
        );

    column-gap:
        12px;

    align-items:
        start;

    width:
        100%;

    margin-bottom:
        13px;
}


/* ==================================================
   DISTANCE
   ================================================== */

.geoplay-destination-expanded-distance
{
    display:
        flex;

    align-items:
        center;

    gap:
        8px;

    min-width:
        0;

    color:
        #ffffff;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            11px,
            3vw,
            14px
        );

    font-weight:
        700;

    line-height:
        1.35;
}


.geoplay-destination-distance-icon
{
    flex:
        0 0 auto;

    width:
        26px;

    height:
        26px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    border-radius:
        50%;

    background:
        rgba(
            173,
            78,
            255,
            .18
        );

    color:
        #d6a8ff;

    font-size:
        14px;
}


/* ==================================================
   ADDRESS
   ================================================== */

.geoplay-destination-expanded-address
{
    display:
        flex;

    align-items:
        flex-start;

    gap:
        8px;

    min-width:
        0;

    color:
        #ffffff;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            10px,
            2.7vw,
            12px
        );

    font-weight:
        500;

    line-height:
        1.45;
}


.geoplay-destination-address-icon
{
    flex:
        0 0 auto;

    width:
        26px;

    height:
        26px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    border-radius:
        50%;

    background:
        rgba(
            173,
            78,
            255,
            .18
        );

    color:
        #d6a8ff;

    font-size:
        14px;
}


.geoplay-destination-address-text
{
    flex:
        1;

    min-width:
        0;

    overflow-wrap:
        break-word;

    word-break:
        normal;
}


/* ==================================================
   PLAY HERE BUTTON
   ================================================== */

.geoplay-destination-play
{
    width:
        100%;

    min-height:
        46px;

    padding:
        10px 16px;

    border:
        0;

    border-radius:
        23px;

    background:
        linear-gradient(
            90deg,
            #ff9418,
            #ffc34d
        );

    color:
        #281000;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            13px,
            3.3vw,
            16px
        );

    font-weight:
        800;

    letter-spacing:
        .2px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    gap:
        8px;

    cursor:
        pointer;

    box-shadow:
        0 5px 14px
        rgba(
            255,
            148,
            24,
            .24
        );

    -webkit-tap-highlight-color:
        transparent;
}


.geoplay-destination-play:active
{
    transform:
        scale(
            .97
        );
}


.geoplay-destination-play-arrow
{
    font-size:
        18px;

    line-height:
        1;
}


/* ==================================================
   OFF-SCREEN PINE RIDGE INDICATOR
   ================================================== */

.geoplay-destination-offscreen
{
    position:
        absolute;

    display:
        flex;

    align-items:
        center;

    gap:
        6px;

    padding:
        7px 11px;

    border-radius:
        14px;

    background:
        rgba(
            20,
            7,
            31,
            .95
        );

    border:
        1px solid
        rgba(
            255,
            173,
            34,
            .9
        );

    box-shadow:
        0 0 12px
        rgba(
            255,
            173,
            34,
            .35
        );

    opacity:
        0;

    pointer-events:
        none;

    z-index:
        115;

    transform:
        translate(
            -50%,
            -50%
        );

    transition:
        opacity .25s ease,
        box-shadow .15s ease;

    cursor:
        pointer;

    user-select:
        none;

    -webkit-user-select:
        none;

    -webkit-tap-highlight-color:
        transparent;

    font-family:
        'Poppins',
        Arial,
        sans-serif;
}


.geoplay-destination-offscreen.visible
{
    opacity:
        1;

    pointer-events:
        auto;
}


.geoplay-destination-offscreen:hover
{
    box-shadow:
        0 0 12px
        rgba(
            255,
            173,
            34,
            .55
        ),

        0 0 22px
        rgba(
            255,
            173,
            34,
            .2
        );
}


.geoplay-destination-offscreen:active
{
    transform:
        translate(
            -50%,
            -50%
        )
        scale(
            .94
        );
}


.geoplay-destination-offscreen-arrow
{
    width:
        20px;

    height:
        20px;

    display:
        inline-flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        16px;

    transform-origin:
        center center;
}


.geoplay-destination-offscreen-name
{
    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        11px;

    font-weight:
        800;

    letter-spacing:
        .3px;
}


/* ==================================================
   STORY ACTIONS
   ================================================== */

.geoplay-story-actions
{
    position:
        absolute;

    left:
        50%;

    bottom:
        clamp(
            70px,
            9vh,
            90px
        );

    width:
        min(
            88vw,
            360px
        );

    display:
        flex;

    flex-direction:
        row;

    align-items:
        center;

    justify-content:
        center;

    gap:
        10px;

    opacity:
        0;

    transform:
        translateX(
            -50%
        )
        translateY(
            8px
        );

    pointer-events:
        none;

    transition:
        opacity .45s ease,
        transform .45s ease;

    z-index:
        120;
}


.geoplay-story-actions.visible
{
    opacity:
        1;

    transform:
        translateX(
            -50%
        )
        translateY(
            0
        );

    pointer-events:
        none;
}


.geoplay-story-action
{
    flex:
        1 1 0;

    min-width:
        0;

    min-height:
        44px;

    padding:
        10px 18px;

    border:
        0;

    border-radius:
        23px;

    background:
        linear-gradient(
            90deg,
            #ff9418,
            #ffc34d
        );

    color:
        #281000;

    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            12px,
            3vw,
            15px
        );

    font-weight:
        800;

    letter-spacing:
        .2px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    cursor:
        default;

    box-shadow:
        0 5px 14px
        rgba(
            255,
            148,
            24,
            .24
        );

    -webkit-tap-highlight-color:
        transparent;

    transition:
        none;
}


.geoplay-story-action:active
{
    transform:
        none;
}


.geoplay-story-action-browse
{
    background:
        linear-gradient(
            90deg,
            #8b42d8,
            #b66cff
        );

    color:
        #ffffff;

    box-shadow:
        0 5px 14px
        rgba(
            139,
            66,
            216,
            .25
        );
}


/* ==================================================
   SMALL SCREEN
   ================================================== */

@media (max-width:430px)
{
    .geoplay-destination
    {
        width:
            min(
                72vw,
                265px
            );
    }


    .geoplay-destination.expanded
    {
        width:
            calc(
                100vw -
                24px
            );

        max-width:
            340px;

        padding:
            12px;
    }


    .geoplay-destination-image
    {
        height:
            125px;
    }


    .geoplay-destination-expanded-details
    {
        grid-template-columns:
            minmax(
                0,
                0.9fr
            )
            minmax(
                0,
                1.3fr
            );

        column-gap:
            9px;
    }


    .geoplay-destination-expanded-distance
    {
        gap:
            6px;

        font-size:
            10px;
    }


    .geoplay-destination-expanded-address
    {
        gap:
            6px;

        font-size:
            10px;
    }


    .geoplay-destination-distance-icon,
    .geoplay-destination-address-icon
    {
        width:
            24px;

        height:
            24px;

        font-size:
            13px;
    }


    .geoplay-destination-offscreen
    {
        padding:
            8px 12px;
    }


    .geoplay-destination-offscreen-name
    {
        font-size:
            11px;
    }


    .geoplay-story-actions
    {
        width:
            calc(
                100vw -
                32px
            );

        max-width:
            360px;

        bottom:
            120px;

        gap:
            8px;
    }


    .geoplay-story-action
    {
        min-height:
            43px;

        padding:
            10px 10px;

        font-size:
            11px;
    }
}


/* ==================================================
   LARGER VIEWPORT
   ================================================== */

@media (min-width:431px)
{
    .geoplay-destination.expanded
    {
        width:
            min(
                88vw,
                360px
            );
    }


    .geoplay-destination-image
    {
        height:
            155px;
    }


    .geoplay-story-actions
    {
        width:
            min(
                68vw,
                300px
            );

        bottom:
            95px;
    }
}

`;


    document.head.appendChild(
        style
    );
}


// ==================================================
// CREATE SEARCH VISUAL
// ==================================================

function geoplayMapUICreateSearchVisual()
{
    var visual =
        document.createElement(
            "div"
        );


    visual.id =
        "geoplay-search-visual";


    visual.className =
        "geoplay-search-visual";


    var robot =
        document.createElement(
            "img"
        );


    robot.className =
        "geoplay-search-robot";


    robot.src =
        "datafiles/robot_searching_map.png";


    robot.alt =
        "Geoplay robot searching";


    visual.appendChild(
        robot
    );


    window.geoplaySearchRobot =
        robot;


    window.geoplayMapUI.appendChild(
        visual
    );
}


// ==================================================
// CREATE DESTINATION CARD
// ==================================================

function geoplayMapUICreateDestinationCard()
{
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


    geoplayMapUIPositionDestination();


    console.log(
        "GEOPLAY UI: Pine Ridge information card collapsed."
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


    geoplayMapUICollapseDestination();


    geoplayMapUIGoToDestination();


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
// CREATE STORY ACTIONS
// ==================================================

function geoplayMapUICreateStoryActions()
{
    var actions =
        document.createElement(
            "div"
        );


    actions.id =
        "geoplay-story-actions";


    actions.className =
        "geoplay-story-actions";


    var findAnother =
        document.createElement(
            "button"
        );


    findAnother.type =
        "button";


    findAnother.className =
        "geoplay-story-action";


    findAnother.textContent =
        "FIND ANOTHER";


    var browse =
        document.createElement(
            "button"
        );


    browse.type =
        "button";


    browse.className =
        "geoplay-story-action " +
        "geoplay-story-action-browse";


    browse.textContent =
        "BROWSE";


    actions.appendChild(
        findAnother
    );


    actions.appendChild(
        browse
    );


    window.geoplayMapUI.appendChild(
        actions
    );
}


// ==================================================
// SEARCH
// ==================================================

function geoplayMapUIStartSearchAnimation()
{
    var visual =
        document.getElementById(
            "geoplay-search-visual"
        );


    if (!visual)
    {
        return 0;
    }


    window.geoplaySearchVisible =
        true;


    visual.classList.add(
        "visible"
    );


    return 1;
}


function geoplayMapUIStopSearchAnimation()
{
    var visual =
        document.getElementById(
            "geoplay-search-visual"
        );


    if (visual)
    {
        visual.classList.remove(
            "visible"
        );
    }


    window.geoplaySearchVisible =
        false;


    return 1;
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
            window.geoplayDestinationExpanded
        )
        {
            if (
                point.y -
                cardHeight -
                18 >=
                10
            )
            {
                top =
                    point.y -
                    18;


                card.style.transform =
                    "translate(-50%,-100%)";
            }
            else
            {
                top =
                    point.y +
                    18;


                card.style.transform =
                    "translate(-50%,0)";
            }
        }
        else
        {
            if (
                point.y -
                cardHeight -
                12 <
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
                    12;


                card.style.transform =
                    "translate(-50%,-100%)";
            }
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
    if (
        window.geoplayDialogueHideTimer
    )
    {
        clearTimeout(
            window.geoplayDialogueHideTimer
        );

        window.geoplayDialogueHideTimer =
            null;
    }


    if (
        window.geoplayDialogueTypingTimer
    )
    {
        clearTimeout(
            window.geoplayDialogueTypingTimer
        );

        window.geoplayDialogueTypingTimer =
            null;
    }


    window.geoplayDialogueTypingToken =
        window.geoplayDialogueTypingToken +
        1;


    var dialogue =
        document.getElementById(
            "geoplay-dialogue"
        );


    if (dialogue)
    {
        dialogue.classList.remove(
            "destination-arrival"
        );

        dialogue.classList.remove(
            "visible"
        );
    }


    var text =
        document.getElementById(
            "geoplay-dialogue-text"
        );


    if (text)
    {
        text.textContent =
            "";
    }


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


// ==================================================
// SHOW STORY ACTIONS
// ==================================================

function geoplayMapUIShowStoryActions()
{
    var actions =
        document.getElementById(
            "geoplay-story-actions"
        );


    if (actions)
    {
        actions.classList.add(
            "visible"
        );
    }


    return 1;
}


// ==================================================
// HIDE STORY ACTIONS
// ==================================================

function geoplayMapUIHideStoryActions()
{
    var actions =
        document.getElementById(
            "geoplay-story-actions"
        );


    if (actions)
    {
        actions.classList.remove(
            "visible"
        );
    }


    return 1;
}


// ==================================================
// LEGACY CONTINUE COMPATIBILITY
// ==================================================

function geoplayMapUIShowContinue()
{
    return geoplayMapUIShowStoryActions();
}


function geoplayMapUIHideContinue()
{
    return geoplayMapUIHideStoryActions();
}