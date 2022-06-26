import type { KrakenBot } from "../structures/KrakenBot.js";
import { BaseHandler } from "./BaseHandler.js";

export class ButtonHandler extends BaseHandler<"buttons"> {
  constructor(bot: KrakenBot) {
    super(bot, "buttons");
  }

  registerListeners(): void {
    // eslint-disable-next-line curly
    for (const [ buttonName, buttonData ] of this.listeners.entries()) {
      this.emitter.on(buttonName, buttonData.run.bind(buttonData));
    }
  }
}
