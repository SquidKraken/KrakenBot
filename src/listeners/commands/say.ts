import { CommandOptionType, createSlashCommand } from "../../structures/SlashCommand.js";
import { isNullish } from "../../utilities/nullishAssertion.js";

const sayCommand = createSlashCommand({
  name: "say",
  description: "Say something!",
  allowInDMs: true,
  options: [
    {
      name: "text",
      type: CommandOptionType.String,
      description: "Enter the text you want me to say",
      required: true
    }
  ] as const,
  async run(_client, interaction): Promise<void> {
    const textToSay = interaction.options.getString("text");
    if (isNullish(textToSay)) return interaction.reply({
      content: "You have not provided anything for me to say!",
      ephemeral: true
    });

    await interaction.reply(textToSay);
  }
});

export default sayCommand;
