// ==================================================
// GEOPLAY MAP UI
// ==================================================
//
// RESPONSIBILITY:
// - Robot dialogue
// - Player found effect
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

window.geoplayPlayerFoundEffectActive = false;

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

    geoplayMapUICreatePlayerFoundEffect();

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

#geoplay-map-ui
{
    font-family: Arial, sans-serif;
    color: #ffffff;
}


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
        min(
            86vw,
            420px
        );

    box-sizing:
        border-box;

    padding:
        11px 18px;

    border-radius:
        18px;

    background:
        rgba(
            12,
            5,
            32,
            .94
        );

    border:
        1px solid
        rgba(
            173,
            78,
            255,
            .82
        );

    box-shadow:
        0 0 14px
        rgba(
            155,
            65,
            230,
            .35
        );

    text-align:
        center;

    opacity:
        0;

    transform:
        translate(
            -50%,
            8px
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


.geoplay-dialogue-text
{
    font-size:
        clamp(
            14px,
            3.5vw,
            18px
        );

    font-weight:
        800;

    line-height:
        1.25;
}


/* ==================================================
   PLAYER FOUND RADIAL EFFECT
   ================================================== */

.geoplay-player-found-effect
{
    position:
        absolute;

    width:
        62px;

    height:
        62px;

    border-radius:
        50%;

    border:
        3px solid
        rgba(
            39,
            186,
            255,
            .95
        );

    box-shadow:
        0 0 12px
        rgba(
            39,
            186,
            255,
            .9
        ),

        0 0 30px
        rgba(
            39,
            186,
            255,
            .5
        );

    transform:
        translate(
            -50%,
            -50%
        )
        scale(
            .45
        );

    opacity:
        0;

    pointer-events:
        none;

    z-index:
        90;
}


.geoplay-player-found-effect.active
{
    animation:
        geoplayPlayerFoundPulse
        1.5s
        ease-out
        forwards;
}


@keyframes geoplayPlayerFoundPulse
{
    0%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                .45
            );

        opacity:
            .9;
    }


    45%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                1.2
            );

        opacity:
            .7;
    }


    100%
    {
        transform:
            translate(
                -50%,
                -50%
            )
            scale(
                2
            );

        opacity:
            0;
    }
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


.geoplay-search-radar
{
    position:
        absolute;

    width:
        48px;

    height:
        48px;

    border-radius:
        50%;

    border:
        2px solid
        rgba(
            70,
            210,
            255,
            .9
        );

    box-shadow:
        0 0 12px
        rgba(
            70,
            210,
            255,
            .75
        );

    transform:
        translate(
            -50%,
            -50%
        );
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

    font-size:
        clamp(
            12px,
            3vw,
            15px
        );

    font-weight:
        900;

    white-space:
        nowrap;
}


.geoplay-destination-info
{
    display:
        block;

    margin-top:
        4px;

    font-size:
        clamp(
            10px,
            2.5vw,
            12px
        );

    font-weight:
        700;

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
    font-size:
        11px;

    font-weight:
        900;

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

    font-size:
        clamp(
            13px,
            3vw,
            16px
        );

    font-weight:
        900;

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
            calc(
                100% - 28px
            );

        bottom:
            112px;
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
// CREATE PLAYER FOUND EFFECT
// ==================================================

function geoplayMapUICreatePlayerFoundEffect()
{
    var effect =
        document.createElement(
            "div"
        );


    effect.id =
        "geoplay-player-found-effect";


    effect.className =
        "geoplay-player-found-effect";


    window.geoplayMapUI.appendChild(
        effect
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


    var radar =
        document.createElement(
            "div"
        );


    radar.id =
        "geoplay-search-radar";


    radar.className =
        "geoplay-search-radar";


    visual.appendChild(
        radar
    );


    window.geoplaySearchRadar =
        radar;


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


    // --------------------------------------------------
    // CLICK
    // --------------------------------------------------

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


    // --------------------------------------------------
    // TOUCH
    // --------------------------------------------------

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
// PLAYER FOUND EFFECT
// ==================================================

function geoplayMapUIShowPlayerFoundEffect()
{
    var effect =
        document.getElementById(
            "geoplay-player-found-effect"
        );


    if (!effect)
    {
        return 0;
    }


    geoplayMapUIPositionPlayerFoundEffect();


    effect.classList.remove(
        "active"
    );


    void effect.offsetWidth;


    effect.classList.add(
        "active"
    );


    window.geoplayPlayerFoundEffectActive =
        true;


    setTimeout(
        function()
        {
            effect.classList.remove(
                "active"
            );


            window.geoplayPlayerFoundEffectActive =
                false;
        },
        1600
    );


    return 1;
}


function geoplayMapUIPositionPlayerFoundEffect()
{
    if (
        !window.geoplayMap
    )
    {
        return;
    }


    var effect =
        document.getElementById(
            "geoplay-player-found-effect"
        );


    if (!effect)
    {
        return;
    }


    var point =
        window.geoplayMap.project(
        [
            geoplayMapLongitude,
            geoplayMapLatitude
        ]);


    effect.style.left =
        point.x +
        "px";


    effect.style.top =
        point.y +
        "px";
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


    geoplayMapUIPositionSearchRadar();


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


function geoplayMapUIPositionSearchRadar()
{
    if (
        !window.geoplayMap ||
        !window.geoplaySearchRadar
    )
    {
        return;
    }


    var point =
        window.geoplayMap.project(
        [
            geoplayMapLongitude,
            geoplayMapLatitude
        ]);


    window.geoplaySearchRadar.style.left =
        point.x +
        "px";


    window.geoplaySearchRadar.style.top =
        point.y +
        "px";
}


// ==================================================
// SHOW DESTINATION
// ==================================================
//
// This activates the destination presentation.
//
// PositionDestination() immediately decides whether
// Pine Ridge is visible.
//
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
//
// DESTINATION VISIBLE:
//
//     Card appears directly at destination.
//
// DESTINATION OFF-SCREEN:
//
//     Card disappears.
//
//     Edge indicator appears.
//
//     Arrow points toward destination.
//
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


    // --------------------------------------------------
    // Project Pine Ridge's geographic coordinates into
    // the CURRENT viewport.
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Is Pine Ridge actually visible?
    // --------------------------------------------------

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


        // Hide edge indicator.

        indicator.classList.remove(
            "visible"
        );


        // Show Pine Ridge card.

        card.classList.add(
            "visible"
        );


        // --------------------------------------------------
        // Measure card.
        // --------------------------------------------------

        var cardWidth =
            card.offsetWidth;


        var cardHeight =
            card.offsetHeight;


        // --------------------------------------------------
        // Card starts directly above Pine Ridge.
        // --------------------------------------------------

        var left =
            point.x;


        var top =
            point.y -
            12;


        var halfWidth =
            cardWidth /
            2;


        // --------------------------------------------------
        // Keep card inside horizontal viewport.
        // --------------------------------------------------

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


        // --------------------------------------------------
        // Normally place card ABOVE destination.
        //
        // If there isn't room above, place it BELOW.
        // --------------------------------------------------

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


        // --------------------------------------------------
        // Final vertical safety.
        // --------------------------------------------------

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

    // Hide Pine Ridge card.

    card.classList.remove(
        "visible"
    );


    // Show edge indicator.

    indicator.classList.add(
        "visible"
    );


    window.geoplayDestinationOffscreen =
        true;


    // --------------------------------------------------
    // Viewport center.
    // --------------------------------------------------

    var centerX =
        width /
        2;


    var centerY =
        height /
        2;


    // --------------------------------------------------
    // Direction from center toward Pine Ridge.
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Determine which edge Pine Ridge is toward.
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Keep indicator inside viewport.
    // --------------------------------------------------

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


    // --------------------------------------------------
    // Rotate arrow toward Pine Ridge.
    // --------------------------------------------------

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
        window.geoplayPlayerFoundEffectActive
    )
    {
        geoplayMapUIPositionPlayerFoundEffect();
    }


    if (
        window.geoplaySearchVisible
    )
    {
        geoplayMapUIPositionSearchRadar();
    }


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
    // --------------------------------------------------
    // Never allow this to interrupt the story.
    // --------------------------------------------------

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