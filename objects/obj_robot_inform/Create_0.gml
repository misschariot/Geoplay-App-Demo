// ------------------------------------
// CAMERA POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// ROBOT SIZE
// ------------------------------------

image_xscale = 0.30;
image_yscale = 0.30;


// ------------------------------------
// POST-LOADING DELAY
// ------------------------------------

robot_loading_delay = room_speed * .1;


// ------------------------------------
// ROBOT ENTRANCE
// ------------------------------------

robot_entering = false;
robot_enter_progress = 0;
robot_enter_speed = 0.010;


// ------------------------------------
// TARGET POSITION
// ------------------------------------

robot_target_x =
    camera_x + camera_width * 0.5 - 160;

robot_target_y =
    camera_y + camera_height * 0.27;


// ------------------------------------
// START POSITION
// ------------------------------------

var robot_scaled_width =
    sprite_get_width(sprite_index) * abs(image_xscale);

var robot_scaled_height =
    sprite_get_height(sprite_index) * abs(image_yscale);


// ------------------------------------
// OFF-SCREEN BUFFER
// ------------------------------------

var robot_offscreen_buffer = 20;


// ------------------------------------
// START POSITION
// ------------------------------------

robot_start_x =
    camera_x
    - robot_scaled_width
    - robot_offscreen_buffer;

robot_start_y =
    camera_y
    - robot_scaled_height
    - robot_offscreen_buffer;


// ------------------------------------
// INITIAL ROBOT POSITION
// ------------------------------------

x = robot_start_x;
y = robot_start_y;

image_alpha = 1;


// ------------------------------------
// IDLE FLOAT
// ------------------------------------

// Same system as obj_robot

hover_start_y = 0;
hover_time = 0;


// ------------------------------------
// ROCKET EXHAUST FX
// ------------------------------------

exhaust_time = 0;


// ------------------------------------
// TYPING MESSAGE
// ------------------------------------

robot_message =
    "Hey! Let's check if Geoplay is available at your location.";

robot_message_index = 0;

robot_typing = false;
robot_typing_timer = 0;

robot_typing_speed = 2;


// ------------------------------------
// TYPING DELAY
// ------------------------------------

robot_typing_delay = room_speed * 0.3;


// ------------------------------------
// BUTTON DELAY
// ------------------------------------

robot_button_delay = room_speed * 0.7;

robot_button_ready = false;


// ------------------------------------
// TEXT FADE
// ------------------------------------

robot_text_alpha = 1;
robot_text_fading = false;
robot_text_fade_speed = 0.045;


// ------------------------------------
// ROBOT EXIT
// ------------------------------------

robot_exiting = false;
robot_exit_progress = 0;
robot_exit_speed = 0.025;

robot_exit_start_x = 0;
robot_exit_start_y = 0;

robot_exit_target_x = 0;
robot_exit_target_y = 0;

robot_exit_start_angle = 0;
robot_exit_target_angle = 18;


// ------------------------------------
// ROBOT EXIT DELAY
// ------------------------------------

robot_exit_delay = 0;
robot_exit_finished = false;