// ------------------------------------
// CAMERA CENTER POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// CENTER ROBOT VISUALLY ON SCREEN
// ------------------------------------

x = camera_x + camera_width * 0.5 + 120;
y = camera_y + camera_height * 0.5 - 75;


// Save center positions
xstart = x;
base_y = y;


// ------------------------------------
// FACE RIGHT
// ------------------------------------

image_xscale = -abs(image_xscale);


// ------------------------------------
// FLOATING MOTION
// ------------------------------------

float_time = 0;
float_speed = 0.08;
float_amount = 5;


// ------------------------------------
// GENTLE TILT
// ------------------------------------

tilt_time = 0;
tilt_speed = 0.05;
tilt_amount = 3;


// ------------------------------------
// SUBTLE DRIFT
// ------------------------------------

drift_time = 0;
drift_speed = 0.035;
drift_amount = 2;


// Starting rotation
image_angle = 0;


// ------------------------------------
// ROCKET EXHAUST FX
// ------------------------------------

exhaust_time = 0;


// ------------------------------------
// LOADING SCREEN TIMER
// ------------------------------------

loading_timer = 0;
loading_duration = room_speed * 3;