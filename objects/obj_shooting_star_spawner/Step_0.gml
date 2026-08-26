// ------------------------------------
// COUNT DOWN
// ------------------------------------

spawn_timer -= 1;


// ------------------------------------
// SPAWN SHOOTING STAR
// ------------------------------------

if (spawn_timer <= 0)
{
    // --------------------------------
    // CREATE STAR
    // --------------------------------

    instance_create_layer(
        0,
        0,
        layer,
        obj_shooting_star
    );


    // --------------------------------
    // NEXT SPAWN DELAY
    // --------------------------------
    //
    // More frequent than before,
    // but still enough spacing that
    // the screen doesn't become crowded.
    //

    spawn_timer =
        irandom_range(
            room_speed * 3,
            room_speed * 6
        );
}