import type { InteractionResponse, ModalBuilder } from "discord.js";

import type { DiscordModalController } from "../controllers/DiscordController.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ModalTemplate<ModalName extends string = string, AllowedInDMs extends boolean = boolean> {
  readonly name: ModalName;
  readonly allowInDMs: AllowedInDMs;
  readonly modal: ModalBuilder;
  run(bot: KrakenBot, controller: DiscordModalController<AllowedInDMs>): Promise<InteractionResponse | void>;
}

export function createModal<ModalName extends string, AllowedInDMs extends boolean>(
  modalStructure: ModalTemplate<ModalName, AllowedInDMs>
): ModalTemplate<ModalName, AllowedInDMs> {
  return modalStructure;
}
