import { MessageActionRow } from "discord.js";
import { createSlashCommand, PermissionFlags } from "../../structures/SlashCommand.js";
import { isNullish } from "../../utilities/nullishAssertion.js";

const pingCommand = createSlashCommand({
  name: "restoreintroducebutton",
  description: "Restores the button for introduction form",
  allowInDMs: true,
  guildPermissions: PermissionFlags.Administrator,
  options: [],
  // eslint-disable-next-line max-lines-per-function
  async run(bot, interaction): Promise<void> {
    const introductionButton = bot.handlers.button.listeners.get("introduction")?.button;
    if (isNullish(introductionButton)) return interaction.reply({
      content: "Could not find the Introduction button data!",
      ephemeral: true
    });
    if (isNullish(interaction.channel)) return interaction.reply({
      content: "Could not access current channel!",
      ephemeral: true
    });

    await interaction.deferReply({ ephemeral: true });

    const buttonRow = new MessageActionRow()
      .addComponents(introductionButton);

    try {
      await interaction.channel.send({
        content: "**Introduce Yourself** by clicking the button below!",
        components: [ buttonRow ]
      });
    } catch (sendError: unknown) {
      console.error(sendError);

      return interaction.reply({
        content: "Could not find the Introduction button data!",
        ephemeral: true
      });
    }

    await interaction.editReply("Successfully set up the Introduction button!");
  }
});

export default pingCommand;
