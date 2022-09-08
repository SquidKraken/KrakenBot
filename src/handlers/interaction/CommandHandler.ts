import { Routes } from "discord-api-types/v9";

import type { BaseContext } from "../../contexts/BaseContext.js";
import type { KrakenBot } from "../../structures/KrakenBot.js";
import type { CommandTemplate, DiscordCommandTemplate } from "../../types/CommandTemplate.js";
import { InteractionHandler } from "../BaseHandler.js";
import { transformToDiscordCommand } from "../../types/CommandTemplate.js";

type ListenerArguments = Parameters<CommandTemplate[ "run" ]>;

export class CommandHandler extends InteractionHandler<"commands"> {
  constructor(bot: KrakenBot) {
    super(bot, "commands");
  }

  async registerListeners(): Promise<void> {
    const commands: DiscordCommandTemplate[] = [];

    for (const [ commandName, command ] of this.listeners.entries()) {
      commands.push(transformToDiscordCommand(command));

      this.emitter.on(
        commandName,
        async(...listenerArguments: ListenerArguments) => command.run(...listenerArguments)
      );
    }

    await this.bot.clients.discord.rest
      .put(Routes.applicationCommands(this.bot.clients.discord.applicationID), { body: commands });
  }

  runIfCompatible(command: CommandTemplate, source: "discord" | "twitch", bot: KrakenBot, context: BaseContext): unknown {
    if (!command.compatibility[source]) return;

    return this.emitter.emit(command.name, bot, context);
  }
}
