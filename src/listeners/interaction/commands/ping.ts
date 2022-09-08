import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";

const pingCommand = createCommand({
  name: "ping",
  description: "Replies with 'Pong!'",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: true
  },
  options: [],
  async run(_bot, controller) {
    return controller.reply("Pong!");
  }
});

export default pingCommand;
