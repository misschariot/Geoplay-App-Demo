// ------------------------------------
// LOCATION DISPLAY
// ------------------------------------

if (!location_display_active)
{
    exit;
}


// ------------------------------------
// INITIAL RESULT DELAY
// ------------------------------------

if (location_result_delay > 0)
{
    location_result_delay -= 1;

    exit;
}


// ------------------------------------
// START DISPLAY ANIMATION
// ------------------------------------

location_display_progress +=
    location_display_speed;

if (location_display_progress >= 1)
{
    location_display_progress = 1;
}


// ====================================
// HEADER
// ====================================

if (location_header_progress < 1)
{
    location_header_progress += 0.065;

    if (location_header_progress >= 1)
    {
        location_header_progress = 1;
    }
}


location_header_alpha =
    1 - power(
        1 - location_header_progress,
        3
    );


// ====================================
// HERO IMAGE
// ====================================
//
// Starts shortly after the header.
//

if (location_display_progress > 0.12)
{
    location_image_progress += 0.055;

    if (location_image_progress >= 1)
    {
        location_image_progress = 1;
    }
}


location_image_alpha =
    1 - power(
        1 - location_image_progress,
        3
    );


// ====================================
// LOCATION INFORMATION
// ====================================
//
// Begins after the casino image.
//

if (location_image_progress >= 0.75)
{
    location_info_progress += 0.065;

    if (location_info_progress >= 1)
    {
        location_info_progress = 1;
    }
}


location_info_alpha =
    1 - power(
        1 - location_info_progress,
        3
    );


// ====================================
// ROBOT
// ====================================
//
// Robot appears alongside the discovery
// header and casino image.
//

if (location_header_progress >= 0.55)
{
    location_robot_progress += 0.07;

    if (location_robot_progress >= 1)
    {
        location_robot_progress = 1;
    }
}


location_robot_alpha =
    1 - power(
        1 - location_robot_progress,
        3
    );


// ------------------------------------
// ROBOT FLOAT
// ------------------------------------

if (location_robot_progress >= 1)
{
    location_robot_float_time +=
        location_robot_float_speed;
}


// ====================================
// ACTION OPTIONS
// ====================================
//
// Appear after the location information.
//

if (location_info_progress >= 0.75)
{
    location_actions_progress += 0.055;

    if (location_actions_progress >= 1)
    {
        location_actions_progress = 1;
    }
}


location_actions_alpha =
    1 - power(
        1 - location_actions_progress,
        3
    );


// ====================================
// DISPLAY COMPLETE
// ====================================

if (
    location_actions_progress >= 1
    && !location_result_finished
)
{
    location_result_finished = true;
}