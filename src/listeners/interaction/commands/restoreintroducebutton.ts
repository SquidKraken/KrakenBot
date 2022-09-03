import type { ButtonBuilder } from "discord.js";
import { ActionRowBuilder } from "discord.js";

import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
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
  // eslint-disable-next-line max-lines-per-function
  async run(bot, controller) {
    const introductionButton = bot.interactions.button.listeners.get("introduction")?.button;
    if (isNullish(introductionButton)) return controller.reply({
      content: "Could not find the Introduction button data!",
      ephemeral: true
    });
    if (isNullish(controller.interaction.channel)) return controller.reply({
      content: "Could not access current channel!",
      ephemeral: true
    });

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

      return controller.reply({
        content: "Could not find the Introduction button data!",
        ephemeral: true
      });
    }

    return controller.editReply("Successfully set up the Introduction button!");
  }
});

export default restoreIntroduceButtonCommand;
