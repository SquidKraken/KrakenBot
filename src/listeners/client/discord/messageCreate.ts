import type { DiscordTemplate } from "../../../templates/DiscordTemplate.js";
import { discordLog } from "../../../utilities/logger.js";

const discordMessageCreate: DiscordTemplate<"messageCreate"> = {
  name: "messageCreate",
  runOnce: false,
  run(_bot, message) {
    void discordLog(message.content);
  }
};

export default discordMessageCreate;
