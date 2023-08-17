## Creating new headset models

1. Build or get a 3D model of the headset
   - Make sure you make a note of the license if you got it from somewhere since legally we cannot put copyrighted assets in our repo (if no license can be found it is copyrighted by default)
   - TODO: Decide where to put license
1. Make sure the dimensions match the headset's real world dimensions with 1 unit equaling 1 meter
   - You can edit the model using [Blender](https://www.blender.org/download/)
1. Make sure the headset center point (between the eyes) is at the origin (coordinate `(0, 0, 0)`)
1. Make sure the headset is pointing forwards
   - X+ is to the right of the headset, X- is to left
   - Y+ is above the headset, Y- is below
   - Z+ is in front of the headset, Z- is behind
1. Export model (mesh and textures) as `.glb`
   - Note that you may need to remove transparency from all textures for rendering to work in the app
1. Place in this directory with the name being `MANUFACTURER-NAME.glb`
