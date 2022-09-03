import { CommandOptionType, createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const sayCommand = createCommand({
  name: "say",
  description: "Say something!",
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
  async run(_bot, controller) {
    const textToSay = controller.interaction.options.getString("text");
    if (isNullish(textToSay)) return controller.reply({
      content: "You have not provided anything for me to say!",
      ephemeral: true
    });

    return controller.reply(textToSay);
  }
});

export default sayCommand;
