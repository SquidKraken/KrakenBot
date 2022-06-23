import type { CommandInteraction } from "discord.js";
import type { KrakenBot } from "../../structures/KrakenBot.js";
import type { SlashCommandStructure } from "../../typedefs/SlashCommandStructure.js";

const pingCommand: SlashCommandStructure = {
  name: "ping",
  description: "Replies with 'Pong!'",
  allowInDMs: true,

  async run(_client: KrakenBot, interaction: CommandInteraction): Promise<void> {
    await interaction.reply("Pong!");
  }
};

export default pingCommand;
