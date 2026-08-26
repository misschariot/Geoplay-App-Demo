// ================================================
// obj_map_player - Create
// TEST: GameMaker sprite above MapLibre
// ================================================

visible = true;

// Put the avatar in the center of the GameMaker canvas.
x = room_width * 0.5;
y = room_height * 0.5;

// Make sure this object draws on top of other GameMaker objects.
depth = -100000;