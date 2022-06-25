import type { Interaction } from "discord.js";
import type { ClientListenerStructure } from "../../typedefs/ClientListener";

import type { KrakenBot } from "../../structures/KrakenBot.js";

const interactionCreate: ClientListenerStructure<"interactionCreate"> = {
  name: "interactionCreate",
  runOnce: false,
  run(bot: KrakenBot, interaction: Interaction): void {
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      bot.handlers.command.emitter.emit(commandName, bot, interaction);
    }
  }
};

export default interactionCreate;
