import { YOUTUBE_LINK } from "../../../constants.js";
import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";

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
  async run(_bot, controller) {
    const content = controller.formatter.hyperlink("Squid's YouTube", YOUTUBE_LINK, "dictionary");

    return controller.reply(content);
  }
});

export default discordCommand;
