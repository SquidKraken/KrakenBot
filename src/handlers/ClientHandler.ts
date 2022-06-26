import type { Client } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";
import { BaseHandler } from "./BaseHandler.js";

export class ClientHandler extends BaseHandler<"client"> {
  override readonly emitter: Client;
  constructor(bot: KrakenBot) {
    super(bot, "client");
    this.emitter = bot.client;
  }

  registerListeners(): void {
    // eslint-disable-next-line curly
    for (const [ eventName, eventListener ] of this.listeners.entries()) {
      // @ts-expect-error EventEmitter callback is registered properly
      if (eventListener.runOnce) this.emitter.once(eventName, eventListener.run.bind(eventListener));

      // @ts-expect-error EventEmitter callback is registered properly
      else this.emitter.on(eventName, eventListener.run.bind(eventListener, this.bot));
    }
  }
}
