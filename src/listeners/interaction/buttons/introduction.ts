import { ButtonBuilder, ButtonStyle } from "discord.js";

import type { ButtonTemplate } from "../../../templates/ButtonTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const introductionButton = new ButtonBuilder()
  .setCustomId("introduction")
  .setLabel("Introduce Yourself!")
  .setStyle(ButtonStyle.Primary)
  .setEmoji("👋");

const introductionButtonData: ButtonTemplate = {
  name: "introduction",
  button: introductionButton,
  async run(bot, interaction) {
    const introductionModal = bot.interactions.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal) || isNullish(interaction.guild)) return interaction.reply({
      content: "Something went wrong!",
      ephemeral: true
    });

    return interaction.showModal(introductionModal);
  }
};

export default introductionButtonData;
