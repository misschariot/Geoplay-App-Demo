// ------------------------------------
// CAMERA POSITION
// ------------------------------------

var camera_id = view_camera[0];

var camera_x = camera_get_view_x(camera_id);
var camera_y = camera_get_view_y(camera_id);

var camera_width = camera_get_view_width(camera_id);
var camera_height = camera_get_view_height(camera_id);


// ------------------------------------
// STAR POSITION
// ------------------------------------
//
// Keep stars within the visible interface
// instead of using the full room dimensions.
//

star_y =
    camera_y
    + random_range(
        camera_height * 0.08,
        camera_height * 0.65
    );


// ------------------------------------
// STAR SPEED
// ------------------------------------
//
// Fast enough to feel like a shooting star,
// but not so fast that it becomes distracting.
//

star_speed = random_range(9, 13);


// ------------------------------------
// STAR LIFETIME
// ------------------------------------

star_life = 0;

star_max_life =
    irandom_range(90, 110);


// ------------------------------------
// STAR DIRECTION
// ------------------------------------

if (random(1) < 0.5)
{
    // --------------------------------
    // LEFT → RIGHT
    // --------------------------------

    star_x =
        camera_x - 100;

    star_dx =
        star_speed;

    star_dy =
        star_speed
        * random_range(0.25, 0.35);
}
else
{
    // --------------------------------
    // RIGHT → LEFT
    // --------------------------------

    star_x =
        camera_x
        + camera_width
        + 100;

    star_dx =
        -star_speed;

    star_dy =
        star_speed
        * random_range(0.25, 0.35);
}