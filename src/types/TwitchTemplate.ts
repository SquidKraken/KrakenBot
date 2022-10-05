import type { Client as TMIClient, Events } from "tmi.js";
import type { KrakenBot } from "../KrakenBot.js";

type TwitchEventNames = keyof Events;

export interface TwitchTemplate<ListenerName extends TwitchEventNames = TwitchEventNames> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, client: TMIClient, ...restArguments: Parameters<Events[ListenerName]>): unknown;
}

export function createTwitchListener<ListenerName extends TwitchEventNames>(
  twitchListenerStructure: TwitchTemplate<ListenerName>
): TwitchTemplate<ListenerName> {
  return twitchListenerStructure;
}
