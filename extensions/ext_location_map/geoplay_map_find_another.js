// ==================================================
// GEOPLAY FIND ANOTHER
// ==================================================
//
// RESPONSIBILITY:
// - FIND ANOTHER popup
// - Manual location UI
// - Nearby radius UI
// - Popup open / close
//
// CURRENT VERSION:
// - UI ONLY
// - No location API yet
// - No search API yet
// - No routing changes
//
// DEPENDENCY:
// - geoplay_map_ui.js
//
// CSS:
// - geoplay_map.css
//
// ==================================================


window.geoplayFindAnotherUI =
    null;


// ==================================================
// CREATE FIND ANOTHER UI
// ==================================================

function geoplayMapUICreateFindAnother()
{
    // ==================================================
    // PREVENT DUPLICATE CREATION
    // ==================================================

    if (
        window.geoplayFindAnotherUI
    )
    {
        return 1;
    }


    // ==================================================
    // MAP UI REQUIRED
    // ==================================================

    if (
        !window.geoplayMapUI
    )
    {
        console.error(
            "GEOPLAY FIND ANOTHER: Map UI not found."
        );

        return 0;
    }


    // ==================================================
    // CREATE OVERLAY
    // ==================================================

    var overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "geoplay-find-another";


    overlay.className =
        "geoplay-find-another";


    // ==================================================
    // IMPORTANT:
    // HIDDEN BY DEFAULT
    // ==================================================

    overlay.style.opacity =
        "0";


    overlay.style.visibility =
        "hidden";


    overlay.style.pointerEvents =
        "none";


    // ==================================================
    // CREATE PANEL
    // ==================================================

    var panel =
        document.createElement(
            "div"
        );


    panel.className =
        "geoplay-find-another-panel";


    // ==================================================
    // HEADER
    // ==================================================

    var header =
        document.createElement(
            "div"
        );


    header.className =
        "geoplay-find-another-header";


    var title =
        document.createElement(
            "div"
        );


    title.className =
        "geoplay-find-another-title";


    title.textContent =
        "FIND ANOTHER";


    var close =
        document.createElement(
            "button"
        );


    close.type =
        "button";


    close.className =
        "geoplay-find-another-close";


    close.textContent =
        "×";


    close.setAttribute(
        "aria-label",
        "Close"
    );


    close.style.pointerEvents =
        "auto";


    close.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();

            geoplayMapUICloseFindAnother();
        }
    );


    header.appendChild(
        title
    );


    header.appendChild(
        close
    );


    panel.appendChild(
        header
    );


    // ==================================================
    // INTRODUCTION
    // ==================================================

    var intro =
        document.createElement(
            "div"
        );


    intro.className =
        "geoplay-find-another-intro";


    intro.textContent =
        "Where would you like to go?";


    panel.appendChild(
        intro
    );


    // ==================================================
    // MANUAL LOCATION SECTION
    // ==================================================

    var manualSection =
        document.createElement(
            "div"
        );


    manualSection.className =
        "geoplay-find-another-section";


    var manualLabel =
        document.createElement(
            "div"
        );


    manualLabel.className =
        "geoplay-find-another-label";


    manualLabel.textContent =
        "ENTER A LOCATION";


    var manualRow =
        document.createElement(
            "div"
        );


    manualRow.className =
        "geoplay-find-another-search-row";


    var input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.className =
        "geoplay-find-another-input";


    input.placeholder =
        "Search a place or address";


    input.setAttribute(
        "aria-label",
        "Enter a location"
    );


    input.style.pointerEvents =
        "auto";


    var searchButton =
        document.createElement(
            "button"
        );


    searchButton.type =
        "button";


    searchButton.className =
        "geoplay-find-another-search";


    searchButton.textContent =
        "SEARCH";


    searchButton.style.pointerEvents =
        "auto";


    searchButton.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "GEOPLAY FIND ANOTHER: Manual search selected.",
                input.value
            );
        }
    );


    manualRow.appendChild(
        input
    );


    manualRow.appendChild(
        searchButton
    );


    manualSection.appendChild(
        manualLabel
    );


    manualSection.appendChild(
        manualRow
    );


    panel.appendChild(
        manualSection
    );


    // ==================================================
    // DIVIDER
    // ==================================================

    var divider =
        document.createElement(
            "div"
        );


    divider.className =
        "geoplay-find-another-divider";


    panel.appendChild(
        divider
    );


    // ==================================================
    // NEARBY SECTION
    // ==================================================

    var nearbySection =
        document.createElement(
            "div"
        );


    nearbySection.className =
        "geoplay-find-another-section";


    var nearbyLabel =
        document.createElement(
            "div"
        );


    nearbyLabel.className =
        "geoplay-find-another-label";


    nearbyLabel.textContent =
        "PLACES NEARBY";


    nearbySection.appendChild(
        nearbyLabel
    );


    // ==================================================
    // RADIUS OPTIONS
    // ==================================================

    var radiusGroup =
        document.createElement(
            "div"
        );


    radiusGroup.className =
        "geoplay-find-another-radius";


    var radiusValues =
        [
            "5",
            "10",
            "25"
        ];


    var radiusButtons =
        [];


    for (
        var i = 0;
        i < radiusValues.length;
        i++
    )
    {
        var radius =
            radiusValues[i];


        var radiusButton =
            document.createElement(
                "button"
            );


        radiusButton.type =
            "button";


        radiusButton.className =
            "geoplay-find-another-radius-button";


        radiusButton.textContent =
            radius +
            " MILES";


        radiusButton.dataset.radius =
            radius;


        radiusButton.style.pointerEvents =
            "auto";


        radiusButton.addEventListener(
            "click",
            function(event)
            {
                event.preventDefault();

                event.stopPropagation();


                for (
                    var j = 0;
                    j < radiusButtons.length;
                    j++
                )
                {
                    radiusButtons[j]
                        .classList.remove(
                            "selected"
                        );
                }


                this.classList.add(
                    "selected"
                );


                console.log(
                    "GEOPLAY FIND ANOTHER: Nearby radius selected:",
                    this.dataset.radius,
                    "miles"
                );
            }
        );


        radiusButtons.push(
            radiusButton
        );


        radiusGroup.appendChild(
            radiusButton
        );
    }


    // ==================================================
    // DEFAULT RADIUS
    // ==================================================

    if (
        radiusButtons.length > 0
    )
    {
        radiusButtons[0].classList.add(
            "selected"
        );
    }


    nearbySection.appendChild(
        radiusGroup
    );


    panel.appendChild(
        nearbySection
    );


    // ==================================================
    // FOOTER
    // ==================================================

    var footer =
        document.createElement(
            "div"
        );


    footer.className =
        "geoplay-find-another-footer";


    var cancel =
        document.createElement(
            "button"
        );


    cancel.type =
        "button";


    cancel.className =
        "geoplay-find-another-cancel";


    cancel.textContent =
        "CANCEL";


    cancel.style.pointerEvents =
        "auto";


    cancel.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();

            geoplayMapUICloseFindAnother();
        }
    );


    footer.appendChild(
        cancel
    );


    panel.appendChild(
        footer
    );


    // ==================================================
    // ADD PANEL TO OVERLAY
    // ==================================================

    overlay.appendChild(
        panel
    );


    // ==================================================
    // ADD OVERLAY TO MAP UI
    // ==================================================

    window.geoplayMapUI.appendChild(
        overlay
    );


    window.geoplayFindAnotherUI =
        overlay;


    console.log(
        "GEOPLAY FIND ANOTHER: UI created."
    );


    return 1;
}


// ==================================================
// OPEN FIND ANOTHER
// ==================================================

function geoplayMapUIOpenFindAnother()
{
    // ==================================================
    // CREATE UI IF NEEDED
    // ==================================================

    if (
        !window.geoplayFindAnotherUI
    )
    {
        geoplayMapUICreateFindAnother();
    }


    // ==================================================
    // VERIFY UI EXISTS
    // ==================================================

    if (
        !window.geoplayFindAnotherUI
    )
    {
        console.error(
            "GEOPLAY FIND ANOTHER: Unable to create popup."
        );

        return 0;
    }


    // ==================================================
    // HIDE STORY ACTIONS WHILE POPUP IS OPEN
    // ==================================================

    if (
        typeof geoplayMapUIHideStoryActions ===
        "function"
    )
    {
        geoplayMapUIHideStoryActions();
    }


    // ==================================================
    // SHOW POPUP
    // ==================================================

    window.geoplayFindAnotherUI.style.opacity =
        "1";


    window.geoplayFindAnotherUI.style.visibility =
        "visible";


    window.geoplayFindAnotherUI.style.pointerEvents =
        "auto";


    window.geoplayFindAnotherUI.classList.add(
        "visible"
    );


    // ==================================================
    // FOCUS SEARCH FIELD
    // ==================================================

    var input =
        window.geoplayFindAnotherUI.querySelector(
            ".geoplay-find-another-input"
        );


    if (input)
    {
        setTimeout(
            function()
            {
                input.focus();
            },
            250
        );
    }


    console.log(
        "GEOPLAY FIND ANOTHER: Opened."
    );


    return 1;
}


// ==================================================
// CLOSE FIND ANOTHER
// ==================================================

function geoplayMapUICloseFindAnother()
{
    if (
        !window.geoplayFindAnotherUI
    )
    {
        return 1;
    }


    // ==================================================
    // HIDE POPUP
    // ==================================================

    window.geoplayFindAnotherUI.style.opacity =
        "0";


    window.geoplayFindAnotherUI.style.visibility =
        "hidden";


    window.geoplayFindAnotherUI.style.pointerEvents =
        "none";


    window.geoplayFindAnotherUI.classList.remove(
        "visible"
    );


    // ==================================================
    // RETURN TO STORY-END STATE
    // ==================================================

    if (
        typeof geoplayMapUIShowStoryActions ===
        "function"
    )
    {
        geoplayMapUIShowStoryActions();
    }


    console.log(
        "GEOPLAY FIND ANOTHER: Closed."
    );


    return 1;
}