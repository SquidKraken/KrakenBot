import type { ButtonBuilder } from "discord.js";
import { ActionRowBuilder } from "discord.js";

import { createCommand, PermissionFlags } from "../../../types/CommandTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const restoreIntroduceButtonCommand = createCommand({
  name: "restoreintroducebutton",
  description: "Restores the button for introduction form",
  allowInDMs: true,
  guildPermissions: PermissionFlags.Administrator,
  compatibility: {
    discord: true,
    twitch: false
  },
  options: [],
  async run(bot, controller) {
    const introductionButton = bot.interactions.button.listeners.get("introduction")?.button;
    if (isNullish(introductionButton)) return controller.error("Could not find the Introduction button data!");

    await controller.deferReply({ ephemeral: true });

    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(introductionButton);

    try {
      await controller.send({
        content: "**Introduce Yourself** by clicking the button below!",
        components: [ buttonRow ]
      });
    } catch (sendError: unknown) {
      console.error(sendError);

      return controller.error("Could not set up the Introduction button!");
    }

    return controller.editReply("Successfully set up the Introduction button!");
  }
});

export default restoreIntroduceButtonCommand;
