import path from "path";

export const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;

export const paths = {
  ffi: isDev
    ? path.join(__dirname, "..", "..", "..", "vr-ffi", "resources")
    : path.join(process.resourcesPath, "ffi"),
};
