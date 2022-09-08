import { ButtonBuilder, ButtonStyle } from "discord.js";

import { createButton } from "../../../templates/ButtonTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const introductionButton = new ButtonBuilder()
  .setCustomId("introduction")
  .setLabel("Introduce Yourself!")
  .setStyle(ButtonStyle.Primary)
  .setEmoji("👋");

const introductionButtonData = createButton({
  name: "introduction",
  button: introductionButton,
  async run(bot, controller) {
    const introductionModal = bot.interactions.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal)) return controller.reply({
      content: "Something went wrong!",
      ephemeral: true
    });

    return controller.showModal(introductionModal);
  }
});

export default introductionButtonData;
