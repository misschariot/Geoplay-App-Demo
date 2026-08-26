// ------------------------------------
// PIN FLOAT POSITION
// ------------------------------------

var pin_draw_y = y;


// ------------------------------------
// SUBTLE FLOAT
// ------------------------------------

if (pin_pop_finished)
{
    pin_draw_y =
        y
        + sin(pin_float_time)
        * pin_float_amount;
}


// ------------------------------------
// RADAR ORIGIN
// ------------------------------------

// The radar follows the pin's
// floating movement.

var radar_x = x;

var radar_y =
    pin_draw_y
    + pin_radar_offset_y;


// ------------------------------------
// DRAW RADAR RINGS
// ------------------------------------

if (pin_radar_active)
{
    draw_set_color(make_color_rgb(0, 180, 255));


    for (
        var i = 0;
        i < pin_radar_ring_count;
        i++
    )
    {
        // --------------------------------
        // STAGGER EACH RING
        // --------------------------------

        var ring_phase =
            pin_radar_time
            + (i / pin_radar_ring_count);


        // Keep the value between 0 and 1

        ring_phase =
            ring_phase
            - floor(ring_phase);


        // --------------------------------
        // RING SIZE
        // --------------------------------

        var ring_width =
            lerp(
                12,
                pin_radar_width,
                ring_phase
            );


        var ring_height =
            lerp(
                4,
                pin_radar_height,
                ring_phase
            );


        // --------------------------------
        // RING FADE
        // --------------------------------

        var ring_alpha =
            1 - ring_phase;


        // Keep the radar subtle

        ring_alpha *= 0.40;


        draw_set_alpha(ring_alpha);


        // --------------------------------
        // DRAW ELLIPTICAL RING
        // --------------------------------

        draw_ellipse(
            radar_x - ring_width,
            radar_y - ring_height,
            radar_x + ring_width,
            radar_y + ring_height,
            false
        );
    }


    // --------------------------------
    // RADAR CENTER
    // --------------------------------

    draw_set_alpha(0.55);

    draw_circle(
        radar_x,
        radar_y,
        4,
        false
    );


    // --------------------------------
    // RESET DRAW SETTINGS
    // --------------------------------

    draw_set_alpha(1);

    draw_set_color(c_white);
}


// ------------------------------------
// DRAW LOCATION PIN
// ------------------------------------

// Shift the visible pin artwork so it
// remains aligned with the radar center.

draw_sprite_ext(
    sprite_index,
    image_index,
    x + pin_visual_offset_x,
    pin_draw_y,
    image_xscale,
    image_yscale,
    image_angle,
    image_blend,
    image_alpha
);