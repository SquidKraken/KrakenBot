import { createSlashCommand } from "../../structures/SlashCommand.js";

const pingCommand = createSlashCommand({
  name: "ping",
  description: "Replies with 'Pong!'",
  allowInDMs: true,
  options: [],
  async run(_client, interaction): Promise<void> {
    await interaction.reply("Pong!");
  }
});

export default pingCommand;
