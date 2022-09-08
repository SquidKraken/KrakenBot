import type { ButtonBuilder, InteractionResponse } from "discord.js";
import type { DiscordButtonController } from "../controllers/DiscordController.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ButtonTemplate<ButtonName extends string = string> {
  readonly name: ButtonName;
  readonly button: ButtonBuilder;
  run(bot: KrakenBot, controller: DiscordButtonController): Promise<InteractionResponse | void>;
}

export function createButton<ButtonName extends string>(
  buttonStructure: ButtonTemplate<ButtonName>
): ButtonTemplate<ButtonName> {
  return buttonStructure;
}
