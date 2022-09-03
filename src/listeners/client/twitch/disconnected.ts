import type { TwitchTemplate } from "../../../templates/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const twitchDisconnected: TwitchTemplate<"disconnected"> = {
  name: "disconnected",
  runOnce: false,
  run(_bot, _client, reason) {
    void twitchLog(`Disconnected from server: ${reason}`);
  }
};

export default twitchDisconnected;
