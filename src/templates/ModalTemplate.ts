import type { InteractionResponse, ModalBuilder } from "discord.js";

import type { DiscordModalController } from "../controllers/DiscordController.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ModalTemplate<ModalName extends string = string> {
  readonly name: ModalName;
  readonly modal: ModalBuilder;
  run(bot: KrakenBot, controller: DiscordModalController): Promise<InteractionResponse | void>;
}

export function createModal<ModalName extends string>(
  modalStructure: ModalTemplate<ModalName>
): ModalTemplate<ModalName> {
  return modalStructure;
}
