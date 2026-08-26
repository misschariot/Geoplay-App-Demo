// ------------------------------------
// CAMERA POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// POSITION
// ------------------------------------

// Center underneath the robot
x = camera_x + camera_width * 0.5 - 20;
y = camera_y + camera_height * 0.5 + 100;


// ------------------------------------
// LOADING DOTS
// ------------------------------------

loading_dots = 0;
loading_timer = 0;
loading_speed = 30;