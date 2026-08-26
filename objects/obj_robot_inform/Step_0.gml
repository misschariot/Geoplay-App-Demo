// ------------------------------------
// ROCKET EXHAUST FX
// ------------------------------------

exhaust_time += 0.4;

// ------------------------------------
// POST-LOADING DELAY
// ------------------------------------

if (robot_loading_delay > 0 &&
    !robot_exiting)
{
    robot_loading_delay -= 1;

    exit;
}


// ------------------------------------
// START ROBOT ENTRANCE
// ------------------------------------

if (!robot_entering &&
    robot_enter_progress < 1 &&
    !robot_exiting &&
    robot_exit_delay <= 0)
{
    robot_entering = true;
}


// ------------------------------------
// ROBOT EXIT
// ------------------------------------

if (robot_exiting)
{
    robot_exit_progress += robot_exit_speed;


    if (robot_exit_progress >= 1)
    {
        robot_exit_progress = 1;

        image_alpha = 0;
        robot_exit_finished = true;
    }


    // --------------------------------
    // SMOOTH EXIT
    // --------------------------------

    var exit_t = robot_exit_progress;

    exit_t = 1 - power(1 - exit_t, 3);


    // --------------------------------
    // MOVE ROBOT OUT
    // --------------------------------

    x = lerp(
        robot_exit_start_x,
        robot_exit_target_x,
        exit_t
    );

    y = lerp(
        robot_exit_start_y,
        robot_exit_target_y,
        exit_t
    );


    // --------------------------------
    // ROTATE SLIGHTLY
    // --------------------------------

    image_angle = lerp(
        robot_exit_start_angle,
        robot_exit_target_angle,
        exit_t
    );


    // --------------------------------
    // FADE ROBOT
    // --------------------------------

    image_alpha = 1 - exit_t;

    exit;
}


// ------------------------------------
// TEXT FADE
// ------------------------------------

if (robot_text_fading && !robot_exiting)
{
    robot_text_alpha = lerp(
        robot_text_alpha,
        0,
        robot_text_fade_speed
    );


    if (robot_text_alpha < 0.01)
    {
        robot_text_alpha = 0;

        robot_text_fading = false;

        robot_exit_delay = room_speed * 0.10;
    }
}


// ------------------------------------
// ROBOT EXIT DELAY
// ------------------------------------

if (!robot_exiting && robot_exit_delay > 0)
{
    robot_exit_delay -= 1;


    if (robot_exit_delay <= 0)
    {
        robot_exiting = true;

        robot_exit_progress = 0;

        robot_exit_start_x = x;
        robot_exit_start_y = y;

        robot_exit_start_angle = image_angle;

        robot_exit_target_x = x + 300;
        robot_exit_target_y = y - 250;
    }
}


// ------------------------------------
// ROBOT ENTRANCE
// ------------------------------------

if (robot_entering &&
    !robot_exiting &&
    robot_exit_delay <= 0)
{
    robot_enter_progress += robot_enter_speed;


    // --------------------------------
    // LIMIT PROGRESS
    // --------------------------------

    if (robot_enter_progress >= 1)
    {
        robot_enter_progress = 1;
    }


    // --------------------------------
    // SMOOTH EASE-OUT
    // --------------------------------

    var t = robot_enter_progress;

    t = 1 - power(1 - t, 3);


    // --------------------------------
    // MOVE ROBOT TOWARD TARGET
    // --------------------------------

    x = lerp(
        robot_start_x,
        robot_target_x,
        t
    );

    y = lerp(
        robot_start_y,
        robot_target_y,
        t
    );


    // --------------------------------
    // SUBTLE ENTRANCE ARC
    // --------------------------------

    y += sin(t * pi) * -5;


    // --------------------------------
    // ENTRANCE FINISHED
    // --------------------------------

    if (robot_enter_progress >= 1)
    {
        robot_entering = false;

        // Capture the robot's exact final
        // position as the hover position.

        hover_start_y = y;

        // Reset the hover timer.

        hover_time = 0;
    }
}


// ------------------------------------
// IDLE FLOAT
// ------------------------------------
//
// IMPORTANT:
// This is completely separate from
// the entrance animation.
//
// Nothing else below changes Y.
// ------------------------------------

if (!robot_entering &&
    !robot_exiting &&
    robot_enter_progress >= 1)
{
    hover_time += 0.05;

    y =
        hover_start_y
        + sin(hover_time) * 8;
}


// ------------------------------------
// TYPING DELAY
// ------------------------------------

if (!robot_entering &&
    !robot_typing &&
    !robot_button_ready &&
    !robot_text_fading &&
    !robot_exiting &&
    robot_exit_delay <= 0 &&
    robot_loading_delay <= 0)
{
    if (robot_typing_delay > 0)
    {
        robot_typing_delay -= 1;
    }
    else
    {
        robot_typing = true;
    }
}


// ------------------------------------
// TYPING EFFECT
// ------------------------------------

if (robot_typing)
{
    robot_typing_timer += 1;


    if (robot_typing_timer >= robot_typing_speed)
    {
        robot_typing_timer = 0;

        robot_message_index += 1;


        // ------------------------------------
        // MESSAGE FINISHED
        // ------------------------------------

        if (robot_message_index >= string_length(robot_message))
        {
            robot_message_index =
                string_length(robot_message);

            robot_typing = false;

            robot_button_ready = true;
        }
    }
}


// ------------------------------------
// BUTTON DELAY
// ------------------------------------

if (robot_button_ready)
{
    if (robot_button_delay > 0)
    {
        robot_button_delay -= 1;
    }
    else
    {
        robot_button_ready = false;


        // --------------------------------
        // SHOW CHECK LOCATION BUTTON
        // --------------------------------

        if (instance_exists(obj_check_location))
        {
            obj_check_location.visible = true;
            obj_check_location.button_appearing = true;
        }
    }
}