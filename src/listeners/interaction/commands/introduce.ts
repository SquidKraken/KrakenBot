import { createCommand, PermissionFlags } from "../../../types/CommandTemplate.js";

const introduceCommand = createCommand({
  name: "introduce",
  description: "Introduce yourself to this server!",
  allowInDMs: false,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: false
  },
  options: [],
  async run(bot, controller) {
    return bot.services.introduction.requestDetailsUsing(controller);
  }
});

export default introduceCommand;
