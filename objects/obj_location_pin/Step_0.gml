// ------------------------------------
// PIN APPEARANCE
// ------------------------------------

if (pin_pop_active)
{
    pin_pop_progress += pin_pop_speed;


    // --------------------------------
    // FINISH APPEARANCE
    // --------------------------------

    if (pin_pop_progress >= 1)
    {
        pin_pop_progress = 1;

        pin_pop_active = false;

        pin_pop_finished = true;

        image_xscale = pin_target_scale;
        image_yscale = pin_target_scale;

        image_alpha = 1;


        // --------------------------------
        // START RADAR
        // --------------------------------

        pin_radar_active = true;

        pin_radar_time = 0;
    }


    // --------------------------------
    // SMOOTH APPEARANCE
    // --------------------------------

    var t = pin_pop_progress;

    var smooth_t =
        1 - power(1 - t, 3);


    // --------------------------------
    // START SMALL
    // --------------------------------

    var start_scale =
        pin_target_scale * 0.35;


    var current_scale =
        lerp(
            start_scale,
            pin_target_scale,
            smooth_t
        );


    image_xscale = current_scale;
    image_yscale = current_scale;


    // --------------------------------
    // FADE IN
    // --------------------------------

    image_alpha = smooth_t;
}


// ------------------------------------
// FLOATING EFFECT
// ------------------------------------

if (pin_pop_finished)
{
    pin_float_time += pin_float_speed;
}


// ------------------------------------
// RADAR ANIMATION
// ------------------------------------

if (pin_radar_active)
{
    pin_radar_time += pin_radar_speed;


    // Restart continuously

    if (pin_radar_time >= 1)
    {
        pin_radar_time = 0;
    }
}