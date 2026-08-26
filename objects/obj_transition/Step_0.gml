if (transition_state == 0)
{
    transition_progress += transition_speed;

    if (transition_progress >= 1)
    {
        transition_progress = 1;

        room_goto(target_room);

        transition_state = 1;
        transition_progress = 0;
    }
}
else if (transition_state == 1)
{
    transition_progress += transition_speed;

    if (transition_progress >= 1)
    {
        instance_destroy();
    }
}