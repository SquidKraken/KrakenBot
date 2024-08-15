import { COMMAND_DESCRIPTIONS } from "../../../config/messages.js";
import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";

const pingCommand = createCommand({
  name: "ping",
  description: COMMAND_DESCRIPTIONS.PING,
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, context) {
    return context.reply("Pong!");
  }
});

export default pingCommand;
