import type { ButtonInteraction, ChatInputCommandInteraction, ModalSubmitInteraction } from "discord.js";

import type { KrakenBot } from "../../../structures/KrakenBot.js";
import { createDiscordListener } from "../../../templates/DiscordTemplate.js";
import { DiscordBaseController, DiscordButtonController, DiscordCommandController } from "../../../controllers/DiscordController.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

function invokeButtonInteraction(bot: KrakenBot, interaction: ButtonInteraction): void {
  const controller = new DiscordButtonController(interaction);
  const { customId } = interaction;
  bot.interactions.button.emitter.emit(customId, bot, controller);
}

function invokeSlashCommandInteraction(bot: KrakenBot, interaction: ChatInputCommandInteraction): void {
  const { commandName } = interaction;
  const controller = new DiscordCommandController(interaction);
  const command = bot.interactions.command.listeners.get(commandName);
  if (isNullish(command)) return;

  bot.interactions.command.runIfCompatible(command, "discord", bot, controller);
}

function invokeModalInteraction(bot: KrakenBot, interaction: ModalSubmitInteraction): void {
  const { customId } = interaction;
  const controller = new DiscordBaseController(interaction);
  bot.interactions.modal.emitter.emit(customId, bot, controller);
}
const discordInteractionCreate = createDiscordListener({
  name: "interactionCreate",
  runOnce: false,
  run(bot, interaction) {
    if (interaction.isButton()) invokeButtonInteraction(bot, interaction);
    else if (interaction.isChatInputCommand()) invokeSlashCommandInteraction(bot, interaction);
    else if (interaction.isModalSubmit()) invokeModalInteraction(bot, interaction);
  }
});

export default discordInteractionCreate;
