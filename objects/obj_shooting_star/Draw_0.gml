// ------------------------------------
// STAR FADE
// ------------------------------------

var progress =
    star_life / star_max_life;


// ------------------------------------
// FADE IN
// ------------------------------------

var fade_in =
    clamp(
        progress / 0.15,
        0,
        1
    );


// ------------------------------------
// FADE OUT
// ------------------------------------

var fade_out =
    clamp(
        (1 - progress) / 0.20,
        0,
        1
    );


var final_alpha =
    min(
        fade_in,
        fade_out
    );


// ------------------------------------
// STAR TAIL
// ------------------------------------

var tail_segments = 12;

for (var i = 0; i < tail_segments; i++)
{
    var tail_progress =
        i / tail_segments;


    var tail_x =
        star_x
        - star_dx
        * tail_progress
        * 4;


    var tail_y =
        star_y
        - star_dy
        * tail_progress
        * 4;


    var tail_alpha =
        final_alpha
        * (1 - tail_progress)
        * 0.45;


    var tail_size =
        2.5
        * (1 - tail_progress)
        + 0.5;


    draw_set_color(
        make_color_rgb(
            100,
            210,
            255
        )
    );

    draw_set_alpha(
        tail_alpha
    );


    draw_circle(
        tail_x,
        tail_y,
        tail_size,
        false
    );
}


// ------------------------------------
// BRIGHT STAR HEAD
// ------------------------------------

draw_set_color(c_white);

draw_set_alpha(
    final_alpha
);


draw_circle(
    star_x,
    star_y,
    3.5,
    false
);


// ------------------------------------
// SOFT GLOW
// ------------------------------------

draw_set_color(
    make_color_rgb(
        100,
        220,
        255
    )
);

draw_set_alpha(
    final_alpha * 0.35
);


draw_circle(
    star_x,
    star_y,
    7,
    false
);


// ------------------------------------
// RESET DRAW SETTINGS
// ------------------------------------

draw_set_alpha(1);

draw_set_color(c_white);