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
  async run(bot, context) {
    const introductionButton = bot.interactions.button.listeners.get("introduction")?.button;
    if (isNullish(introductionButton)) return context.error("Could not find the Introduction button data!");

    await context.deferReply({ ephemeral: true });

    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(introductionButton);

    try {
      await context.send({
        content: "**Introduce Yourself** by clicking the button below!",
        components: [ buttonRow ]
      });
    } catch (sendError: unknown) {
      console.error(sendError);

      return context.error("Could not set up the Introduction button!");
    }

    return context.editReply("Successfully set up the Introduction button!");
  }
});

export default restoreIntroduceButtonCommand;
