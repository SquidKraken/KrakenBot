import type { ButtonBuilder, ButtonInteraction, InteractionResponse } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ButtonTemplate {
  readonly name: string;
  readonly button: ButtonBuilder;
  run(bot: KrakenBot, interaction: ButtonInteraction): Promise<InteractionResponse | void>;
}
