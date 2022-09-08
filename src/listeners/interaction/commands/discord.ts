import { DISCORD_INVITE } from "../../../constants.js";
import { createCommand, PermissionFlags } from "../../../types/CommandTemplate.js";

const discordCommand = createCommand({
  name: "discord",
  description: "View Squid's Discord server's invite",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, controller) {
    const content = controller.formatter.hyperlink("Squid's Discord Server", DISCORD_INVITE, "dictionary");

    return controller.reply(content);
  }
});

export default discordCommand;
