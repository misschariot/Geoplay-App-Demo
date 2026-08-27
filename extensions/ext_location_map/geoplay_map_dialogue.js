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

window.geoplayDialogueHideTimer =
    null;


// ==================================================
// DIALOGUE TYPING STATE
// ==================================================

window.geoplayDialogueTypingTimer =
    null;

window.geoplayDialogueTypingToken =
    0;


// ==================================================
// CREATE DIALOGUE
// ==================================================

function geoplayMapUICreateDialogue()
{
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
    // MESSAGE
    // ==================================================

    var fullMessage =
        String(message);


    // ==================================================
    // DESTINATION ARRIVAL MESSAGE
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

    dialogue.classList.add(
        "visible"
    );


    // ==================================================
    // TYPING SETTINGS
    // ==================================================
    //
    // Slowed down from 32ms so the dialogue
    // is easier to read, especially toward
    // the end of each sentence.
    //
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
                        3000
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