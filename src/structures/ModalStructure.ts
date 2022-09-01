import type { InteractionResponse, ModalBuilder, ModalSubmitInteraction } from "discord.js";
import type { KrakenBot } from "./KrakenBot";

export interface ModalStructure {
  readonly name: string;
  readonly modal: ModalBuilder;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  run(bot: KrakenBot, interaction: ModalSubmitInteraction): Promise<InteractionResponse | void>;
}
