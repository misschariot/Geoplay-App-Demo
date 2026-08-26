// ------------------------------------
// MOVE SHOOTING STAR
// ------------------------------------

star_x += star_dx;
star_y += star_dy;


// ------------------------------------
// STAR LIFETIME
// ------------------------------------

star_life += 1;


// ------------------------------------
// DESTROY WHEN FINISHED
// ------------------------------------

if (star_life >= star_max_life)
{
    instance_destroy();
}