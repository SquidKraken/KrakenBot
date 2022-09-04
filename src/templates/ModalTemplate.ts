import type { InteractionResponse, ModalBuilder, ModalSubmitInteraction } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ModalTemplate<ModalName extends string = string> {
  readonly name: ModalName;
  readonly modal: ModalBuilder;
  run(bot: KrakenBot, interaction: ModalSubmitInteraction): Promise<InteractionResponse | void>;
}

export function createModal<ModalName extends string>(
  modalStructure: ModalTemplate<ModalName>
): ModalTemplate<ModalName> {
  return modalStructure;
}
