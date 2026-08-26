// Bubble position
var x1 = bubble_x;
var y1 = bubble_y;
var x2 = bubble_x + bubble_width;
var y2 = bubble_y + bubble_height;

// Bubble
draw_set_color(c_white);
draw_set_alpha(0.95);

draw_roundrect(
    x1,
    y1,
    x2,
    y2,
    false
);

// Bubble pointer
draw_triangle(
    room_width / 2 - 25,
    y2,
    room_width / 2 + 25,
    y2,
    room_width / 2,
    y2 + 35,
    false
);

// Text
draw_set_color(make_color_rgb(25, 35, 55));
draw_set_alpha(1);

draw_set_halign(fa_center);
draw_set_valign(fa_middle);

draw_text_ext(
    room_width / 2,
    y1 + bubble_height / 2,
    message,
    8,
    bubble_width - 60
);

// Reset drawing settings
draw_set_halign(fa_left);
draw_set_valign(fa_top);
draw_set_alpha(1);
draw_set_color(c_white);