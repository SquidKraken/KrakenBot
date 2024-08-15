import { COMMAND_DESCRIPTIONS } from "../../../config/messages.js";
import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";

const introduceCommand = createCommand({
  name: "introduce",
  description: COMMAND_DESCRIPTIONS.INTRODUCE,
  allowInDMs: false,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: false
  },
  options: [],
  async run(bot, context) {
    return bot.services.introduction.requestDetailsUsing(context);
  }
});

export default introduceCommand;
