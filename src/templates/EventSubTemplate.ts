import type { EventSubBase } from "@twurple/eventsub-base/lib/EventSubBase.js";
import type { Client as TMIClient } from "tmi.js";
import type { CamelCase } from "type-fest";

import type { KrakenBot } from "../KrakenBot.js";

export type EventSubEventMethods = {
  [ K in keyof EventSubBase as K extends `on${string}` ? K : never ]: EventSubBase[ K ];
};

type SimplifyEventName<K extends string> = K extends `on${infer U}` ? CamelCase<`${U}`> : never;

type EventSubEvents = {
  [ K in keyof EventSubEventMethods as SimplifyEventName<K> ]: EventSubBase[ K ];
};

type EventSubNames = Exclude<keyof EventSubEvents, "">;

type EventParameters<EventName extends EventSubNames> = Parameters<EventSubEvents[ EventName ]>;
type EventParameterCallbacks<EventName extends EventSubNames> =EventParameters<EventName>[ 2 ] extends undefined
  ? (EventParameters<EventName>[ 1 ] extends undefined ? EventParameters<EventName>[ 0 ] : EventParameters<EventName>[ 1 ]) 
  : EventParameters<EventName>[ 2 ];

type GetEventCallbackParameters<EventName extends EventSubNames> = EventParameterCallbacks<EventName> extends (event: unknown) => void ? Parameters<EventParameterCallbacks<EventName>> : never;

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
