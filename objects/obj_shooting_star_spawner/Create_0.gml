// ------------------------------------
// INITIAL SPAWN DELAY
// ------------------------------------
//
// Let the screen establish itself first,
// then introduce the shooting stars.
//

spawn_timer =
    irandom_range(
        room_speed * 2,
        room_speed * 4
    );