import type { DiscordTemplate } from "../../../templates/DiscordTemplate.js";
import { discordLog } from "../../../utilities/logger.js";

const discordReady: DiscordTemplate<"ready"> = {
  name: "ready",
  runOnce: false,
  run() {
    void discordLog("Bot is ready!");
  }
};

export default discordReady;
