import { COMMAND_DESCRIPTIONS, ERRORS } from "../../../config/messages.js";
import { CommandOptionType, createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const sayCommand = createCommand({
  name: "say",
  description: COMMAND_DESCRIPTIONS.SAY,
  allowInDMs: true,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: false
  },
  options: [
    {
      name: "text",
      type: CommandOptionType.String,
      description: "Enter the text you want me to say",
      required: true
    }
  ] as const,
  async run(_bot, context) {
    const textToSay = context.interaction.options.getString("text");
    if (isNullish(textToSay)) return context.error(ERRORS
      .MISSING_SAY_ARGUMENTS);

    return context.reply(textToSay);
  }
});

export default sayCommand;
