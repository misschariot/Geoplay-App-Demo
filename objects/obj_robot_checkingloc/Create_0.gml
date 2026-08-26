// ------------------------------------
// ROBOT SEARCHING SETUP
// ------------------------------------

visible = true;

image_alpha = 1;


// ------------------------------------
// CAMERA POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// FIRST SEARCH ROBOT SIZE
// ------------------------------------

robot_search_scale = 0.06;

image_xscale = -robot_search_scale;
image_yscale = robot_search_scale;


// ------------------------------------
// OFF-SCREEN BUFFER
// ------------------------------------

var offscreen_buffer = 500;


// ------------------------------------
// FIRST ROBOT START
// ------------------------------------

robot_search_start_x =
    camera_x
    + camera_width
    + offscreen_buffer;

robot_search_start_y =
    camera_y
    + camera_height * 0.45;


// ------------------------------------
// FIRST ROBOT END
// ------------------------------------

robot_search_end_x =
    camera_x
    - offscreen_buffer;

robot_search_end_y =
    robot_search_start_y;


// ------------------------------------
// FIRST SEARCH ANIMATION
// ------------------------------------

robot_searching = true;

robot_search_progress = 0;

robot_search_speed = 0.0085;


// ------------------------------------
// HANDOFF PAUSE
// ------------------------------------

robot_search_pause = 0;

robot_search_pause_duration =
    room_speed * 0.08;


// ------------------------------------
// SECOND ROBOT
// ------------------------------------

robot_return_scale = 0.15;


// ------------------------------------
// SECOND ROBOT START
// ------------------------------------

robot_return_start_x =
    camera_x
    - offscreen_buffer;

robot_return_start_y =
    camera_y
    + camera_height * 0.45;


// ------------------------------------
// SECOND ROBOT TARGET
// ------------------------------------

robot_return_target_x = 0;

robot_return_target_y = 0;


// ------------------------------------
// SECOND ENTRANCE ANIMATION
// ------------------------------------

robot_returning = false;

robot_return_progress = 0;

robot_return_speed = 0.0045;


// ------------------------------------
// SECOND ROBOT IDLE / HOVER
// ------------------------------------

hover_start_y = 0;

hover_time = 0;


// ------------------------------------
// LOCATION FOUND MESSAGE
// ------------------------------------

robot_found_message =
    "We found a location nearby!";

robot_found_message_index = 0;

robot_found_typing = false;

robot_found_typing_timer = 0;


// ------------------------------------
// LOCATION FOUND MESSAGE DELAY
// ------------------------------------

robot_found_message_delay =
    room_speed * 0.4;

robot_found_typing_speed = 2;


// ------------------------------------
// LOCATION RESULT TRANSITION
// ------------------------------------

location_result_delay = 0;

location_result_delay_duration =
    room_speed * 1.0;

location_result_fading = false;

location_result_fade_speed = 0.06;


// ------------------------------------
// ANIMATION COMPLETE
// ------------------------------------

robot_sequence_finished = false;


// ------------------------------------
// INITIAL POSITION
// ------------------------------------

x = robot_search_start_x;

y = robot_search_start_y;