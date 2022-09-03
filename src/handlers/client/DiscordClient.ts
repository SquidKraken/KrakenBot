import type { Client } from "discord.js";
import { REST } from "discord.js";

import type { KrakenBot } from "../../structures/KrakenBot.js";
import { ClientHandler } from "../BaseHandler.js";

export class DiscordClient extends ClientHandler<"discord"> {
  override readonly emitter: Client;
  readonly applicationID: string;
  readonly rest: REST;

  constructor(bot: KrakenBot, discordClient: Client, discordToken: string, discordBotApplicationID: string) {
    super(bot, "discord");
    this.emitter = discordClient;
    this.applicationID = discordBotApplicationID;
    this.rest = new REST({ version: "9" }).setToken(discordToken);
  }

  registerListeners(): void {
    for (const [ eventName, eventListener ] of this.listeners.entries()) {
      // @ts-expect-error EventEmitter callback is registered properly
      if (eventListener.runOnce) this.emitter.once(eventName, eventListener.run.bind(eventListener));

      // @ts-expect-error EventEmitter callback is registered properly
      else this.emitter.on(eventName, eventListener.run.bind(eventListener, this.bot));
    }
  }
}
