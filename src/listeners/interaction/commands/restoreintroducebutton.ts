import type { ButtonBuilder } from "discord.js";
import { ActionRowBuilder } from "discord.js";

import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";
import { COMMAND_DESCRIPTIONS, ERRORS, MESSAGE_CONTENT, REPLY_CONTENT } from "../../../config/messages.js";

const restoreIntroduceButtonCommand = createCommand({
  name: "restoreintroducebutton",
  description: COMMAND_DESCRIPTIONS.RESTORE_INTRODUCE_BUTTON,
  allowInDMs: true,
  guildPermissions: PermissionFlags.Administrator,
  compatibility: {
    discord: true,
    twitch: false
  },
  options: [],
  async run(bot, context) {
    const introductionButton = bot.interactions.button.listeners.get("introduction")?.button;
    if (isNullish(introductionButton)) return context.error(ERRORS.MISSING_INTRO_BUTTON_DATA);

    await context.deferReply({ ephemeral: true });

    const buttonRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(introductionButton);

    try {
      await context.send({
        content: MESSAGE_CONTENT.INTRODUCE_INSTRUCTION,
        components: [ buttonRow ]
      });
    } catch (error: unknown) {
      console.error(error);

      return context.error(ERRORS.FAILED_INTRO_BUTTON_SETUP);
    }

    return context.editReply(REPLY_CONTENT.INTRO_BUTTON_SETUP);
  }
});

export default restoreIntroduceButtonCommand;
