import type { Client, ClientEvents } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";
import type { ClientListenerStructure } from "../typedefs/ClientListenerStructure.js";
import { BaseHandler } from "./BaseHandler.js";

export class ClientHandler extends BaseHandler<ClientListenerStructure<keyof ClientEvents>> {
  constructor(bot: KrakenBot) {
    super(bot, "client", bot.client);
  }

  registerListeners(): void {
    // eslint-disable-next-line curly
    for (const [ eventName, eventListener ] of this.listeners.entries()) {
      // @ts-expect-error EventEmitter callback is registered properly
      if (eventListener.runOnce) (this.emitter as Client).once(eventName, eventListener.run);

      // @ts-expect-error EventEmitter callback is registered properly
      else this.emitter.on(eventName, eventListener.run.bind(eventListener, this.bot));
    }
  }
}
