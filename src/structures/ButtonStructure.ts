import type { ButtonInteraction, MessageButton } from "discord.js";
import type { KrakenBot } from "./KrakenBot";

export interface ButtonStructure {
  readonly name: string;
  readonly button: MessageButton;
  run(bot: KrakenBot, interaction: ButtonInteraction): Promise<void> | void;
}
