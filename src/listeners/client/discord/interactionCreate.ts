import { createDiscordListener } from "../../../templates/DiscordTemplate.js";
import { DiscordController } from "../../../controllers/DiscordController.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const discordInteractionCreate = createDiscordListener({
  name: "interactionCreate",
  runOnce: false,
  run(bot, interaction) {
    if (interaction.isButton()) {
      const { customId } = interaction;
      bot.interactions.button.emitter.emit(customId, bot, interaction);
    } else if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;
      const command = bot.interactions.command.listeners.get(commandName);
      if (isNullish(command)) return;

      const controller = new DiscordController(interaction);
      bot.interactions.command.runIfCompatible(command, "discord", bot, controller);
    } else if (interaction.isModalSubmit()) {
      const { customId } = interaction;
      bot.interactions.modal.emitter.emit(customId, bot, interaction);
    }
  }
});

export default discordInteractionCreate;
