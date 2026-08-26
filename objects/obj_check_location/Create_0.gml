// ------------------------------------
// BUTTON SETUP
// ------------------------------------

visible = false;

image_alpha = 0;


// ------------------------------------
// BUTTON SIZE
// ------------------------------------

// Match the ENTER button proportions.
image_xscale = 0.15;
image_yscale = 0.15;


// ------------------------------------
// CAMERA POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// BUTTON SIZE IN ROOM PIXELS
// ------------------------------------

var button_width =
    sprite_get_width(sprite_index) * image_xscale;

var button_height =
    sprite_get_height(sprite_index) * image_yscale;


// ------------------------------------
// BUTTON POSITION
// ------------------------------------
//
// CHECK LOCATION sits below the robot.
//

button_target_x =
    camera_x
    + (camera_width - button_width) * 0.5;

button_target_y =
    camera_y
    + camera_height * 0.76;


// ------------------------------------
// START POSITION
// ------------------------------------

button_start_x =
    button_target_x;

button_start_y =
    button_target_y + 25;


// ------------------------------------
// BUTTON APPEARANCE
// ------------------------------------

button_appearing = false;

button_appear_progress = 0;

button_appear_speed = 0.025;


// ------------------------------------
// BUTTON PRESS EFFECT
// ------------------------------------

button_pressed = false;

button_press_offset = 0;


// ------------------------------------
// BUTTON FADE OUT
// ------------------------------------

button_fading_out = false;

button_fade_speed = 0.045;


// ------------------------------------
// LOCATION CHECK TRANSITION
// ------------------------------------

location_check_timer = 0;