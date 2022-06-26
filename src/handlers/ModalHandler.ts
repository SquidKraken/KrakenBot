import type { KrakenBot } from "../structures/KrakenBot.js";
import { BaseHandler } from "./BaseHandler.js";

export class ModalHandler extends BaseHandler<"modals"> {
  constructor(bot: KrakenBot) {
    super(bot, "modals");
  }

  registerListeners(): void {
    // eslint-disable-next-line curly
    for (const [ modalName, modalData ] of this.listeners.entries()) {
      this.emitter.on(modalName, modalData.run.bind(modalData));
    }
  }
}
