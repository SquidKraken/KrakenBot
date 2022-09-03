import { createCommand, PermissionFlags } from "../../../templates/CommandTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const introduceCommand = createCommand({
  name: "introduce",
  description: "Introduce yourself to this server!",
  allowInDMs: false,
  guildPermissions: PermissionFlags.SendMessages,
  compatibility: {
    discord: true,
    twitch: false
  },
  options: [],
  async run(bot, controller) {
    const introductionModal = bot.interactions.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal) || isNullish(controller.interaction.guild)) return controller.reply({
      content: "I could not run this command!",
      ephemeral: true
    });

    return controller.showModal(introductionModal);
  }
});

export default introduceCommand;
