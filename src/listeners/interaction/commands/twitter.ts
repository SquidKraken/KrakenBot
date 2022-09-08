import { TWITTER_LINK } from "../../../constants.js";
import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";

const discordCommand = createCommand({
  name: "twitter",
  description: "View Squid's Twitter page link",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, controller) {
    const content = controller.formatter.hyperlink("Squid's Twitter", TWITTER_LINK, "dictionary");

    return controller.reply(content);
  }
});

export default discordCommand;