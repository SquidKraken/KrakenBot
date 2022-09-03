import type { Client as TMIClient, Events } from "tmi.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface TwitchTemplate<ListenerName extends keyof Events = keyof Events> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, client: TMIClient, ...restArguments: Parameters<Events[ListenerName]>): unknown;
}
