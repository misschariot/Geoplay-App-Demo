// ------------------------------------
// DRAW ROBOT
// ------------------------------------

draw_set_alpha(image_alpha);

draw_self();


// ------------------------------------
// LOCATION FOUND MESSAGE
// ------------------------------------

if (
    robot_found_message_index > 0
    && !location_result_fading
)
{
    var displayed_text =
        string_copy(
            robot_found_message,
            1,
            robot_found_message_index
        );


    // --------------------------------
    // CAMERA POSITION
    // --------------------------------

    var camera_id = view_camera[0];

    var camera_x =
        camera_get_view_x(camera_id);

    var camera_y =
        camera_get_view_y(camera_id);

    var camera_width =
        camera_get_view_width(camera_id);

    var camera_height =
        camera_get_view_height(camera_id);


    // --------------------------------
    // TEXT POSITION
    // --------------------------------

    var text_x =
        obj_location_pin.x;

    var text_y =
        obj_location_pin.y
        - camera_height * 0.30;


    // --------------------------------
    // TEXT SETTINGS
    // --------------------------------

    draw_set_halign(fa_center);
    draw_set_valign(fa_middle);

    draw_set_color(c_white);

    draw_set_alpha(image_alpha);


    // --------------------------------
    // DRAW MESSAGE
    // --------------------------------

    draw_text_ext(
        text_x,
        text_y,
        displayed_text,
        24,
        camera_width * 0.80
    );


    // --------------------------------
    // RESET DRAW SETTINGS
    // --------------------------------

    draw_set_alpha(1);

    draw_set_halign(fa_left);
    draw_set_valign(fa_top);

    draw_set_color(c_white);
}


// ------------------------------------
// RESET DRAW ALPHA
// ------------------------------------

draw_set_alpha(1);