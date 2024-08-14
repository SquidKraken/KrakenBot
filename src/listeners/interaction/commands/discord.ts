import { DISCORD_INVITE } from "../../../config/constants.js";
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
  async run(_bot, context) {
    const content = context.formatter.hyperlink("Squid's Discord Server", DISCORD_INVITE, "dictionary");

    return context.reply(content);
  }
});

export default discordCommand;
