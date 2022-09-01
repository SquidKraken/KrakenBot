import { Routes } from "discord-api-types/v9";

import type { KrakenBot } from "../structures/KrakenBot.js";
import type { SlashCommandStructure } from "../structures/SlashCommand.js";
import { BaseHandler } from "./BaseHandler.js";

export class CommandHandler extends BaseHandler<"commands"> {
  constructor(bot: KrakenBot) {
    super(bot, "commands");
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async registerListeners(): Promise<void> {
    const commands = [];

    for (const [ commandName, commandData ] of this.listeners.entries()) {
      commands.push(commandData);

      this.emitter.on(commandName, async(...listenerArguments: Parameters<SlashCommandStructure["run"]>) => commandData.run(...listenerArguments));
    }

    await this.bot.handlers.rest.put(Routes.applicationCommands(this.bot.applicationID), { body: commands });
  }
}
