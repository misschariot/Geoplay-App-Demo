// ------------------------------------
// ANIMATE LOADING DOTS
// ------------------------------------

loading_timer += 1;

if (loading_timer >= loading_speed)
{
    loading_timer = 0;

    loading_dots += 1;

    if (loading_dots > 3)
    {
        loading_dots = 0;
    }
}