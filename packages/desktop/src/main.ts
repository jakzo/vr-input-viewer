import { app, BrowserWindow } from "electron";
import isElectronSquirrelStartup from "electron-squirrel-startup";
import path from "path";

import { mainListenBridge } from "./tipc/main";
import { vrFfiBridge } from "./vr-ffi-bridge";
import { isDev } from "./env";

if (isElectronSquirrelStartup) {
  app.quit();
} else {
  const createWindow = () => {
    const win = new BrowserWindow({
      width: isDev ? 1600 : 600,
      height: isDev ? 900 : 600,
      autoHideMenuBar: true,
      transparent: true,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        backgroundThrottling: false,
      },
    });

    if (isDev) {
      win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      win.webContents.openDevTools();
    } else {
      win.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      );
    }
  };

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  mainListenBridge(vrFfiBridge);
}
