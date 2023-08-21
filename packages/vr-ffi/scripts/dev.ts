import { OpenVR } from "../src/index.js";

const openVr = new OpenVR();

setInterval(() => {
  console.log("VR_IsHmdPresent:", openVr.api.VR_IsHmdPresent());
}, 5000);
