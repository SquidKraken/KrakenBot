import EventEmitter from "node:events";

import type { Router } from "express";
import type { Events, Options as TMIOptions } from "tmi.js";
import { Client as TMIClient } from "tmi.js";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { EventSubMiddleware } from "@twurple/eventsub";

import type { KrakenBot } from "../../KrakenBot.js";
import type { BaseEventEmitter } from "../BaseHandler.js";
import type { EventSubEventMethods } from "../../types/EventSubTemplate.js";
import { ClientHandler } from "../BaseHandler.js";
import { isNullish } from "../../utilities/nullishAssertion.js";
import { capitalize } from "../../utilities/capitalize.js";
import {
  HOST_TWITCH_ID, TWITCH_AUTH_PROVIDER_CONFIG, TWITCH_BOT_CONFIG, TWITCH_EVENTSUB_CONFIG, TWITCH_LOGGER_CONFIG
} from "../../config.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListenerArguments<T> = [T] extends [(...listenerArguments: infer U)=> any] ? U : [T] extends [never] ? [] : [T];
type ListenerType = (...arguments_: unknown[])=> void;
type MiddlewareBypass = EventSubMiddleware & Record<string, undefined>;

function raidEventReplacer(wholeMatch: string, endingWord: unknown): string {
  return typeof endingWord === "string" ? `Events${endingWord}` : wholeMatch;
}

class TwitchEmitter extends EventEmitter implements BaseEventEmitter {
  readonly client: TMIClient;

  constructor(client: TMIClient) {
    super();
    this.client = client;
  }

  override emit<EventName extends keyof Events>(
    eventName: EventName,
    ..._arguments: ListenerArguments<Events[EventName]>
  ): boolean {
    this.client.emit(eventName, ..._arguments);

    return true;
  }

  override on<EventName extends keyof Events>(eventName: EventName, listener: ListenerType): this {
    this.client.on(eventName, listener);

    return this;
  }

  override once<EventName extends keyof Events>(eventName: EventName, listener: ListenerType): this {
    this.client.once(eventName, listener);

    return this;
  }

  override removeAllListeners<EventName extends keyof Events>(eventName?: EventName): this {
    if (isNullish(eventName)) this.client.removeAllListeners();
    else this.client.removeAllListeners(eventName);

    return this;
  }
}

class EventSubClient extends ClientHandler<"eventsub"> {
  readonly middleware: EventSubMiddleware;

  constructor(bot: KrakenBot, twitchAPIClient: ApiClient) {
    super(bot, "eventsub");

    const eventSubMiddleware = new EventSubMiddleware({
      ...TWITCH_EVENTSUB_CONFIG,
      apiClient: twitchAPIClient
    });

    this.middleware = eventSubMiddleware;
  }

  async registerListeners(): Promise<void> {
    for await (const [ eventName, eventListener ] of this.listeners.entries()) {
      const eventSubscribeMethodName = eventName.endsWith("To") || eventName.endsWith("From")
        ? `subscribeTo${capitalize(eventName
          .replace(/(From|To)$/u, raidEventReplacer))}`
        : `subscribeTo${capitalize(eventName)}Events`;

      if (isNullish((this.middleware as MiddlewareBypass)[eventSubscribeMethodName as keyof EventSubEventMethods])) throw new Error("Invalid event subscribe method name!");

      await (this.middleware as MiddlewareBypass)[eventSubscribeMethodName as keyof EventSubEventMethods](
        HOST_TWITCH_ID,
        eventListener.run.bind(eventListener, this.bot, this.bot.clients.twitch.chat.emitter.client)
      );
    }
  }
}

class TwitchChatClient extends ClientHandler<"twitch"> {
  override readonly emitter: TwitchEmitter;
  constructor(bot: KrakenBot, clientOptions: TMIOptions) {
    const twitchClient = new TMIClient(clientOptions);
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

export class TwitchClient {
  readonly bot: KrakenBot;
  readonly authProvider: ClientCredentialsAuthProvider;
  readonly api: ApiClient;
  readonly chat: TwitchChatClient;
  readonly eventsub: EventSubClient;

  constructor(bot: KrakenBot) {
    this.bot = bot;
    this.authProvider = new ClientCredentialsAuthProvider(
      TWITCH_AUTH_PROVIDER_CONFIG.clientID,
      TWITCH_AUTH_PROVIDER_CONFIG.clientSecret,
      TWITCH_AUTH_PROVIDER_CONFIG.scopes
    );
    this.api = new ApiClient({
      authProvider: this.authProvider,
      logger: {
        ...TWITCH_LOGGER_CONFIG,
        name: "Twitch APIClient"
      }
    });
    this.chat = new TwitchChatClient(bot, TWITCH_BOT_CONFIG);
    this.eventsub = new EventSubClient(bot, this.api);
  }

  async loadAndRegisterListeners(): Promise<void> {
    await Promise.all([
      this.chat.loadAndRegisterListeners(),
      this.eventsub.loadAndRegisterListeners()
    ]);
  }

  async registerRouteListeners(router: Router): Promise<void> {
    await this.eventsub.middleware.apply(router);
    router.post("/api/twitch/eventsub/:id", (_request, response) => response.send());
    router.post("/api/twitch/eventsub/event/:id", (_request, response) => response.send());
  }
}
