import { YOUTUBE_LINK } from "../../../config/constants.js";
import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
import { LinkFormatType } from "../../../types/LinkFormatType.js";

const discordCommand = createCommand({
  name: "youtube",
  description: "View Squid's YouTube channel link",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, context) {
    const content = context.formatter.hyperlink("Squid's YouTube", YOUTUBE_LINK, LinkFormatType.Dictionary);

    return context.reply(content);
  }
});

export default discordCommand;
