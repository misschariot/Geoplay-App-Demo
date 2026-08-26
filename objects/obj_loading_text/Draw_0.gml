// ------------------------------------
// LOADING TEXT
// ------------------------------------

draw_set_font(fnt_poppins);

draw_set_halign(fa_left);
draw_set_valign(fa_middle);

draw_set_alpha(0.9);
draw_set_color(c_white);

// ------------------------------------
// CENTER "LOADING"
// ------------------------------------

var loading_width = string_width("Loading");

var loading_x = x - loading_width * 0.5;


// Draw the word
draw_text(
    loading_x,
    y,
    "Loading"
);


// ------------------------------------
// ANIMATED DOTS
// ------------------------------------

var dots = "";

if (loading_dots == 1)
{
    dots = ".";
}
else if (loading_dots == 2)
{
    dots = "..";
}
else if (loading_dots == 3)
{
    dots = "...";
}


// Draw dots immediately after "Loading"
draw_text(
    loading_x + loading_width,
    y,
    dots
);


// ------------------------------------
// RESET DRAW SETTINGS
// ------------------------------------

draw_set_alpha(1);
draw_set_color(c_white);
draw_set_halign(fa_left);
draw_set_valign(fa_top);