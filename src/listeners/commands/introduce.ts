import { createSlashCommand, PermissionFlags } from "../../structures/SlashCommand.js";
import { isNullish } from "../../utilities/nullishAssertion.js";

const introduceCommand = createSlashCommand({
  name: "introduce",
  description: "Introduce yourself to this server!",
  allowInDMs: false,
  guildPermissions: PermissionFlags.SendMessages,
  options: [],
  async run(bot, interaction) {
    const introductionModal = bot.handlers.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal) || isNullish(interaction.guild)) return interaction.reply({
      content: "I could not run this command!",
      ephemeral: true
    });

    return interaction.showModal(introductionModal);
  }
});

export default introduceCommand;
