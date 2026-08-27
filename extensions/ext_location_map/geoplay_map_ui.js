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


    // ==================================================
    // DIALOGUE
    // ==================================================

    geoplayMapUICreateDialogue();


    // ==================================================
    // SEARCH
    // ==================================================

    geoplayMapUICreateSearchVisual();


    // ==================================================
    // DESTINATION
    // ==================================================

    geoplayMapUICreateDestinationCard();

    geoplayMapUICreateOffscreenIndicator();


    // ==================================================
    // STORY ACTIONS
    // ==================================================

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
// Dialogue styles are now owned by:
// geoplay_map_dialogue.js
//
// Destination JavaScript is now owned by:
// geoplay_map_destination.js
//
// Destination CSS remains here temporarily.
// We will move it into geoplay_map.css later.
//
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