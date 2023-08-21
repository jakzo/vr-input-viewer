import { declareBridgeApi } from "./tipc/main";

export const bridge = declareBridgeApi({
  async ping() {
    return true;
  },
});
