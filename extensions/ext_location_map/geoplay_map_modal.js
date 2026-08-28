// ==================================================
// GEOPLAY MAP MODAL SYSTEM
// ==================================================
//
// RESPONSIBILITY:
// - Shared modal behavior
// - Shared modal opening
// - Shared modal closing
// - Shared backdrop behavior
// - Shared centering
// - Shared animation timing
// - Shared modal state
//
// USED BY:
// - SEARCH
// - PINE RIDGE DESTINATION
//
// IMPORTANT:
// - This file does NOT create modal content.
// - This file does NOT control Search.
// - This file does NOT control Pine Ridge.
// - It only provides the shared modal behavior.
//
// ==================================================


// ==================================================
// SHARED MODAL SETTINGS
// ==================================================

window.geoplayModalDuration =
    300;


window.geoplayModalOpening =
    false;


window.geoplayModalClosing =
    false;


// ==================================================
// OPEN SHARED MODAL
// ==================================================
//
// PARAMETERS:
//
// overlay
// - The modal backdrop / overlay element.
//
// panel
// - The actual popup panel.
//
// ==================================================

function geoplayMapUIOpenModal(
    overlay,
    panel
)
{
    if (
        !overlay ||
        !panel
    )
    {
        console.error(
            "GEOPLAY MODAL: Overlay or panel is missing."
        );

        return 0;
    }


    // ==================================================
    // RESET SHARED STATE
    // ==================================================

    window.geoplayModalClosing =
        false;


    window.geoplayModalOpening =
        true;


    // ==================================================
    // CLEAR OLD CLOSING STATE
    // ==================================================

    overlay.classList.remove(
        "modal-closing"
    );


    panel.classList.remove(
        "modal-closing"
    );


    // ==================================================
    // INITIAL MODAL STATE
    // ==================================================

    overlay.style.opacity =
        "0";


    overlay.style.visibility =
        "hidden";


    overlay.style.pointerEvents =
        "none";


    panel.style.opacity =
        "0";


    panel.style.transform =
        "translate(-50%,-50%) translateY(-2vh) scale(.97)";


    // ==================================================
    // CENTER MODAL
    // ==================================================

    geoplayMapUICenterModal(
        panel
    );


    // ==================================================
    // MAKE OVERLAY AVAILABLE
    // ==================================================

    overlay.style.visibility =
        "visible";


    overlay.style.pointerEvents =
        "auto";


    // ==================================================
    // START SHARED OPEN ANIMATION
    // ==================================================

    requestAnimationFrame(
        function()
        {
            requestAnimationFrame(
                function()
                {
                    if (
                        window.geoplayModalClosing
                    )
                    {
                        return;
                    }


                    overlay.classList.add(
                        "visible"
                    );


                    panel.classList.add(
                        "visible"
                    );


                    overlay.style.opacity =
                        "1";


                    overlay.style.visibility =
                        "visible";


                    overlay.style.pointerEvents =
                        "auto";


                    panel.style.opacity =
                        "1";


                    panel.style.transform =
                        "translate(-50%,-50%) translateY(-2vh) scale(1)";


                    window.geoplayModalOpening =
                        false;
                }
            );
        }
    );


    return 1;
}


// ==================================================
// CLOSE SHARED MODAL
// ==================================================
//
// PARAMETERS:
//
// overlay
// - The modal backdrop / overlay element.
//
// panel
// - The actual popup panel.
//
// onComplete
// - Optional callback after the animation finishes.
//
// ==================================================

function geoplayMapUICloseModal(
    overlay,
    panel,
    onComplete
)
{
    if (
        !overlay ||
        !panel
    )
    {
        if (
            typeof onComplete ===
            "function"
        )
        {
            onComplete();
        }


        return 0;
    }


    // ==================================================
    // PREVENT DUPLICATE CLOSE
    // ==================================================

    if (
        window.geoplayModalClosing
    )
    {
        return 0;
    }


    window.geoplayModalClosing =
        true;


    window.geoplayModalOpening =
        false;


    // ==================================================
    // MARK CLOSING
    // ==================================================

    overlay.classList.add(
        "modal-closing"
    );


    panel.classList.add(
        "modal-closing"
    );


    // ==================================================
    // REMOVE VISIBLE STATE
    // ==================================================

    overlay.classList.remove(
        "visible"
    );


    panel.classList.remove(
        "visible"
    );


    // ==================================================
    // START SHARED CLOSE ANIMATION
    // ==================================================

    overlay.style.opacity =
        "0";


    panel.style.opacity =
        "0";


    panel.style.transform =
        "translate(-50%,-50%) translateY(-2vh) scale(.97)";


    // ==================================================
    // WAIT FOR SHARED MODAL TIMING
    // ==================================================

    setTimeout(
        function()
        {
            // ==================================================
            // HIDE OVERLAY COMPLETELY
            // ==================================================

            overlay.style.visibility =
                "hidden";


            overlay.style.pointerEvents =
                "none";


            // ==================================================
            // CLEAR ANIMATION STATE
            // ==================================================

            overlay.classList.remove(
                "modal-closing"
            );


            panel.classList.remove(
                "modal-closing"
            );


            // ==================================================
            // RESET PANEL
            // ==================================================

            panel.style.opacity =
                "";


            panel.style.transform =
                "";


            // ==================================================
            // RESET SHARED STATE
            // ==================================================

            window.geoplayModalClosing =
                false;


            // ==================================================
            // OPTIONAL COMPLETION CALLBACK
            // ==================================================

            if (
                typeof onComplete ===
                "function"
            )
            {
                onComplete();
            }
        },
        window.geoplayModalDuration
    );


    return 1;
}


// ==================================================
// CENTER SHARED MODAL
// ==================================================
//
// The popup is centered relative to the MapLibre /
// GameMaker map container.
//
// This keeps the modal behavior consistent across:
//
// - 430 × 932
// - 768 × 1024
// - desktop
//
// ==================================================

function geoplayMapUICenterModal(
    panel
)
{
    if (
        !panel
    )
    {
        return 0;
    }


    var mapContainer =
        document.getElementById(
            "geoplay-map"
        );


    if (
        !mapContainer
    )
    {
        return 0;
    }


    panel.style.position =
        "absolute";


    panel.style.left =
        (
            mapContainer.clientWidth /
            2
        ) +
        "px";


    panel.style.top =
        (
            mapContainer.clientHeight /
            2
        ) +
        "px";


    return 1;
}


// ==================================================
// UPDATE SHARED MODAL POSITION
// ==================================================
//
// Called when the viewport changes size.
//
// ==================================================

function geoplayMapUIUpdateModalPosition(
    panel
)
{
    if (
        !panel
    )
    {
        return 0;
    }


    var isVisible =
        panel.classList.contains(
            "visible"
        );


    var isClosing =
        panel.classList.contains(
            "modal-closing"
        );


    if (
        !isVisible &&
        !isClosing
    )
    {
        return 0;
    }


    geoplayMapUICenterModal(
        panel
    );


    return 1;
}


// ==================================================
// SHARED MODAL RESIZE HANDLER
// ==================================================

window.addEventListener(
    "resize",
    function()
    {
        if (
            window.geoplayFindAnotherUI
        )
        {
            var searchPanel =
                window.geoplayFindAnotherUI.querySelector(
                    ".geoplay-find-another"
                );


            geoplayMapUIUpdateModalPosition(
                searchPanel
            );
        }


        if (
            window.geoplayDestinationCard &&
            window.geoplayDestinationExpanded
        )
        {
            geoplayMapUIUpdateModalPosition(
                window.geoplayDestinationCard
            );
        }
    }
);


// ==================================================
// SHARED MODAL TOUCH / POINTER PROTECTION
// ==================================================
//
// Prevents the underlying map from receiving input
// while a modal is open.
//
// ==================================================

function geoplayMapUIProtectModalPanel(
    overlay,
    panel
)
{
    if (
        !overlay ||
        !panel
    )
    {
        return 0;
    }


    overlay.addEventListener(
        "click",
        function(event)
        {
            event.stopPropagation();
        }
    );


    overlay.addEventListener(
        "mousedown",
        function(event)
        {
            event.stopPropagation();
        }
    );


    overlay.addEventListener(
        "mouseup",
        function(event)
        {
            event.stopPropagation();
        }
    );


    overlay.addEventListener(
        "touchstart",
        function(event)
        {
            event.stopPropagation();
        },
        {
            passive:
                true
        }
    );


    overlay.addEventListener(
        "touchmove",
        function(event)
        {
            event.stopPropagation();
        },
        {
            passive:
                true
        }
    );


    overlay.addEventListener(
        "touchend",
        function(event)
        {
            event.stopPropagation();
        },
        {
            passive:
                true
        }
    );


    panel.addEventListener(
        "click",
        function(event)
        {
            event.stopPropagation();
        }
    );


    panel.addEventListener(
        "mousedown",
        function(event)
        {
            event.stopPropagation();
        }
    );


    panel.addEventListener(
        "touchstart",
        function(event)
        {
            event.stopPropagation();
        },
        {
            passive:
                true
        }
    );


    return 1;
}


// ==================================================
// END GEOPLAY MODAL SYSTEM
// ==================================================