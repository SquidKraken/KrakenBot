import { createTwitchListener } from "../../../templates/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const twitchConnecting = createTwitchListener({
  name: "connecting",
  runOnce: false,
  run(_bot, _client, address, port) {
    void twitchLog(`Connecting to server on ${address}:${port}`);
  }
});

export default twitchConnecting;
