// ------------------------------------
// BUTTON APPEARANCE
// ------------------------------------

if (button_appearing)
{
    button_appear_progress += button_appear_speed;


    if (button_appear_progress >= 1)
    {
        button_appear_progress = 1;
        button_appearing = false;
    }


    // --------------------------------
    // SMOOTH EASE-OUT
    // --------------------------------

    var t = button_appear_progress;

    t = 1 - power(1 - t, 3);


    // --------------------------------
    // SLIDE INTO POSITION
    // --------------------------------

    x = lerp(
        button_start_x,
        button_target_x,
        t
    );

    y = lerp(
        button_start_y,
        button_target_y,
        t
    );


    // --------------------------------
    // FADE IN
    // --------------------------------

    image_alpha = t;
}


// ------------------------------------
// BUTTON TAP DETECTION
// ------------------------------------

if (!button_pressed)
{
    if (device_mouse_check_button_pressed(0, mb_left))
    {
        var touch_x = device_mouse_x(0);
        var touch_y = device_mouse_y(0);


        if (point_in_rectangle(
            touch_x,
            touch_y,
            bbox_left,
            bbox_top,
            bbox_right,
            bbox_bottom
        ))
        {
            // ----------------------------
            // PUSH BUTTON DOWN
            // ----------------------------

            button_pressed = true;

            button_press_offset = 3;


            // ----------------------------
            // START BUTTON FADE
            // ----------------------------

            button_fading_out = true;


            // ----------------------------
            // START TEXT FADE
            // ----------------------------

            if (instance_exists(obj_robot_inform))
            {
                obj_robot_inform.robot_text_fading = true;
            }
        }
    }
}


// ------------------------------------
// BUTTON PRESS EFFECT
// ------------------------------------

if (button_pressed)
{
    button_press_offset = lerp(
        button_press_offset,
        0,
        0.25
    );


    if (button_press_offset < 0.1)
    {
        button_press_offset = 0;
    }
}


// ------------------------------------
// BUTTON FADE OUT
// ------------------------------------

if (button_fading_out)
{
    image_alpha = lerp(
        image_alpha,
        0,
        button_fade_speed
    );


    if (image_alpha < 0.01)
    {
        image_alpha = 0;

        button_fading_out = false;

        visible = false;
    }
}


// ------------------------------------
// WAIT FOR ROBOT TO FINISH EXIT
// ------------------------------------

if (instance_exists(obj_robot_inform))
{
    if (obj_robot_inform.robot_exit_finished)
    {
        room_goto(rm_location_map);
    }
}