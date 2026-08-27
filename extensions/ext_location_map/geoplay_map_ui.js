// ==================================================
// GEOPLAY MAP UI
// ==================================================
//
// RESPONSIBILITY:
// - Robot dialogue
// - Searching visual
// - Pine Ridge destination card
// - Pine Ridge off-screen indicator
// - Continue button
//
// DESTINATION BEHAVIOR:
//
// DESTINATION VISIBLE
//      ↓
// Pine Ridge card appears at destination.
//
// DESTINATION OFF-SCREEN
//      ↓
// Pine Ridge card disappears.
// Pine Ridge edge indicator appears.
//
// This remains active after the story finishes.
// ==================================================


window.geoplayMapUI = null;

window.geoplayMapUIInitialized = false;

window.geoplaySearchVisible = false;

window.geoplayDestinationVisible = false;

window.geoplayDestinationOffscreen = false;


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

    geoplayMapUICreateContinue();


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
   ROBOT DIALOGUE
   ================================================== */

.geoplay-dialogue
{
    position:
        absolute;

    left:
        50%;

    bottom:
        clamp(
            112px,
            15vh,
            145px
        );

    width:
        fit-content;

    min-width:
        270px;

    max-width:
        min(
            88vw,
            430px
        );

    min-height:
        84px;

    box-sizing:
        border-box;

    padding:
        12px 18px 12px 92px;

    border-radius:
        20px;

    background:
        linear-gradient(
            135deg,
            rgba(
                18,
                8,
                42,
                .97
            ),
            rgba(
                11,
                5,
                29,
                .97
            )
        );

    border:
        1px solid
        rgba(
            173,
            78,
            255,
            .78
        );

    box-shadow:
        0 0 14px
        rgba(
            155,
            65,
            230,
            .32
        ),
        0 8px 24px
        rgba(
            0,
            0,
            0,
            .30
        );

    text-align:
        center;

    opacity:
        0;

    transform:
        translate(
            -50%,
            10px
        );

    transition:
        opacity .35s ease,
        transform .35s ease;

    z-index:
        100;
}


.geoplay-dialogue.visible
{
    opacity:
        1;

    transform:
        translate(
            -50%,
            0
        );
}


/* ==================================================
   ROBOT HEAD
   ================================================== */

.geoplay-dialogue-robot
{
    position:
        absolute;

    left:
        10px;

    top:
        50%;

    width:
        72px;

    height:
        72px;

    object-fit:
        contain;

    display:
        block;

    transform:
        translateY(
            -50%
        )
        scale(
            .82
        );

    transform-origin:
        center center;

    opacity:
        0;

    filter:
        drop-shadow(
            0 0 7px
            rgba(
                173,
                78,
                255,
                .38
            )
        );

    transition:
        opacity .35s ease .08s,
        transform .45s
        cubic-bezier(
            .22,
            1.25,
            .36,
            1
        );

    pointer-events:
        none;

    user-select:
        none;

    -webkit-user-drag:
        none;

    z-index:
        3;
}


.geoplay-dialogue.visible
.geoplay-dialogue-robot
{
    opacity:
        1;

    transform:
        translateY(
            -50%
        )
        scale(
            1
        );
}


/* ==================================================
   DIALOGUE TEXT
   ================================================== */

.geoplay-dialogue-text
{
    font-family:
        'Poppins',
        Arial,
        sans-serif;

    font-size:
        clamp(
            13px,
            3.25vw,
            17px
        );

    font-weight:
        600;

    line-height:
        1.45;

    letter-spacing:
        .05px;

    color:
        #ffffff;

    text-align:
        center;

    overflow-wrap:
        break-word;
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
            .96
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
        opacity .2s ease;

    font-family:
        'Poppins',
        Arial,
        sans-serif;
}


.geoplay-destination.visible
{
    opacity:
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
        600;

    white-space:
        nowrap;
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
   CONTINUE
   ================================================== */

.geoplay-continue
{
    position:
        absolute;

    left:
        50%;

    bottom:
        clamp(
            22px,
            4vh,
            42px
        );

    width:
        min(
            58vw,
            220px
        );

    min-height:
        44px;

    padding:
        10px 20px;

    border:
        0;

    border-radius:
        25px;

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
            3vw,
            16px
        );

    font-weight:
        800;

    letter-spacing:
        .2px;

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


.geoplay-continue.visible
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
        auto;
}


/* ==================================================
   SMALL SCREEN
   ================================================== */

@media (max-width:430px)
{
    .geoplay-dialogue
    {
        width:
            fit-content;

        min-width:
            270px;

        max-width:
            calc(
                100% - 24px
            );

        min-height:
            78px;

        bottom:
            112px;

        padding:
            11px 14px 11px 86px;

        border-radius:
            18px;
    }


    .geoplay-dialogue-robot
    {
        left:
            7px;

        width:
            68px;

        height:
            68px;
    }


    .geoplay-dialogue-text
    {
        font-size:
            clamp(
                12px,
                3.35vw,
                15px
            );

        line-height:
            1.42;
    }


    .geoplay-destination
    {
        width:
            min(
                72vw,
                265px
            );
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
}


/* ==================================================
   LARGER VIEWPORT
   ================================================== */

@media (min-width:431px)
{
    .geoplay-dialogue
    {
        min-height:
            90px;

        padding:
            13px 20px 13px 98px;
    }


    .geoplay-dialogue-robot
    {
        left:
            10px;

        width:
            78px;

        height:
            78px;
    }


    .geoplay-dialogue-text
    {
        font-size:
            clamp(
                15px,
                2.25vw,
                18px
            );

        line-height:
            1.45;
    }
}

`;


    document.head.appendChild(
        style
    );
}


// ==================================================
// CREATE DIALOGUE
// ==================================================

function geoplayMapUICreateDialogue()
{
    var dialogue =
        document.createElement(
            "div"
        );


    dialogue.id =
        "geoplay-dialogue";


    dialogue.className =
        "geoplay-dialogue";


    // ==================================================
    // ROBOT HEAD
    // ==================================================

    var robot =
        document.createElement(
            "img"
        );


    robot.id =
        "geoplay-dialogue-robot";


    robot.className =
        "geoplay-dialogue-robot";


    robot.src =
        "https://pub-7bad344aee1845d9b50489f2add5b7f7.r2.dev/geoplay_robot_head.png";


    robot.alt =
        "Geoplay robot";


    robot.draggable =
        false;


    robot.onload =
        function()
        {
            console.log(
                "GEOPLAY UI: Robot dialogue head loaded from Cloudflare R2."
            );
        };


    robot.onerror =
        function(error)
        {
            console.error(
                "GEOPLAY UI: Robot dialogue head FAILED to load from Cloudflare R2.",
                error
            );
        };


    dialogue.appendChild(
        robot
    );


    window.geoplayDialogueRobot =
        robot;


    // ==================================================
    // TEXT
    // ==================================================

    var text =
        document.createElement(
            "div"
        );


    text.id =
        "geoplay-dialogue-text";


    text.className =
        "geoplay-dialogue-text";


    dialogue.appendChild(
        text
    );


    window.geoplayMapUI.appendChild(
        dialogue
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


    card.innerHTML =
        "<span class='geoplay-destination-title'>" +
        "📍 PINE RIDGE CASINO" +
        "</span>" +

        "<span class='geoplay-destination-info'>" +
        "2.4 MI AWAY&nbsp;&nbsp;•&nbsp;&nbsp;~7 MIN" +
        "</span>";


    window.geoplayMapUI.appendChild(
        card
    );
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
// CREATE CONTINUE
// ==================================================

function geoplayMapUICreateContinue()
{
    var button =
        document.createElement(
            "button"
        );


    button.id =
        "geoplay-continue";


    button.className =
        "geoplay-continue";


    button.type =
        "button";


    button.textContent =
        "CONTINUE  →";


    button.addEventListener(
        "click",
        function()
        {
            console.log(
                "GEOPLAY UI: Continue clicked."
            );


            if (
                typeof
                window.gml_Script_gmcallback_geoplay_location_continue
                ===
                "function"
            )
            {
                window.gml_Script_gmcallback_geoplay_location_continue();
            }
        }
    );


    window.geoplayMapUI.appendChild(
        button
    );
}


// ==================================================
// SAY
// ==================================================

function geoplayMapUISay(
    message,
    unused
)
{
    if (
        !window.geoplayMapUI
    )
    {
        geoplayMapUICreate();
    }


    var dialogue =
        document.getElementById(
            "geoplay-dialogue"
        );


    var text =
        document.getElementById(
            "geoplay-dialogue-text"
        );


    if (
        !dialogue ||
        !text
    )
    {
        return 0;
    }


    text.textContent =
        message ||
        "";


    if (message)
    {
        dialogue.classList.add(
            "visible"
        );
    }
    else
    {
        dialogue.classList.remove(
            "visible"
        );
    }


    return 1;
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


    // ==================================================
    // DESTINATION IS VISIBLE
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


        var top =
            point.y -
            12;


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


    return 1;
}


// ==================================================
// UPDATE POSITIONS
// ==================================================
//
// Called by the MapLibre "move" event.
//
// This is what keeps the destination presentation
// synchronized with the camera.
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
// CONTINUE
// ==================================================

function geoplayMapUIShowContinue()
{
    var button =
        document.getElementById(
            "geoplay-continue"
        );


    if (button)
    {
        button.classList.add(
            "visible"
        );
    }


    return 1;
}


function geoplayMapUIHideContinue()
{
    var button =
        document.getElementById(
            "geoplay-continue"
        );


    if (button)
    {
        button.classList.remove(
            "visible"
        );
    }


    return 1;
}