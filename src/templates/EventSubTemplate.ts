import type { EventSubBase } from "@twurple/eventsub-base/lib/EventSubBase.js";
import type { Client as TMIClient } from "tmi.js";
import type { ArraySlice, ArrayTail } from "type-fest";

import type { KrakenBot } from "../KrakenBot.js";

export type EventSubMethods = {
  [ K in keyof EventSubBase as (K extends `on${string}` ? K : never) ]: EventSubBase[ K ];
};

export type EventSubEvent = Exclude<keyof EventSubMethods, "">;
type EventParameters<EventName extends EventSubEvent> = Parameters<EventSubMethods[ EventName ]>;

type PickLastParameter<EventName extends EventSubEvent> = ArrayTail<EventParameters<EventName>>[ number ];
type GetEventParameters<EventName extends EventSubEvent> = PickLastParameter<EventName> extends (...args: infer K) => void ? K : never;

type TargetParameters<EventName extends EventSubEvent> = ArraySlice<EventParameters<EventName>, 0, -1>;

export interface EventSubTemplate<ListenerName extends EventSubEvent = EventSubEvent> {
  readonly event: ListenerName;
  readonly runOnce: boolean;
  readonly target: TargetParameters<ListenerName>;
  run(bot: KrakenBot, client: TMIClient, ...restArguments: GetEventParameters<ListenerName>): unknown;
}

export function createEventSubListener<EventName extends EventSubEvent>(
  eventSubListenerStructure: EventSubTemplate<EventName>
): EventSubTemplate<EventName> {
  return eventSubListenerStructure;
}
