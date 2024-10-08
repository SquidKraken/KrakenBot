import { Client as DJSClient, REST } from "discord.js";

import type { KrakenBot } from "../../KrakenBot.js";
import { ClientHandler } from "../BaseHandler.js";
import {
  DISCORD_API_VERSION, DISCORD_BOT_APPLICATION_ID, DISCORD_BOT_CONFIG, DISCORD_BOT_TOKEN
} from "../../config/api.js";

export class DiscordClient extends ClientHandler<"discord"> {
  // @ts-expect-error Unusual type incompatibility with BaseEmitter
  override readonly emitter: DJSClient;
  readonly applicationID: string;
  readonly rest: REST;

  constructor(bot: KrakenBot) {
    const discordClient = new DJSClient(DISCORD_BOT_CONFIG);
    super(bot, "discord");
    this.emitter = discordClient;
    this.applicationID = DISCORD_BOT_APPLICATION_ID;
    this.rest = new REST({ version: DISCORD_API_VERSION }).setToken(DISCORD_BOT_TOKEN);
  }

  registerListeners(): void {
    for (const [ eventName, eventListener ] of this.listeners.entries()) {
      if (eventListener.runOnce) this.emitter.once(eventName, eventListener.run.bind(eventListener));

      else this.emitter.on(eventName, eventListener.run.bind(eventListener, this.bot));
    }
  }
}
