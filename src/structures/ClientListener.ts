import type { ClientEvents } from "discord.js";
import type { KrakenBot } from "./KrakenBot.js";

export interface ClientListenerStructure<ListenerName extends keyof ClientEvents = keyof ClientEvents> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, ...restArguments: ClientEvents[ListenerName]): unknown;
}
