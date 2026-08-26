// ------------------------------------
// FLOATING
// ------------------------------------

float_time += float_speed;

y = base_y + sin(float_time) * float_amount;


// ------------------------------------
// GENTLE TILT
// ------------------------------------

tilt_time += tilt_speed;

image_angle = sin(tilt_time) * tilt_amount;


// ------------------------------------
// SUBTLE DRIFT
// ------------------------------------

drift_time += drift_speed;

x = xstart + sin(drift_time) * drift_amount;


// ------------------------------------
// ROCKET EXHAUST FX
// ------------------------------------

exhaust_time += 0.4;


// ------------------------------------
// LOADING SCREEN TIMER
// ------------------------------------

loading_timer += 1;

if (loading_timer >= loading_duration)
{
    room_goto(rm_location_check);
}