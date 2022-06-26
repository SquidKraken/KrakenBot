import type { ClientListenerStructure } from "../../structures/ClientListener";

const interactionCreate: ClientListenerStructure<"interactionCreate"> = {
  name: "interactionCreate",
  runOnce: false,
  run(bot, interaction) {
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      bot.handlers.command.emitter.emit(commandName, bot, interaction);
    }
  }
};

export default interactionCreate;
