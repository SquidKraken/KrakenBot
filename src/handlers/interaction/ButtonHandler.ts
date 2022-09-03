import type { KrakenBot } from "../../structures/KrakenBot.js";
import { InteractionHandler } from "../BaseHandler.js";

export class ButtonHandler extends InteractionHandler<"buttons"> {
  constructor(bot: KrakenBot) {
    super(bot, "buttons");
  }

  registerListeners(): void {
    for (const [ buttonName, buttonData ] of this.listeners.entries()) {
      this.emitter.on(buttonName, buttonData.run.bind(buttonData));
    }
  }
}
