import type { KrakenBot } from "../../KrakenBot.js";
import { InteractionHandler } from "../BaseHandler.js";

export class ModalHandler extends InteractionHandler<"modals"> {
  constructor(bot: KrakenBot) {
    super(bot, "modals");
  }

  registerListeners(): void {
    for (const [ modalName, modalData ] of this.listeners.entries()) {
      this.emitter.on(modalName, modalData.run.bind(modalData));
    }
  }
}
