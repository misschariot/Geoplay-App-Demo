// ==================================================
// GEOPLAY MAP DIALOGUE
// ROBOT DIALOGUE + TYPING SYSTEM
// ==================================================
//
// RESPONSIBILITY:
// - Robot dialogue
// - Dialogue creation
// - Robot head
// - Dialogue text
// - Typing effect
// - Typing timer/state
// - Auto-hide
// - Special destination-arrival dialogue
//
// DEPENDENCY:
// - geoplay_map_ui.js
//
// The dialogue system uses the shared
// window.geoplayMapUI container created by
// geoplay_map_ui.js.
//
// ==================================================


// ==================================================
// DIALOGUE AUTO-HIDE TIMER
// ==================================================
//
// Used for short destination-arrival messages such as
// "There it is!" so they do not remain on screen.
// ==================================================

window.geoplayDialogueHideTimer = null;


// ==================================================
// DIALOGUE TYPING STATE
// ==================================================
//
// The dialogue text is revealed one character at a time.
// The text element uses its natural content width so the
// dialogue box can grow with the message, up to its
// existing responsive maximum width.
// ==================================================

window.geoplayDialogueTypingTimer = null;

window.geoplayDialogueTypingToken = 0;


// ==================================================
// DIALOGUE STYLES
// ==================================================
//
// These styles were previously inside
// geoplayMapUIAddStyles().
//
// They are now owned by the dialogue system.
// ==================================================

function geoplayMapDialogueAddStyles()
{
    if (
        document.getElementById(
            "geoplay-map-dialogue-styles"
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
        "geoplay-map-dialogue-styles";


    style.textContent = `

/* ==================================================
   ROBOT DIALOGUE
   ================================================== */

.geoplay-dialogue
{
    position:
        absolute;

    left:
        calc(
            50% +
            28px
        );

    bottom:
        clamp(
            112px,
            15vh,
            145px
        );

    width:
        max-content;

    min-width:
        220px;

    max-width:
        min(
            82vw,
            430px
        );

    min-height:
        68px;

    box-sizing:
        border-box;

    padding:
        10px 24px;

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

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

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
        transform .35s ease,
        width .18s ease,
        min-height .12s ease;

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
   DESTINATION ARRIVAL DIALOGUE
   ==================================================
   "There it is!" sits higher than normal narration so
   it stays clearly above the story action buttons.
*/

.geoplay-dialogue.destination-arrival
{
    bottom:
        205px;
}


/* ==================================================
   ROBOT HEAD
   ================================================== */

.geoplay-dialogue-robot
{
    position:
        absolute;

    left:
        -52px;

    top:
        50%;

    width:
        78px;

    height:
        78px;

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
    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    width:
        fit-content;

    max-width:
        calc(
            82vw -
            48px
        );

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
   SMALL SCREEN
   ================================================== */

@media (max-width:430px)
{
    .geoplay-dialogue
    {
        left:
            calc(
                50% +
                24px
            );

        width:
            max-content;

        min-width:
            210px;

        max-width:
            calc(
                100% -
                76px
            );

        min-height:
            68px;

        bottom:
            112px;

        padding:
            9px 16px;

        border-radius:
            18px;
    }


    .geoplay-dialogue.destination-arrival
    {
        bottom:
            205px;
    }


    .geoplay-dialogue-robot
    {
        left:
            -48px;

        width:
            70px;

        height:
            70px;
    }


    .geoplay-dialogue-text
    {
        width:
            fit-content;

        max-width:
            calc(
                100vw -
                108px
            );

        font-size:
            clamp(
                12px,
                3.35vw,
                15px
            );

        line-height:
            1.42;
    }
}


/* ==================================================
   LARGER VIEWPORT
   ================================================== */

@media (min-width:431px)
{
    .geoplay-dialogue
    {
        left:
            calc(
                50% +
                34px
            );

        min-width:
            240px;

        min-height:
            90px;

        padding:
            13px 24px;
    }


    .geoplay-dialogue.destination-arrival
    {
        bottom:
            215px;
    }


    .geoplay-dialogue-robot
    {
        left:
            -58px;

        width:
            82px;

        height:
            82px;
    }


    .geoplay-dialogue-text
    {
        max-width:
            min(
                72vw,
                370px
            );

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
    // ==================================================
    // MAKE SURE DIALOGUE STYLES EXIST
    // ==================================================

    geoplayMapDialogueAddStyles();


    // ==================================================
    // CREATE DIALOGUE CONTAINER
    // ==================================================

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


    // ==================================================
    // ADD TO MAP UI
    // ==================================================

    if (
        window.geoplayMapUI
    )
    {
        window.geoplayMapUI.appendChild(
            dialogue
        );
    }
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
        if (
            typeof geoplayMapUICreate ===
            "function"
        )
        {
            geoplayMapUICreate();
        }
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


    // ==================================================
    // CANCEL PREVIOUS TYPING
    // ==================================================

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


    // ==================================================
    // CANCEL PREVIOUS AUTO-HIDE
    // ==================================================

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


    // ==================================================
    // NEW TYPING TOKEN
    // ==================================================
    //
    // Every new message gets a unique token.
    // If an older timer fires later, it will be ignored.
    // ==================================================

    window.geoplayDialogueTypingToken =
        window.geoplayDialogueTypingToken +
        1;


    var typingToken =
        window.geoplayDialogueTypingToken;


    // ==================================================
    // RESET ARRIVAL POSITION
    // ==================================================

    dialogue.classList.remove(
        "destination-arrival"
    );


    // ==================================================
    // CLEAR CURRENT TEXT
    // ==================================================

    text.textContent =
        "";


    // ==================================================
    // NO MESSAGE
    // ==================================================

    if (
        !message
    )
    {
        dialogue.classList.remove(
            "visible"
        );

        return 1;
    }


    // ==================================================
    // DETERMINE SPECIAL ARRIVAL MESSAGE
    // ==================================================

    var isArrivalMessage =
        String(message)
            .trim()
            .toLowerCase() ===
        "there it is!";


    if (
        isArrivalMessage
    )
    {
        dialogue.classList.add(
            "destination-arrival"
        );
    }


    // ==================================================
    // SHOW DIALOGUE
    // ==================================================

    dialogue.classList.add(
        "visible"
    );


    // ==================================================
    // TYPING SETTINGS
    // ==================================================

    var fullMessage =
        String(message);


    var characterIndex =
        0;


    var typingSpeed =
        32;


    // ==================================================
    // TYPE NEXT CHARACTER
    // ==================================================

    function typeNextCharacter()
    {
        // ==================================================
        // IGNORE OLD TYPING SEQUENCE
        // ==================================================

        if (
            typingToken !==
            window.geoplayDialogueTypingToken
        )
        {
            return;
        }


        // ==================================================
        // FINISHED
        // ==================================================

        if (
            characterIndex >=
            fullMessage.length
        )
        {
            window.geoplayDialogueTypingTimer =
                null;


            // ==================================================
            // AUTO-HIDE "THERE IT IS!"
            // ==================================================

            if (
                isArrivalMessage
            )
            {
                window.geoplayDialogueHideTimer =
                    setTimeout(
                        function()
                        {
                            if (
                                typingToken !==
                                window.geoplayDialogueTypingToken
                            )
                            {
                                return;
                            }


                            dialogue.classList.remove(
                                "visible"
                            );


                            dialogue.classList.remove(
                                "destination-arrival"
                            );


                            window.geoplayDialogueHideTimer =
                                null;
                        },
                        2200
                    );
            }


            return;
        }


        // ==================================================
        // ADD NEXT CHARACTER
        // ==================================================

        text.textContent =
            fullMessage.substring(
                0,
                characterIndex +
                1
            );


        characterIndex =
            characterIndex +
            1;


        // ==================================================
        // CONTINUE TYPING
        // ==================================================

        window.geoplayDialogueTypingTimer =
            setTimeout(
                typeNextCharacter,
                typingSpeed
            );
    }


    // ==================================================
    // START TYPING
    // ==================================================

    typeNextCharacter();


    return 1;
}