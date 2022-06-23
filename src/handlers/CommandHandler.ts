import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v9";

import type { KrakenBot } from "../structures/KrakenBot.js";
import type { SlashCommandStructure } from "../typedefs/SlashCommandStructure.js";
import { BaseHandler } from "./BaseHandler.js";

export class CommandHandler extends BaseHandler<SlashCommandStructure> {
  constructor(bot: KrakenBot) {
    super(bot, "commands");
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async registerListeners(): Promise<void> {
    const commands = [];

    for (const [ commandName, commandData ] of this.listeners.entries()) {
      const slashCommand = new SlashCommandBuilder()
        .setName(commandData.name)
        .setDescription(commandData.description)
        .setDMPermission(commandData.allowInDMs);

      commands.push(slashCommand.toJSON());

      this.emitter.on(commandName, commandData.run);
    }

    await this.bot.handlers.rest.put(Routes.applicationCommands(this.bot.applicationID), { body: commands });
  }
}
