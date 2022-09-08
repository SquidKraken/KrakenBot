import { createTwitchListener } from "../../../types/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const twitchDisconnected = createTwitchListener({
  name: "disconnected",
  runOnce: false,
  run(_bot, _client, reason) {
    void twitchLog(`Disconnected from server: ${reason}`);
  }
});

export default twitchDisconnected;
