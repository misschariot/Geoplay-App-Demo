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
// DEPENDENCIES:
// - geoplay_map_ui.js
// - geoplay_map_modal.js
//
// CSS:
// - geoplay_map_search.css
//
// ==================================================


// ==================================================
// SEARCH STATE
// ==================================================

window.geoplayFindAnotherUI = null;


// ==================================================
// EVENT HELPERS
// ==================================================
//
// Keeps click/touch behavior consistent without
// duplicating the same event code throughout the file.
// ==================================================

function geoplayMapUISearchStopEvent(event)
{
    event.preventDefault();
    event.stopPropagation();
}


function geoplayMapUISearchAddTouchClick(
    element,
    callback
)
{
    element.addEventListener(
        "click",
        function(event)
        {
            geoplayMapUISearchStopEvent(event);
            callback();
        }
    );

    element.addEventListener(
        "touchend",
        function(event)
        {
            geoplayMapUISearchStopEvent(event);
            callback();
        },
        {
            passive: false
        }
    );
}


// ==================================================
// CREATE SEARCH UI
// ==================================================

function geoplayMapUICreateFindAnother()
{
    if (window.geoplayFindAnotherUI)
    {
        return 1;
    }

    if (!window.geoplayMapUI)
    {
        console.error(
            "GEOPLAY SEARCH: Map UI not found."
        );

        return 0;
    }

    // --------------------------------------------------
    // CREATE OVERLAY
    // --------------------------------------------------

    var overlay =
        document.createElement("div");

    overlay.id =
        "geoplay-find-another-overlay";

    overlay.className =
        "geoplay-find-another-overlay";

    geoplayMapUISearchConfigureOverlay(
        overlay
    );

    geoplayMapUISearchProtectOverlay(
        overlay
    );

    // --------------------------------------------------
    // CREATE PANEL
    // --------------------------------------------------

    var panel =
        document.createElement("div");

    panel.className =
        "geoplay-find-another";

    panel.style.position = "relative";
    panel.style.zIndex = "501";
    panel.style.pointerEvents = "auto";

    geoplayMapUISearchProtectPanel(
        panel
    );

    // --------------------------------------------------
    // BUILD CONTENT
    // --------------------------------------------------

    geoplayMapUISearchBuildHeader(panel);
    geoplayMapUISearchBuildSubtitle(panel);
    geoplayMapUISearchBuildSearchSection(panel);
    geoplayMapUISearchBuildDivider(panel);
    geoplayMapUISearchBuildLocationButton(panel);
    geoplayMapUISearchBuildFooter(panel);

    // --------------------------------------------------
    // ADD TO MAP UI
    // --------------------------------------------------

    overlay.appendChild(panel);
    window.geoplayMapUI.appendChild(overlay);

    window.geoplayFindAnotherUI = overlay;

    console.log(
        "GEOPLAY SEARCH: UI created."
    );

    return 1;
}


// ==================================================
// CONFIGURE SEARCH OVERLAY
// ==================================================

function geoplayMapUISearchConfigureOverlay(
    overlay
)
{
    overlay.style.position = "absolute";
    overlay.style.left = "0";
    overlay.style.top = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";

    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    overlay.style.boxSizing = "border-box";

    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
    overlay.style.pointerEvents = "none";

    overlay.style.zIndex = "500";
}


// ==================================================
// PROTECT SEARCH OVERLAY
// ==================================================

function geoplayMapUISearchProtectOverlay(
    overlay
)
{
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
            passive: true
        }
    );

    overlay.addEventListener(
        "touchmove",
        function(event)
        {
            event.stopPropagation();
        },
        {
            passive: true
        }
    );

    overlay.addEventListener(
        "touchend",
        function(event)
        {
            event.stopPropagation();
        },
        {
            passive: true
        }
    );
}


// ==================================================
// PROTECT SEARCH PANEL
// ==================================================

function geoplayMapUISearchProtectPanel(
    panel
)
{
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
            passive: true
        }
    );
}


// ==================================================
// BUILD SEARCH HEADER
// ==================================================

function geoplayMapUISearchBuildHeader(
    panel
)
{
    var header =
        document.createElement("div");

    header.className =
        "geoplay-find-another-header";

    var title =
        document.createElement("div");

    title.className =
        "geoplay-find-another-title";

    title.textContent =
        "SEARCH";

    var close =
        document.createElement("button");

    close.type = "button";

    close.className =
        "geoplay-find-another-close";

    close.textContent = "×";

    close.setAttribute(
        "aria-label",
        "Close search"
    );

    close.style.pointerEvents = "auto";

    geoplayMapUISearchAddTouchClick(
        close,
        function()
        {
            geoplayMapUICloseFindAnother();
        }
    );

    header.appendChild(title);
    header.appendChild(close);

    panel.appendChild(header);
}


// ==================================================
// BUILD SEARCH SUBTITLE
// ==================================================

function geoplayMapUISearchBuildSubtitle(
    panel
)
{
    var subtitle =
        document.createElement("div");

    subtitle.className =
        "geoplay-find-another-subtitle";

    subtitle.textContent =
        "Where do you want to play?";

    panel.appendChild(subtitle);
}


// ==================================================
// BUILD SEARCH SECTION
// ==================================================

function geoplayMapUISearchBuildSearchSection(
    panel
)
{
    var searchSection =
        document.createElement("div");

    searchSection.className =
        "geoplay-find-another-section";

    var searchLabel =
        document.createElement("div");

    searchLabel.className =
        "geoplay-find-another-label";

    searchLabel.textContent =
        "CASINO OR LOCATION";

    searchSection.appendChild(searchLabel);

    var searchRow =
        document.createElement("div");

    searchRow.className =
        "geoplay-find-another-search-row";

    var inputWrapper =
        geoplayMapUISearchCreateInput(
            searchRow
        );

    geoplayMapUISearchCreateSearchButton(
        searchRow,
        inputWrapper
    );

    searchSection.appendChild(searchRow);
    panel.appendChild(searchSection);
}


// ==================================================
// CREATE SEARCH INPUT
// ==================================================

function geoplayMapUISearchCreateInput(
    searchRow
)
{
    var inputWrapper =
        document.createElement("div");

    inputWrapper.className =
        "geoplay-find-another-input-wrapper";

    // --------------------------------------------------
    // SEARCH ICON
    // --------------------------------------------------

    var searchIcon =
        document.createElement("span");

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

    inputWrapper.appendChild(searchIcon);

    // --------------------------------------------------
    // INPUT
    // --------------------------------------------------

    var input =
        document.createElement("input");

    input.type = "text";

    input.className =
        "geoplay-find-another-input";

    input.placeholder =
        "Search casino name or address";

    input.setAttribute(
        "aria-label",
        "Search casino name or address"
    );

    input.style.pointerEvents = "auto";

    // --------------------------------------------------
    // IMPORTANT:
    // DO NOT AUTO-FOCUS INPUT
    // --------------------------------------------------
    //
    // The mobile keyboard should only appear when
    // the player deliberately taps the input.
    //
    // --------------------------------------------------

    inputWrapper.appendChild(input);
    searchRow.appendChild(inputWrapper);

    return inputWrapper;
}


// ==================================================
// CREATE SEARCH BUTTON
// ==================================================

function geoplayMapUISearchCreateSearchButton(
    searchRow,
    inputWrapper
)
{
    var searchButton =
        document.createElement("button");

    searchButton.type = "button";

    searchButton.className =
        "geoplay-find-another-search";

    searchButton.innerHTML =
        "<span>SEARCH</span>";

    searchButton.style.pointerEvents = "auto";

    var input =
        inputWrapper.querySelector(
            ".geoplay-find-another-input"
        );

    geoplayMapUISearchAddTouchClick(
        searchButton,
        function()
        {
            geoplayMapUISearchSubmit(input);
        }
    );

    searchRow.appendChild(searchButton);
}


// ==================================================
// SEARCH SUBMISSION
// ==================================================
//
// UI ONLY FOR NOW.
//
// Future search implementation will connect here:
// - Geocoding
// - Results
// - Property selection
// - Map movement
// - Destination card
//
// ==================================================

function geoplayMapUISearchSubmit(
    input
)
{
    var value =
        input
            ? input.value
            : "";

    console.log(
        "GEOPLAY SEARCH: Manual search selected.",
        value
    );
}


// ==================================================
// BUILD OR DIVIDER
// ==================================================

function geoplayMapUISearchBuildDivider(
    panel
)
{
    var orDivider =
        document.createElement("div");

    orDivider.className =
        "geoplay-find-another-or";

    var orLeft =
        document.createElement("span");

    var orText =
        document.createElement("span");

    orText.className =
        "geoplay-find-another-or-text";

    orText.textContent = "OR";

    var orRight =
        document.createElement("span");

    orDivider.appendChild(orLeft);
    orDivider.appendChild(orText);
    orDivider.appendChild(orRight);

    panel.appendChild(orDivider);
}


// ==================================================
// BUILD USE MY LOCATION BUTTON
// ==================================================
//
// Display-only for now.
//
// ==================================================

function geoplayMapUISearchBuildLocationButton(
    panel
)
{
    var locationButton =
        document.createElement("button");

    locationButton.type = "button";

    locationButton.className =
        "geoplay-find-another-location";

    locationButton.style.pointerEvents = "auto";

    // --------------------------------------------------
    // LOCATION ICON
    // --------------------------------------------------

    var locationIcon =
        document.createElement("span");

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

    locationButton.appendChild(locationIcon);

    // --------------------------------------------------
    // LOCATION TEXT
    // --------------------------------------------------

    var locationText =
        document.createElement("span");

    locationText.className =
        "geoplay-find-another-location-text";

    var locationTitle =
        document.createElement("span");

    locationTitle.className =
        "geoplay-find-another-location-title";

    locationTitle.textContent =
        "USE MY LOCATION";

    var locationSubtitle =
        document.createElement("span");

    locationSubtitle.className =
        "geoplay-find-another-location-subtitle";

    locationSubtitle.textContent =
        "Find casinos near you";

    locationText.appendChild(locationTitle);
    locationText.appendChild(locationSubtitle);

    locationButton.appendChild(locationText);

    // --------------------------------------------------
    // LOCATION ARROW
    // --------------------------------------------------

    var locationArrow =
        document.createElement("span");

    locationArrow.className =
        "geoplay-find-another-location-arrow";

    locationArrow.textContent = "›";

    locationButton.appendChild(locationArrow);

    // --------------------------------------------------
    // LOCATION BUTTON EVENTS
    // --------------------------------------------------

    geoplayMapUISearchAddTouchClick(
        locationButton,
        function()
        {
            geoplayMapUISearchUseMyLocation();
        }
    );

    panel.appendChild(locationButton);
}


// ==================================================
// USE MY LOCATION
// ==================================================
//
// UI ONLY FOR NOW.
//
// ==================================================

function geoplayMapUISearchUseMyLocation()
{
    console.log(
        "GEOPLAY SEARCH: Use My Location selected."
    );
}


// ==================================================
// BUILD SEARCH FOOTER
// ==================================================

function geoplayMapUISearchBuildFooter(
    panel
)
{
    var footer =
        document.createElement("div");

    footer.className =
        "geoplay-find-another-footer";

    var footerText =
        document.createElement("span");

    footerText.className =
        "geoplay-find-another-footer-text";

    footerText.textContent =
        "You can search by casino name, city, or address.";

    footer.appendChild(footerText);
    panel.appendChild(footer);
}


// ==================================================
// OPEN SEARCH
// ==================================================

function geoplayMapUIOpenFindAnother()
{
    // --------------------------------------------------
    // CREATE UI IF NEEDED
    // --------------------------------------------------

    if (!window.geoplayFindAnotherUI)
    {
        geoplayMapUICreateFindAnother();
    }

    // --------------------------------------------------
    // VERIFY UI
    // --------------------------------------------------

    if (!window.geoplayFindAnotherUI)
    {
        console.error(
            "GEOPLAY SEARCH: Unable to create popup."
        );

        return 0;
    }

    // --------------------------------------------------
    // FIND PANEL
    // --------------------------------------------------

    var panel =
        window.geoplayFindAnotherUI.querySelector(
            ".geoplay-find-another"
        );

    if (!panel)
    {
        console.error(
            "GEOPLAY SEARCH: Popup panel not found."
        );

        return 0;
    }

    // --------------------------------------------------
    // SHARED MODAL SYSTEM
    // --------------------------------------------------

    if (
        typeof geoplayMapUIOpenModal !==
        "function"
    )
    {
        console.error(
            "GEOPLAY SEARCH: Shared modal system is unavailable."
        );

        return 0;
    }

    geoplayMapUIOpenModal(
        window.geoplayFindAnotherUI,
        panel
    );

    // --------------------------------------------------
    // IMPORTANT:
    // DO NOT HIDE STORY ACTIONS.
    //
    // FIND ANOTHER / BROWSE remain visible underneath
    // the transparent modal backdrop.
    //
    // DO NOT AUTO-FOCUS SEARCH INPUT.
    // --------------------------------------------------

    console.log(
        "GEOPLAY SEARCH: Opened using shared modal system."
    );

    return 1;
}


// ==================================================
// CLOSE SEARCH
// ==================================================

function geoplayMapUICloseFindAnother()
{
    if (!window.geoplayFindAnotherUI)
    {
        return 1;
    }

    // --------------------------------------------------
    // FIND PANEL
    // --------------------------------------------------

    var panel =
        window.geoplayFindAnotherUI.querySelector(
            ".geoplay-find-another"
        );

    if (!panel)
    {
        return 0;
    }

    // --------------------------------------------------
    // SHARED MODAL SYSTEM
    // --------------------------------------------------

    if (
        typeof geoplayMapUICloseModal !==
        "function"
    )
    {
        console.error(
            "GEOPLAY SEARCH: Shared modal system is unavailable."
        );

        return 0;
    }

    geoplayMapUICloseModal(
        window.geoplayFindAnotherUI,
        panel,
        function()
        {
            console.log(
                "GEOPLAY SEARCH: Closed using shared modal system."
            );
        }
    );

    // --------------------------------------------------
    // IMPORTANT:
    // DO NOT SHOW/HIDE STORY ACTIONS HERE.
    //
    // FIND ANOTHER / BROWSE were never hidden when
    // SEARCH opened.
    // --------------------------------------------------

    return 1;
}


// ==================================================
// END GEOPLAY SEARCH
// ==================================================