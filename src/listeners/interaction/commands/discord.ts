import { COMMAND_DESCRIPTIONS, TEXTUAL_INDICATORS } from "../../../config/messages.js";
import { DISCORD_INVITE } from "../../../config/constants.js";
import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
import { LinkFormatType } from "../../../types/LinkFormatType.js";

const discordCommand = createCommand({
  name: "discord",
  description: COMMAND_DESCRIPTIONS.DISCORD,
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, context) {
    const content = context.formatter.hyperlink(TEXTUAL_INDICATORS.DISCORD_SERVER_TEXT, DISCORD_INVITE, LinkFormatType.Dictionary);

    return context.reply(content);
  }
});

export default discordCommand;
