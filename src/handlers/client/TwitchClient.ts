import EventEmitter from "node:events";

import type { Router } from "express";
import type { Events, Options as TMIOptions } from "tmi.js";
import { Client as TMIClient } from "tmi.js";
import { ApiClient } from "@twurple/api";
import { EventSubMiddleware } from "@twurple/eventsub-http";

import type { BaseEventEmitter } from "../BaseHandler.js";
import type { KrakenBot } from "../../KrakenBot.js";
import { ClientHandler } from "../BaseHandler.js";
import { isNullish } from "../../utilities/nullishAssertion.js";
import {
  TWITCH_AUTH_PROVIDER_CONFIG, TWITCH_BOT_CONFIG, TWITCH_EVENTSUB_CONFIG, TWITCH_LOGGER_CONFIG
} from "../../config/api.js";
import { ERRORS } from "../../config/messages.js";
import { AppTokenAuthProvider } from "@twurple/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ListenerArguments<T> = [ T ] extends [ (...listenerArguments: infer U) => any ] ? U : [ T ] extends [ never ] ? [] : [ T ];
type ListenerType = (...arguments_: unknown[]) => void;

class TwitchEmitter extends EventEmitter implements BaseEventEmitter {
  readonly client: TMIClient;

  constructor(client: TMIClient) {
    super();
    this.client = client;
  }

  override emit<EventName extends keyof Events>(
    eventName: EventName,
    ..._arguments: ListenerArguments<Events[ EventName ]>
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
    for await (const [ _, eventListener ] of this.listeners.entries()) {
      const eventSubscribeMethodName = eventListener.event;

      if (isNullish(this.middleware[eventSubscribeMethodName])) throw new Error(ERRORS.INVALID_SUBSCRIBE_METHOD);

      // @ts-expect-error EventSubMiddleware callback receives sufficient parameters
      await this.middleware[eventSubscribeMethodName](
        ...eventListener.target,
        // @ts-expect-error This context of the run method is valid
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
  readonly authProvider: AppTokenAuthProvider;
  readonly api: ApiClient;
  readonly chat: TwitchChatClient;
  readonly eventsub: EventSubClient;

  constructor(bot: KrakenBot) {
    this.bot = bot;
    this.authProvider = new AppTokenAuthProvider(
      TWITCH_AUTH_PROVIDER_CONFIG.clientID,
      TWITCH_AUTH_PROVIDER_CONFIG.clientSecret
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
