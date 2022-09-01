import type { ButtonBuilder, ButtonInteraction, InteractionResponse } from "discord.js";
import type { KrakenBot } from "./KrakenBot";

export interface ButtonStructure {
  readonly name: string;
  readonly button: ButtonBuilder;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  run(bot: KrakenBot, interaction: ButtonInteraction): Promise<InteractionResponse | void>;
}
