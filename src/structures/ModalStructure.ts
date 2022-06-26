import type { Modal, ModalSubmitInteraction } from "discord.js";
import type { KrakenBot } from "./KrakenBot";

export interface ModalStructure {
  readonly name: string;
  readonly modal: Modal;
  run(bot: KrakenBot, interaction: ModalSubmitInteraction): Promise<void> | void;
}
