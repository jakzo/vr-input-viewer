## Creating new controller layouts

> Tip: See [Generic.svg](./Generic.svg) for an example layout

1. Create an SVG file containing the visual layout of the controller
   - The elements representing buttons should include a specific `class` attribute depending on which button it represents
     - There should be three versions of each button in the SVG, each containing the following classes:
       - Untouched and unpressed = `button0`
       - Touched but unpressed = `button0 touched`
       - Pressed = `button0 pressed`
     - The class `button0` represents the first button (typically trigger), `button1` is the second (typically grip), etc.
       - See [InputViewer.ts](../../InputViewer.ts) for a list of the typical button assignments but be aware that different controllers may have different assignments than the standard ones
   - The elements representing axes should also include specific `class` attributes
     - The element that moves as part of the axis (eg. the thumbstick) should have the class `axis0x` where `0` is the axis index and `x` is the direction
     - If an element moves in both X and Y directions both `axis0x` and `axis1y` classes should be added to the element
     - Note that the axis index is different for X and Y
     - The bounds that the axis can move in are defined by the `data-factor` attribute
       - The `factor` is the number the axis value is multiplied by to determine the amount to move the element along its axis relative to its starting position
       - Typically axis values go from -1 to 1 (eg. a factor of 5 will move the element from -5 to 5)
1. Put the SVG file in this directory and name it `Name.svg` where `Name` is the name of the layout
   - If you have a separate layout for the right controller, name your SVG files `NameLeft.svg` and `NameRight.svg`
   - If they are the same, your layout SVG will be flipped horizontally for the right controller
1. Edit [layouts.ts](../layouts.ts) and import/add your SVG layout file to the list of layouts
   - If you have a separate layout for the right controller, add them both as a length-2 array (eg. `Name: [NameLeft, NameRight]`)
