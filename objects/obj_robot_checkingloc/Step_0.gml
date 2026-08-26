// ------------------------------------
// FIRST SEARCH FLIGHT
// ------------------------------------

if (robot_searching)
{
    robot_search_progress += robot_search_speed;


    // --------------------------------
    // FINISH FIRST SEARCH
    // --------------------------------

    if (robot_search_progress >= 1)
    {
        robot_search_progress = 1;

        robot_searching = false;

        visible = false;


        // --------------------------------
        // SHOW LOCATION PIN
        // --------------------------------

        if (instance_exists(obj_location_pin))
        {
            obj_location_pin.visible = true;

            obj_location_pin.pin_pop_active = true;

            obj_location_pin.pin_pop_progress = 0;

            obj_location_pin.pin_pop_finished = false;

            obj_location_pin.pin_radar_active = false;

            obj_location_pin.image_alpha = 0;

            obj_location_pin.image_xscale = 0;

            obj_location_pin.image_yscale = 0;


            // --------------------------------
            // SECOND ROBOT TARGET
            // --------------------------------

            robot_return_target_x =
                obj_location_pin.x - 255;

            robot_return_target_y =
                obj_location_pin.y - 120;
        }


        // --------------------------------
        // START HANDOFF PAUSE
        // --------------------------------

        robot_search_pause =
            robot_search_pause_duration;
    }


    // --------------------------------
    // SMOOTH FLIGHT
    // --------------------------------

    var t = robot_search_progress;

    t =
        1 - power(1 - t, 3);


    // --------------------------------
    // MOVE RIGHT → LEFT
    // --------------------------------

    x =
        lerp(
            robot_search_start_x,
            robot_search_end_x,
            t
        );

    y =
        lerp(
            robot_search_start_y,
            robot_search_end_y,
            t
        );
}


// ------------------------------------
// HANDOFF TO SECOND ENTRANCE
// ------------------------------------

if (
    !robot_searching
    && !robot_returning
    && !robot_sequence_finished
)
{
    if (robot_search_pause > 0)
    {
        robot_search_pause -= 1;
    }
    else
    {
        robot_returning = true;

        robot_return_progress = 0;

        visible = true;

        image_alpha = 1;


        // --------------------------------
        // ROBOT SCALE
        // --------------------------------

        image_xscale =
            robot_return_scale;

        image_yscale =
            robot_return_scale;


        // --------------------------------
        // START FAR OFF-SCREEN
        // --------------------------------

        x =
            robot_return_start_x;

        y =
            robot_return_start_y;
    }
}


// ------------------------------------
// SECOND ROBOT ENTRANCE
// ------------------------------------

if (robot_returning)
{
    robot_return_progress +=
        robot_return_speed;


    // --------------------------------
    // FINISH SECOND ENTRANCE
    // --------------------------------

    if (robot_return_progress >= 1)
    {
        robot_return_progress = 1;

        robot_returning = false;

        robot_sequence_finished = true;


        // --------------------------------
        // START ROBOT HOVER
        // --------------------------------

        hover_start_y =
            robot_return_target_y;

        hover_time = 0;


        // --------------------------------
        // RESET MESSAGE
        // --------------------------------

        robot_found_message_index = 0;

        robot_found_typing = false;

        robot_found_typing_timer = 0;

        robot_found_message_delay =
            room_speed * 0.4;
    }


    // --------------------------------
    // SMOOTH ENTRANCE
    // --------------------------------

    var return_t =
        robot_return_progress;

    return_t =
        1 - power(1 - return_t, 3);


    // --------------------------------
    // MOVE LEFT → TARGET
    // --------------------------------

    x =
        lerp(
            robot_return_start_x,
            robot_return_target_x,
            return_t
        );

    y =
        lerp(
            robot_return_start_y,
            robot_return_target_y,
            return_t
        );
}


// ------------------------------------
// ROBOT IDLE / HOVER
// ------------------------------------

if (
    robot_sequence_finished
    && !robot_returning
    && !location_result_fading
)
{
    hover_time += 0.05;

    y =
        hover_start_y
        + sin(hover_time) * 5;
}


// ------------------------------------
// LOCATION FOUND MESSAGE DELAY
// ------------------------------------

if (
    robot_sequence_finished
    && !robot_returning
    && !robot_found_typing
    && robot_found_message_index <
       string_length(robot_found_message)
    && !location_result_fading
)
{
    if (robot_found_message_delay > 0)
    {
        robot_found_message_delay -= 1;
    }
    else
    {
        robot_found_typing = true;
    }
}


// ------------------------------------
// LOCATION FOUND MESSAGE TYPING
// ------------------------------------

if (robot_found_typing)
{
    robot_found_typing_timer += 1;


    if (
        robot_found_typing_timer >=
        robot_found_typing_speed
    )
    {
        robot_found_typing_timer = 0;

        robot_found_message_index += 1;


        // --------------------------------
        // MESSAGE FINISHED
        // --------------------------------

        if (
            robot_found_message_index >=
            string_length(robot_found_message)
        )
        {
            robot_found_message_index =
                string_length(robot_found_message);

            robot_found_typing = false;


            // --------------------------------
            // START RESULT PAUSE
            // --------------------------------

            location_result_delay =
                location_result_delay_duration;
        }
    }
}


// ------------------------------------
// RESULT TRANSITION DELAY
// ------------------------------------

if (
    robot_sequence_finished
    && !robot_returning
    && !robot_found_typing
    && !location_result_fading
    && location_result_delay > 0
)
{
    location_result_delay -= 1;


    if (location_result_delay <= 0)
    {
        location_result_fading = true;
    }
}


// ------------------------------------
// FADE OUT OLD LOCATION SEQUENCE
// ------------------------------------

if (location_result_fading)
{
    // --------------------------------
    // FADE ROBOT
    // --------------------------------

    image_alpha =
        max(
            0,
            image_alpha - location_result_fade_speed
        );


    // --------------------------------
    // FADE LOCATION PIN
    // --------------------------------

    if (instance_exists(obj_location_pin))
    {
        obj_location_pin.image_alpha =
            max(
                0,
                obj_location_pin.image_alpha
                - location_result_fade_speed
            );


        // --------------------------------
        // STOP RADAR
        // --------------------------------

        obj_location_pin.pin_radar_active = false;
    }


    // --------------------------------
    // FINISH FADE
    // --------------------------------

    if (image_alpha <= 0)
    {
        visible = false;

        location_result_fading = false;


        // --------------------------------
        // COMPLETELY HIDE LOCATION PIN
        // --------------------------------

        if (instance_exists(obj_location_pin))
        {
            obj_location_pin.visible = false;

            obj_location_pin.image_alpha = 0;

            obj_location_pin.pin_radar_active = false;

            obj_location_pin.pin_pop_active = false;
        }


        // --------------------------------
        // SHOW LOCATION RESULTS
        // --------------------------------

        if (instance_exists(obj_location_display))
        {
            obj_location_display.visible = true;

            obj_location_display.image_alpha = 1;

            // --------------------------------
            // START NEW RESULTS DISPLAY
            // --------------------------------

            obj_location_display.location_display_active = true;

            obj_location_display.location_display_progress = 0;

            obj_location_display.location_result_delay =
                room_speed * 0.25;

            obj_location_display.location_header_progress = 0;

            obj_location_display.location_header_alpha = 0;

            obj_location_display.location_image_progress = 0;

            obj_location_display.location_image_alpha = 0;

            obj_location_display.location_info_progress = 0;

            obj_location_display.location_info_alpha = 0;

            obj_location_display.location_actions_progress = 0;

            obj_location_display.location_actions_alpha = 0;

            obj_location_display.location_robot_progress = 0;

            obj_location_display.location_robot_alpha = 0;

            obj_location_display.location_robot_float_time = 0;

            obj_location_display.location_result_finished = false;
        }
    }
}