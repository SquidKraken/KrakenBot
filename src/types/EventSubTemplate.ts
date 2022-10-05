import type { EventSubBase } from "@twurple/eventsub/lib/EventSubBase.js";
import type { Client as TMIClient } from "tmi.js";
import type { CamelCase } from "type-fest";

import type { KrakenBot } from "../KrakenBot.js";

export type EventSubEventMethods = {
  [ K in keyof EventSubBase as K extends `subscribeTo${string}Events${"" | "From" | "To"}` ? K : never ]: EventSubBase[ K ];
};

type SimplifyEventName<K extends string> = K extends `subscribeTo${infer U}Events${infer V extends "" | "From" | "To"}` ? CamelCase<`${U}${V}`> : never;

type EventSubEvents = {
  [ K in keyof EventSubEventMethods as SimplifyEventName<K> ]: EventSubBase[ K ];
};

type EventSubNames = keyof EventSubEvents;

type GetEventCallbackParameters<EventName extends EventSubNames> = Parameters<Parameters<EventSubEvents[ EventName ]>[ 1 ]>;

export interface EventSubTemplate<ListenerName extends EventSubNames = EventSubNames> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, client: TMIClient, ...restArguments: GetEventCallbackParameters<ListenerName>): unknown;
}

export function createEventSubListener<EventName extends EventSubNames>(
  eventSubListenerStructure: EventSubTemplate<EventName>
): EventSubTemplate<EventName> {
  return eventSubListenerStructure;
}
