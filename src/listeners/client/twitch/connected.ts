import type { TwitchTemplate } from "../../../templates/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const twitchConnected: TwitchTemplate<"connected"> = {
  name: "connected",
  runOnce: false,
  run(_bot, _client, address, port) {
    void twitchLog(`Connected to server on ${address}:${port}`);
  }
};

export default twitchConnected;
