import { ButtonBuilder, ButtonStyle } from "discord.js";

import { createButton } from "../../../templates/ButtonTemplate.js";
import { TEXTUAL_INDICATORS } from "../../../config/messages.js";

const introductionButton = new ButtonBuilder()
  .setCustomId("introduction")
  .setLabel("Introduce Yourself!")
  .setStyle(ButtonStyle.Primary)
  .setEmoji("👋");

const introductionButtonData = createButton({
  name: "introduction",
  allowInDMs: false,
  button: introductionButton,
  async run(bot, context) {
    return bot.services.introduction.requestDetailsUsing(context);
  }
});

export default introductionButtonData;
