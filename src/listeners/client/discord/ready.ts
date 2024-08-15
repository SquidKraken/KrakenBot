import { TEXTUAL_INDICATORS } from "../../../config/messages.js";
import { createDiscordListener } from "../../../templates/DiscordTemplate.js";
import { discordLog } from "../../../utilities/logger.js";

const discordReady = createDiscordListener({
  name: "ready",
  runOnce: false,
  run() {
    void discordLog(TEXTUAL_INDICATORS.BOT_READY);
  }
});

export default discordReady;
