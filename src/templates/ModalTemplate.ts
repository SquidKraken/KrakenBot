import type { InteractionResponse, ModalBuilder, ModalSubmitInteraction } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ModalTemplate {
  readonly name: string;
  readonly modal: ModalBuilder;
  run(bot: KrakenBot, interaction: ModalSubmitInteraction): Promise<InteractionResponse | void>;
}
