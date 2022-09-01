import { createSlashCommand, PermissionFlags } from "../../structures/SlashCommand.js";

const pingCommand = createSlashCommand({
  name: "ping",
  description: "Replies with 'Pong!'",
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  options: [],
  async run(_client, interaction) {
    return interaction.reply("Pong!");
  }
});

export default pingCommand;
