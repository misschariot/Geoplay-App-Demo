var w = display_get_gui_width();
var h = display_get_gui_height();

draw_set_color(c_black);
draw_set_alpha(1);

if (transition_state == 0)
{
    // Wipe across the current screen
    var wipe_width = w * transition_progress;

    draw_rectangle(
        0,
        0,
        wipe_width,
        h,
        false
    );
}
else if (transition_state == 1)
{
    // Reveal the new screen
    var wipe_width = w * (1 - transition_progress);

    draw_rectangle(
        0,
        0,
        wipe_width,
        h,
        false
    );
}

draw_set_alpha(1);
draw_set_color(c_white);