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
// - Natural reading pause
// - Special destination-arrival dialogue
// - Event-driven dialogue visibility
//
// DEPENDENCY:
// - geoplay_map_ui.js
//
// ==================================================


// ==================================================
// DIALOGUE STATE
// ==================================================

window.geoplayDialogueTypingTimer =
    null;


window.geoplayDialogueHideTimer =
    null;


window.geoplayDialogueTypingToken =
    0;


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
    // IMPORTANT:
    // START COMPLETELY HIDDEN
    // ==================================================

    dialogue.style.visibility =
        "hidden";


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
// HIDE DIALOGUE
// ==================================================
//
// This hides the dialogue visually for a map event.
//
// IMPORTANT:
// - Does NOT cancel the current story callback.
// - Does NOT change the typing token.
// - Does NOT destroy the dialogue.
// - Does NOT clear the current text.
//
// The flow can therefore hide the robot while a visual
// event plays, then call geoplayMapUISay() later.
//
// ==================================================

function geoplayMapUIHideDialogue()
{
    var dialogue =
        document.getElementById(
            "geoplay-dialogue"
        );


    if (
        !dialogue
    )
    {
        return 0;
    }


    dialogue.classList.remove(
        "visible"
    );


    dialogue.style.visibility =
        "hidden";


    console.log(
        "GEOPLAY UI: Dialogue hidden for visual event."
    );


    return 1;
}


// ==================================================
// SHOW DIALOGUE
// ==================================================

function geoplayMapUIShowDialogue()
{
    var dialogue =
        document.getElementById(
            "geoplay-dialogue"
        );


    if (
        !dialogue
    )
    {
        return 0;
    }


    dialogue.style.visibility =
        "visible";


    dialogue.classList.add(
        "visible"
    );


    return 1;
}


// ==================================================
// CALCULATE NATURAL READING PAUSE
// ==================================================

function geoplayMapUIDialogueReadingPause(
    message
)
{
    var length =
        String(message).length;


    var pause =
        900 +
        (
            length *
            22
        );


    pause =
        Math.max(
            1100,
            pause
        );


    pause =
        Math.min(
            2800,
            pause
        );


    return pause;
}


// ==================================================
// SAY
// ==================================================
//
// The callback belongs to this specific invocation of
// geoplayMapUISay() rather than relying on a shared
// callback variable.
//
// ==================================================

function geoplayMapUISay(
    message,
    onComplete
)
{
    // ==================================================
    // MAKE SURE UI EXISTS
    // ==================================================

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


    // ==================================================
    // FIND DIALOGUE
    // ==================================================

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
        console.error(
            "GEOPLAY UI: Dialogue element is unavailable."
        );


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
    // CANCEL PREVIOUS READING PAUSE
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

    window.geoplayDialogueTypingToken =
        window.geoplayDialogueTypingToken +
        1;


    var typingToken =
        window.geoplayDialogueTypingToken;


    // ==================================================
    // CLEAR TEXT
    // ==================================================

    text.textContent =
        "";


    // ==================================================
    // RESET ARRIVAL STYLE
    // ==================================================

    dialogue.classList.remove(
        "destination-arrival"
    );


    // ==================================================
    // EMPTY MESSAGE
    // ==================================================

    if (
        !message
    )
    {
        dialogue.classList.remove(
            "visible"
        );


        dialogue.style.visibility =
            "hidden";


        return 1;
    }


    // ==================================================
    // NORMALIZE MESSAGE
    // ==================================================

    var fullMessage =
        String(message);


    // ==================================================
    // DESTINATION ARRIVAL
    // ==================================================

    var isArrivalMessage =
        fullMessage
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

    dialogue.style.visibility =
        "visible";


    dialogue.classList.add(
        "visible"
    );


    // ==================================================
    // TYPING SETTINGS
    // ==================================================

    var characterIndex =
        0;


    var typingSpeed =
        45;


    // ==================================================
    // TYPE NEXT CHARACTER
    // ==================================================

    function typeNextCharacter()
    {
        // ==================================================
        // IGNORE OLD DIALOGUE INSTANCE
        // ==================================================

        if (
            typingToken !==
            window.geoplayDialogueTypingToken
        )
        {
            return;
        }


        // ==================================================
        // FINISHED TYPING
        // ==================================================

        if (
            characterIndex >=
            fullMessage.length
        )
        {
            finishTyping();

            return;
        }


        // ==================================================
        // ADD CHARACTER
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
        // CONTINUE
        // ==================================================

        window.geoplayDialogueTypingTimer =
            setTimeout(
                typeNextCharacter,
                typingSpeed
            );
    }


    // ==================================================
    // FINISH TYPING
    // ==================================================

    function finishTyping()
    {
        // ==================================================
        // IGNORE OLD INSTANCE
        // ==================================================

        if (
            typingToken !==
            window.geoplayDialogueTypingToken
        )
        {
            return;
        }


        window.geoplayDialogueTypingTimer =
            null;


        // ==================================================
        // CALCULATE READING TIME
        // ==================================================

        var readingPause =
            geoplayMapUIDialogueReadingPause(
                fullMessage
            );


        // ==================================================
        // WAIT FOR PLAYER TO READ
        // ==================================================

        window.geoplayDialogueHideTimer =
            setTimeout(
                function()
                {
                    // ==================================================
                    // IGNORE IF A NEW DIALOGUE HAS STARTED
                    // ==================================================

                    if (
                        typingToken !==
                        window.geoplayDialogueTypingToken
                    )
                    {
                        return;
                    }


                    window.geoplayDialogueHideTimer =
                        null;


                    // ==================================================
                    // RUN THIS MESSAGE'S CALLBACK
                    // ==================================================

                    if (
                        typeof onComplete ===
                        "function"
                    )
                    {
                        onComplete();
                    }
                },
                readingPause
            );
    }


    // ==================================================
    // START TYPING
    // ==================================================

    typeNextCharacter();


    return 1;
}