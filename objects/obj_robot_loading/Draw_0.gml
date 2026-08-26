// ------------------------------------
// DRAW ROBOT
// ------------------------------------

draw_self();


// ------------------------------------
// ROCKET EXHAUST FX
// ------------------------------------

var exhaust_x = x - 175;
var exhaust_y = y + 105;


// ------------------------------------
// FLOWING MOTION
// ------------------------------------

var flow = exhaust_time;


// ------------------------------------
// ADDITIVE BLENDING
// ------------------------------------

gpu_set_blendmode(bm_add);


// ------------------------------------
// PARTICLE 1
// ------------------------------------

var p1 = frac(flow * 0.035);

var p1_x = exhaust_x - p1 * 160;
var p1_y = exhaust_y + sin(flow * 0.08) * 8;

var p1_alpha = 0.8 * (1 - p1);
var p1_size = 3 * (1 - p1) + 1;

draw_set_alpha(p1_alpha);
draw_set_color(make_color_rgb(140, 240, 255));

draw_circle(p1_x, p1_y, p1_size, false);


// ------------------------------------
// PARTICLE 2
// ------------------------------------

var p2 = frac(flow * 0.028 + 0.35);

var p2_x = exhaust_x - p2 * 145;
var p2_y = exhaust_y + sin(flow * 0.07 + 2) * 10;

var p2_alpha = 0.65 * (1 - p2);
var p2_size = 2.5 * (1 - p2) + 0.8;

draw_set_alpha(p2_alpha);
draw_set_color(make_color_rgb(80, 210, 255));

draw_circle(p2_x, p2_y, p2_size, false);


// ------------------------------------
// PARTICLE 3
// ------------------------------------

var p3 = frac(flow * 0.042 + 0.65);

var p3_x = exhaust_x - p3 * 130;
var p3_y = exhaust_y + sin(flow * 0.1 + 4) * 7;

var p3_alpha = 0.55 * (1 - p3);
var p3_size = 2 * (1 - p3) + 0.5;

draw_set_alpha(p3_alpha);
draw_set_color(make_color_rgb(180, 250, 255));

draw_circle(p3_x, p3_y, p3_size, false);


// ------------------------------------
// PARTICLE 4
// ------------------------------------

var p4 = frac(flow * 0.05 + 0.15);

var p4_x = exhaust_x - p4 * 170;
var p4_y = exhaust_y + sin(flow * 0.12 + 1) * 9;

var p4_alpha = 0.7 * (1 - p4);
var p4_size = 2.2 * (1 - p4) + 0.6;

draw_set_alpha(p4_alpha);
draw_set_color(make_color_rgb(120, 230, 255));

draw_circle(p4_x, p4_y, p4_size, false);


// ------------------------------------
// PARTICLE 5
// ------------------------------------

var p5 = frac(flow * 0.06 + 0.45);

var p5_x = exhaust_x - p5 * 140;
var p5_y = exhaust_y + sin(flow * 0.09 + 3) * 12;

var p5_alpha = 0.6 * (1 - p5);
var p5_size = 1.8 * (1 - p5) + 0.5;

draw_set_alpha(p5_alpha);
draw_set_color(make_color_rgb(70, 190, 255));

draw_circle(p5_x, p5_y, p5_size, false);


// ------------------------------------
// PARTICLE 6
// ------------------------------------

var p6 = frac(flow * 0.045 + 0.8);

var p6_x = exhaust_x - p6 * 150;
var p6_y = exhaust_y + sin(flow * 0.11 + 5) * 6;

var p6_alpha = 0.75 * (1 - p6);
var p6_size = 1.6 * (1 - p6) + 0.4;

draw_set_alpha(p6_alpha);
draw_set_color(make_color_rgb(190, 250, 255));

draw_circle(p6_x, p6_y, p6_size, false);


// ------------------------------------
// PARTICLE 7
// ------------------------------------

var p7 = frac(flow * 0.055 + 0.2);

var p7_x = exhaust_x - p7 * 155;
var p7_y = exhaust_y + sin(flow * 0.13 + 2) * 14;

var p7_alpha = 0.55 * (1 - p7);
var p7_size = 1.7 * (1 - p7) + 0.4;

draw_set_alpha(p7_alpha);
draw_set_color(make_color_rgb(100, 220, 255));

draw_circle(p7_x, p7_y, p7_size, false);


// ------------------------------------
// PARTICLE 8
// ------------------------------------

var p8 = frac(flow * 0.047 + 0.55);

var p8_x = exhaust_x - p8 * 180;
var p8_y = exhaust_y + sin(flow * 0.095 + 4) * 11;

var p8_alpha = 0.5 * (1 - p8);
var p8_size = 1.5 * (1 - p8) + 0.4;

draw_set_alpha(p8_alpha);
draw_set_color(make_color_rgb(150, 240, 255));

draw_circle(p8_x, p8_y, p8_size, false);


// ------------------------------------
// PARTICLE 9
// ------------------------------------

var p9 = frac(flow * 0.065 + 0.75);

var p9_x = exhaust_x - p9 * 135;
var p9_y = exhaust_y + sin(flow * 0.14 + 5) * 9;

var p9_alpha = 0.6 * (1 - p9);
var p9_size = 1.4 * (1 - p9) + 0.3;

draw_set_alpha(p9_alpha);
draw_set_color(make_color_rgb(80, 200, 255));

draw_circle(p9_x, p9_y, p9_size, false);


// ------------------------------------
// PARTICLE 10
// ------------------------------------

var p10 = frac(flow * 0.038 + 0.9);

var p10_x = exhaust_x - p10 * 190;
var p10_y = exhaust_y + sin(flow * 0.085 + 1) * 13;

var p10_alpha = 0.45 * (1 - p10);
var p10_size = 1.3 * (1 - p10) + 0.3;

draw_set_alpha(p10_alpha);
draw_set_color(make_color_rgb(180, 250, 255));

draw_circle(p10_x, p10_y, p10_size, false);


// ------------------------------------
// RESET DRAW SETTINGS
// ------------------------------------

draw_set_alpha(1);
draw_set_color(c_white);

gpu_set_blendmode(bm_normal);