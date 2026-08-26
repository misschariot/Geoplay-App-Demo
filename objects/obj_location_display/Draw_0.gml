// ============================================================
// obj_location_display
// DRAW EVENT
//
// Uses the same room-coordinate approach as the other screens.
// DO NOT use camera/display width scaling here.
//
// Room reference:
// 1920 x 1080
// ============================================================


// ------------------------------------------------------------
// CENTER OF THE ROOM
// ------------------------------------------------------------

var center_x = room_width * 0.5;


// ------------------------------------------------------------
// TARGET DISPLAY SIZES
//
// These are the intended sizes in the GameMaker room.
// GameMaker will scale the entire room for the device/browser.
// ------------------------------------------------------------

var header_width = 590;
var frame_width  = 620;
var info_width   = 620;
var button_width = 400;
var robot_width  = 205;


// ------------------------------------------------------------
// HELPER SCALE VALUES
// ------------------------------------------------------------

var header_scale =
    header_width / sprite_get_width(spr_location_found);

var frame_scale =
    frame_width / sprite_get_width(spr_pine_ridge_frame);

var info_scale =
    info_width / sprite_get_width(spr_pine_ridge_info);

var button_scale =
    button_width / sprite_get_width(spr_continue_button);

var robot_scale =
    robot_width / sprite_get_width(spr_robot_happy);


// ------------------------------------------------------------
// VERTICAL POSITIONS
//
// These keep the entire composition together.
// There is intentional but modest spacing between assets.
// ------------------------------------------------------------

var header_y = 135;

var frame_y = 370;

var info_y = 625;

var button_y = 850;


// ------------------------------------------------------------
// LOCATION FOUND HEADER
// ------------------------------------------------------------
//
// Center the sprite using its actual sprite origin.
// This prevents the sprite's origin from shifting the layout.
// ------------------------------------------------------------

var header_x =
    center_x
    - ((sprite_get_width(spr_location_found) *
        header_scale) * 0.5)
    + (sprite_get_xoffset(spr_location_found) * header_scale);

draw_sprite_ext(
    spr_location_found,
    0,
    header_x,
    header_y,
    header_scale,
    header_scale,
    0,
    c_white,
    image_alpha
);


// ------------------------------------------------------------
// PINE RIDGE FRAME
// ------------------------------------------------------------

var frame_x =
    center_x
    - ((sprite_get_width(spr_pine_ridge_frame) *
        frame_scale) * 0.5)
    + (sprite_get_xoffset(spr_pine_ridge_frame) * frame_scale);

draw_sprite_ext(
    spr_pine_ridge_frame,
    0,
    frame_x,
    frame_y,
    frame_scale,
    frame_scale,
    0,
    c_white,
    image_alpha
);


// ------------------------------------------------------------
// HAPPY ROBOT
// ------------------------------------------------------------
//
// Positioned at the upper-left corner of the Pine Ridge frame.
// It intentionally overlaps the frame slightly, matching the
// design we've been using.
//
// IMPORTANT:
// Draw AFTER the frame so the robot appears in front of it.
// ------------------------------------------------------------

var robot_x =
    center_x
    - (frame_width * 0.5)
    + (robot_width * 0.20);

var robot_y =
    frame_y
    - (frame_width * 0.13);


// Small floating animation
var robot_bob =
    sin(current_time * 0.004) * 4;

robot_y += robot_bob;


var robot_draw_x =
    robot_x
    - ((sprite_get_width(spr_robot_happy) *
        robot_scale) * 0.5)
    + (sprite_get_xoffset(spr_robot_happy) * robot_scale);

draw_sprite_ext(
    spr_robot_happy,
    0,
    robot_draw_x,
    robot_y,
    robot_scale,
    robot_scale,
    0,
    c_white,
    image_alpha
);


// ------------------------------------------------------------
// PINE RIDGE INFORMATION PANEL
// ------------------------------------------------------------

var info_x =
    center_x
    - ((sprite_get_width(spr_pine_ridge_info) *
        info_scale) * 0.5)
    + (sprite_get_xoffset(spr_pine_ridge_info) * info_scale);

draw_sprite_ext(
    spr_pine_ridge_info,
    0,
    info_x,
    info_y,
    info_scale,
    info_scale,
    0,
    c_white,
    image_alpha
);


// ------------------------------------------------------------
// CONTINUE BUTTON
// ------------------------------------------------------------

var button_x =
    center_x
    - ((sprite_get_width(spr_continue_button) *
        button_scale) * 0.5)
    + (sprite_get_xoffset(spr_continue_button) * button_scale);

draw_sprite_ext(
    spr_continue_button,
    0,
    button_x,
    button_y,
    button_scale,
    button_scale,
    0,
    c_white,
    image_alpha
);


// ------------------------------------------------------------
// RESET DRAW STATE
// ------------------------------------------------------------

draw_set_alpha(1);
draw_set_color(c_white);