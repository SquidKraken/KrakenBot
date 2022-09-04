import type { ButtonBuilder, ButtonInteraction, InteractionResponse } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ButtonTemplate<ButtonName extends string = string> {
  readonly name: ButtonName;
  readonly button: ButtonBuilder;
  run(bot: KrakenBot, interaction: ButtonInteraction): Promise<InteractionResponse | void>;
}

export function createButton<ButtonName extends string>(
  buttonStructure: ButtonTemplate<ButtonName>
): ButtonTemplate<ButtonName> {
  return buttonStructure;
}
