import type { ClientListenerStructure } from "../../structures/ClientListener";

const interactionCreate: ClientListenerStructure<"interactionCreate"> = {
  name: "interactionCreate",
  runOnce: false,
  run(bot, interaction) {
    if (interaction.isButton()) {
      const { customId } = interaction;
      bot.handlers.button.emitter.emit(customId, bot, interaction);
    } else if (interaction.isCommand()) {
      const { commandName } = interaction;
      bot.handlers.command.emitter.emit(commandName, bot, interaction);
    } else if (interaction.isModalSubmit()) {
      const { customId } = interaction;
      bot.handlers.modal.emitter.emit(customId, bot, interaction);
    }
  }
};

export default interactionCreate;
