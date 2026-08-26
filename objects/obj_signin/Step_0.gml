if (button_pressed)
{
    button_press_offset = lerp(button_press_offset, 0, 0.25);

    if (button_press_offset < 0.1)
    {
        button_press_offset = 0;
        button_pressed = false;
    }
}