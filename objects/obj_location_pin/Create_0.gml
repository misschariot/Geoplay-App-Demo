// ------------------------------------
// LOCATION PIN SETUP
// ------------------------------------

visible = false;

image_alpha = 0;


// ------------------------------------
// PIN SIZE
// ------------------------------------

pin_target_scale = 0.08;

image_xscale = pin_target_scale;
image_yscale = pin_target_scale;


// ------------------------------------
// CAMERA POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// PIN POSITION
// ------------------------------------

// Center the object's position using
// the active camera.

pin_center_offset_x = 0;
pin_center_offset_y = -25;


x =
    camera_x
    + camera_width * 0.5
    + pin_center_offset_x;


y =
    camera_y
    + camera_height * 0.5
    + pin_center_offset_y;


// ------------------------------------
// PIN VISUAL CORRECTION
// ------------------------------------

// The pin artwork is offset inside
// its sprite, so shift the visible
// artwork left to align it with
// the radar center.

pin_visual_offset_x = -43;


// ------------------------------------
// RADAR ORIGIN
// ------------------------------------

// This places the radar at the
// pointer/tip of the pin.

pin_radar_offset_y = 97;


// ------------------------------------
// PIN APPEARANCE
// ------------------------------------

pin_pop_active = false;

pin_pop_progress = 0;

pin_pop_speed = 0.08;

pin_pop_finished = false;


// ------------------------------------
// SUBTLE FLOAT
// ------------------------------------

pin_float_time = 0;

pin_float_speed = 0.035;

pin_float_amount = 2.0;


// ------------------------------------
// RADAR EFFECT
// ------------------------------------

pin_radar_active = false;

pin_radar_time = 0;


// Slower radar movement

pin_radar_speed = 0.008;


// ------------------------------------
// RADAR SETTINGS
// ------------------------------------

pin_radar_width = 95;

pin_radar_height = 18;

pin_radar_ring_count = 4;