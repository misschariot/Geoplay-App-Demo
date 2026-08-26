// ---------------------------------------------------------
// ENTER BUTTON
// ---------------------------------------------------------

draw_sprite_ext(
    sprite_index,
    image_index,
    x,
    y + button_press_offset,
    image_xscale,
    image_yscale,
    image_angle,
    image_blend,
    image_alpha
);


// ---------------------------------------------------------
// "NEW HERE? SIGN UP"
// ---------------------------------------------------------

var button_width =
    sprite_get_width(sprite_index) * image_xscale;

var button_height =
    sprite_get_height(sprite_index) * image_yscale;


// The sprite origin is on the left side,
// so calculate the actual CENTER of the button.
var button_center_x =
    x + (button_width * 0.5);


// Put the text directly underneath the button.
var signup_y =
    y + button_height + signup_text_gap;


// ---------------------------------------------------------
// TEXT FORMATTING
// ---------------------------------------------------------

draw_set_font(fnt_poppins);
draw_set_halign(fa_left);
draw_set_valign(fa_middle);


// Text pieces
var text1 = "New here?";
var text2 = " Sign Up";


// Measure the complete phrase
var text1_width = string_width(text1);
var text2_width = string_width(text2);

var total_width =
    text1_width + text2_width;


// Start position so the COMPLETE phrase is centered
var text_x =
    button_center_x - (total_width * 0.5);


// ---------------------------------------------------------
// "New here?"
// ---------------------------------------------------------

draw_set_color(make_color_rgb(210, 215, 230));

draw_text(
    text_x,
    signup_y,
    text1
);


// ---------------------------------------------------------
// "Sign Up"
// ---------------------------------------------------------

draw_set_color(c_white);

draw_text(
    text_x + text1_width,
    signup_y,
    text2
);


// ---------------------------------------------------------
// RESTORE DRAW SETTINGS
// ---------------------------------------------------------

draw_set_color(c_white);
draw_set_halign(fa_left);
draw_set_valign(fa_top);