import EventEmitter from "node:events";

import type { Client, Events } from "tmi.js";
import type { KrakenBot } from "../../structures/KrakenBot.js";
import type { SimpleEventEmitter } from "../BaseHandler.js";
import { ClientHandler } from "../BaseHandler.js";
import { isNullish } from "../../utilities/nullishAssertion.js";

// eslint-disable-next-line unicorn/prevent-abbreviations, @typescript-eslint/no-explicit-any
type ListenerType<T> = [T] extends [(...args: infer U)=> any] ? U : [T] extends [never] ? [] : [T];

class TwitchEmitter extends EventEmitter implements SimpleEventEmitter {
  readonly client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  override emit<EventName extends keyof Events>(
    eventName: EventName,
    ..._arguments: ListenerType<Events[EventName]>
  ): boolean {
    this.client.emit(eventName, ..._arguments);

    return true;
  }

  override on<EventName extends keyof Events>(
    eventName: EventName,
    listener: (...arguments_: unknown[])=> void
  ): this {
    this.client.on(eventName, listener);

    return this;
  }

  override once<EventName extends keyof Events>(
    eventName: EventName,
    listener: (...arguments_: unknown[])=> void
  ): this {
    this.client.once(eventName, listener);

    return this;
  }

  override removeAllListeners<EventName extends keyof Events>(eventName?: EventName): this {
    if (isNullish(eventName)) this.client.removeAllListeners();
    else this.client.removeAllListeners(eventName);

    return this;
  }
}

export class TwitchClient extends ClientHandler<"twitch"> {
  override readonly emitter: TwitchEmitter;
  constructor(bot: KrakenBot, twitchClient: Client) {
    super(bot, "twitch");
    this.emitter = new TwitchEmitter(twitchClient);
  }

  registerListeners(): void {
    for (const [ eventName, eventListener ] of this.listeners.entries()) {
      // @ts-expect-error EventEmitter callback is registered properly
      if (eventListener.runOnce) this.emitter.once(eventName, eventListener.run.bind(eventListener));

      // @ts-expect-error EventEmitter callback is registered properly
      else this.emitter.on(eventName, eventListener.run.bind(eventListener, this.bot, this.emitter.client));
    }
  }
}
