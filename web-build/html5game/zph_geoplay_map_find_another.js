// ==================================================
// GEOPLAY SEARCH
// ==================================================
//
// INTERNAL MODULE NAME:
// - Search
//
// PLAYER-FACING NAME:
// - SEARCH
//
// RESPONSIBILITY:
// - SEARCH popup
// - Manual casino / location UI
// - Use My Location UI
// - Compact Use My Location UI
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
// CREATE SEARCH UI
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
            "GEOPLAY SEARCH: Map UI not found."
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
        "geoplay-find-another-overlay";


    overlay.className =
        "geoplay-find-another-overlay";


    // ==================================================
    // INITIAL HIDDEN STATE
    // ==================================================

    overlay.style.position =
        "absolute";


    overlay.style.left =
        "0";


    overlay.style.top =
        "0";


    overlay.style.width =
        "100%";


    overlay.style.height =
        "100%";


    overlay.style.display =
        "flex";


    overlay.style.alignItems =
        "center";


    overlay.style.justifyContent =
        "center";


    overlay.style.boxSizing =
        "border-box";


    overlay.style.opacity =
        "0";


    overlay.style.visibility =
        "hidden";


    overlay.style.pointerEvents =
        "none";


    overlay.style.zIndex =
        "2000";


    // ==================================================
    // BLOCK MAP INTERACTION
    // ==================================================

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


    // ==================================================
    // CREATE POPUP PANEL
    // ==================================================

    var panel =
        document.createElement(
            "div"
        );


    panel.className =
        "geoplay-find-another";


    panel.style.position =
        "relative";


    panel.style.zIndex =
        "2001";


    panel.style.pointerEvents =
        "auto";


    // ==================================================
    // BLOCK PANEL INTERACTION FROM MAP
    // ==================================================

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
        "SEARCH";


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
        "Close search"
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


    close.addEventListener(
        "touchend",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();

            geoplayMapUICloseFindAnother();
        },
        {
            passive:
                false
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
    // SUBTITLE
    // ==================================================

    var subtitle =
        document.createElement(
            "div"
        );


    subtitle.className =
        "geoplay-find-another-subtitle";


    subtitle.textContent =
        "Where do you want to play?";


    panel.appendChild(
        subtitle
    );


    // ==================================================
    // CASINO OR LOCATION
    // ==================================================

    var searchSection =
        document.createElement(
            "div"
        );


    searchSection.className =
        "geoplay-find-another-section";


    var searchLabel =
        document.createElement(
            "div"
        );


    searchLabel.className =
        "geoplay-find-another-label";


    searchLabel.textContent =
        "CASINO OR LOCATION";


    searchSection.appendChild(
        searchLabel
    );


    // ==================================================
    // SEARCH ROW
    // ==================================================

    var searchRow =
        document.createElement(
            "div"
        );


    searchRow.className =
        "geoplay-find-another-search-row";


    // ==================================================
    // SEARCH INPUT WRAPPER
    // ==================================================

    var inputWrapper =
        document.createElement(
            "div"
        );


    inputWrapper.className =
        "geoplay-find-another-input-wrapper";


    // ==================================================
    // SEARCH ICON
    // ==================================================

    var searchIcon =
        document.createElement(
            "span"
        );


    searchIcon.className =
        "geoplay-find-another-input-icon";


    searchIcon.innerHTML =
        "<svg " +
        "width='19' " +
        "height='19' " +
        "viewBox='0 0 24 24' " +
        "fill='none' " +
        "xmlns='http://www.w3.org/2000/svg'>" +
        "<circle " +
        "cx='11' " +
        "cy='11' " +
        "r='6.5' " +
        "stroke='currentColor' " +
        "stroke-width='2'/>" +
        "<path " +
        "d='M16 16L21 21' " +
        "stroke='currentColor' " +
        "stroke-width='2' " +
        "stroke-linecap='round'/>" +
        "</svg>";


    inputWrapper.appendChild(
        searchIcon
    );


    // ==================================================
    // INPUT
    // ==================================================

    var input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.className =
        "geoplay-find-another-input";


    input.placeholder =
        "Search casino name or address";


    input.setAttribute(
        "aria-label",
        "Search casino name or address"
    );


    input.style.pointerEvents =
        "auto";


    inputWrapper.appendChild(
        input
    );


    searchRow.appendChild(
        inputWrapper
    );


    // ==================================================
    // SEARCH BUTTON
    // ==================================================

    var searchButton =
        document.createElement(
            "button"
        );


    searchButton.type =
        "button";


    searchButton.className =
        "geoplay-find-another-search";


    searchButton.innerHTML =
        "<span>SEARCH</span>" +
        "<span class='geoplay-find-another-search-arrow'>→</span>";


    searchButton.style.pointerEvents =
        "auto";


    searchButton.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "GEOPLAY SEARCH: Manual search selected.",
                input.value
            );
        }
    );


    searchButton.addEventListener(
        "touchend",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "GEOPLAY SEARCH: Manual search selected.",
                input.value
            );
        },
        {
            passive:
                false
        }
    );


    searchRow.appendChild(
        searchButton
    );


    searchSection.appendChild(
        searchRow
    );


    panel.appendChild(
        searchSection
    );


    // ==================================================
    // OR DIVIDER
    // ==================================================

    var orDivider =
        document.createElement(
            "div"
        );


    orDivider.className =
        "geoplay-find-another-or";


    var orLeft =
        document.createElement(
            "span"
        );


    var orText =
        document.createElement(
            "span"
        );


    orText.className =
        "geoplay-find-another-or-text";


    orText.textContent =
        "OR";


    var orRight =
        document.createElement(
            "span"
        );


    orDivider.appendChild(
        orLeft
    );


    orDivider.appendChild(
        orText
    );


    orDivider.appendChild(
        orRight
    );


    panel.appendChild(
        orDivider
    );


    // ==================================================
    // USE MY LOCATION
    // ==================================================
    //
    // Display-only for now.
    // This is intentionally compact so it reads as a
    // secondary search method rather than a large CTA.
    //
    // ==================================================

    var locationButton =
        document.createElement(
            "button"
        );


    locationButton.type =
        "button";


    locationButton.className =
        "geoplay-find-another-location";


    locationButton.style.pointerEvents =
        "auto";


    // ==================================================
    // LOCATION ICON
    // ==================================================

    var locationIcon =
        document.createElement(
            "span"
        );


    locationIcon.className =
        "geoplay-find-another-location-icon";


    locationIcon.innerHTML =
        "<svg " +
        "width='22' " +
        "height='22' " +
        "viewBox='0 0 24 24' " +
        "fill='none' " +
        "xmlns='http://www.w3.org/2000/svg'>" +

        "<circle " +
        "cx='12' " +
        "cy='12' " +
        "r='3.5' " +
        "stroke='currentColor' " +
        "stroke-width='1.8'/>" +

        "<path " +
        "d='M12 2V6' " +
        "stroke='currentColor' " +
        "stroke-width='1.8' " +
        "stroke-linecap='round'/>" +

        "<path " +
        "d='M12 18V22' " +
        "stroke='currentColor' " +
        "stroke-width='1.8' " +
        "stroke-linecap='round'/>" +

        "<path " +
        "d='M2 12H6' " +
        "stroke='currentColor' " +
        "stroke-width='1.8' " +
        "stroke-linecap='round'/>" +

        "<path " +
        "d='M18 12H22' " +
        "stroke='currentColor' " +
        "stroke-width='1.8' " +
        "stroke-linecap='round'/>" +

        "</svg>";


    locationButton.appendChild(
        locationIcon
    );


    // ==================================================
    // LOCATION TEXT
    // ==================================================

    var locationText =
        document.createElement(
            "span"
        );


    locationText.className =
        "geoplay-find-another-location-text";


    var locationTitle =
        document.createElement(
            "span"
        );


    locationTitle.className =
        "geoplay-find-another-location-title";


    locationTitle.textContent =
        "USE MY LOCATION";


    var locationSubtitle =
        document.createElement(
            "span"
        );


    locationSubtitle.className =
        "geoplay-find-another-location-subtitle";


    locationSubtitle.textContent =
        "Find casinos near you";


    locationText.appendChild(
        locationTitle
    );


    locationText.appendChild(
        locationSubtitle
    );


    locationButton.appendChild(
        locationText
    );


    // ==================================================
    // LOCATION ARROW
    // ==================================================

    var locationArrow =
        document.createElement(
            "span"
        );


    locationArrow.className =
        "geoplay-find-another-location-arrow";


    locationArrow.textContent =
        "›";


    locationButton.appendChild(
        locationArrow
    );


    // ==================================================
    // LOCATION BUTTON CLICK
    // ==================================================

    locationButton.addEventListener(
        "click",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "GEOPLAY SEARCH: Use My Location selected."
            );
        }
    );


    locationButton.addEventListener(
        "touchend",
        function(event)
        {
            event.preventDefault();

            event.stopPropagation();


            console.log(
                "GEOPLAY SEARCH: Use My Location selected."
            );
        },
        {
            passive:
                false
        }
    );


    panel.appendChild(
        locationButton
    );


    // ==================================================
    // SEARCH FOOTER
    // ==================================================

    var footer =
        document.createElement(
            "div"
        );


    footer.className =
        "geoplay-find-another-footer";


    var footerText =
        document.createElement(
            "span"
        );


    footerText.className =
        "geoplay-find-another-footer-text";


    footerText.textContent =
        "You can search by casino name, city, or address.";


    footer.appendChild(
        footerText
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
        "GEOPLAY SEARCH: UI created."
    );


    return 1;
}


// ==================================================
// OPEN SEARCH
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
            "GEOPLAY SEARCH: Unable to create popup."
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
    // DO NOT AUTO-FOCUS SEARCH FIELD
    // ==================================================
    //
    // The search input intentionally does NOT receive
    // focus when the popup opens.
    //
    // This prevents mobile browsers from automatically
    // opening the QWERTY keyboard.
    //
    // The player can still tap the input normally, and
    // the browser will open the keyboard at that time.
    //
    // ==================================================


    console.log(
        "GEOPLAY SEARCH: Opened."
    );


    return 1;
}


// ==================================================
// CLOSE SEARCH
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
        "GEOPLAY SEARCH: Closed."
    );


    return 1;
}