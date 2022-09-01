import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonStructure } from "../../structures/ButtonStructure.js";
import { isNullish } from "../../utilities/nullishAssertion.js";

const introductionButton = new ButtonBuilder()
  .setCustomId("introduction")
  .setLabel("Introduce Yourself!")
  .setStyle(ButtonStyle.Primary)
  .setEmoji("👋");

const introductionButtonData: ButtonStructure = {
  name: "introduction",
  button: introductionButton,
  async run(bot, interaction) {
    const introductionModal = bot.handlers.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal) || isNullish(interaction.guild)) return interaction.reply({
      content: "Something went wrong!",
      ephemeral: true
    });

    return interaction.showModal(introductionModal);
  }
};

export default introductionButtonData;
