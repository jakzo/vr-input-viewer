> **🚧 Under construction, not everything works yet. 🚧**

Visualization of VR controller and headset inputs and positions. Useful for streams and recordings.

## ➡️ Quick links

- [Download VR Input Viewer](#TODO)
- [VR Input Viewer web version](#TODO) (for viewing inputs from another machine/device)
- [How to add new headsets and controller layouts](#🎮-how-to-add-new-headsets-and-controller-layouts)

## 🎮 How to add new headsets and controller layouts

- Clone this repository then follow [development setup instructions](#🛠️-development-setup) below
- Follow [instructions to add a new controller layout](./packages/vr-input-viewer/src/Controller/Layouts/README.md)
- Follow [instructions to add a new headset model](./packages/vr-input-viewer/assets/headsets/README.md)
- Follow [instructions to add a new controller model](#TODO)
- Open a pull request with your changes so that everyone can use your new layout/headset 🙂

## 🛠️ Development setup

- Install [Node.js](https://nodejs.org/en/download)
  - Recommended: Install [nvm](https://github.com/nvm-sh/nvm) instead of Node.js and run `nvm install`/`nvm use` in this repository
- Install [Flatbuffers](https://flatbuffers.dev/)
  - Installing Flatbuffers is not required if you will not be modifying the input data format
  - Mac: `brew install flatbuffers`
- Install dependencies
  - `npm install`
- Run the input viewer locally
  - Desktop app: `npm -w @jakzo/vr-input-viewer-desktop run start`
  - Web app: `npm -w @jakzo/vr-input-viewer-web run dev`
