import EventEmitter from "node:events";
import path from "node:path";
import { readdir } from "node:fs/promises";

import type { KrakenBot } from "../structures/KrakenBot.js";
import type { ButtonTemplate } from "../templates/ButtonTemplate.js";
import type { CommandTemplate } from "../templates/CommandTemplate.js";
import type { DiscordTemplate } from "../templates/DiscordTemplate.js";
import type { ModalTemplate } from "../templates/ModalTemplate.js";
import type { TwitchTemplate } from "../templates/TwitchTemplate.js";

interface ClientListenerStructures {
  discord: DiscordTemplate;
  twitch: TwitchTemplate;
}

interface InteractionListenerStructures {
  buttons: ButtonTemplate;
  commands: CommandTemplate;
  modals: ModalTemplate;
}

type ListenerStructures = ClientListenerStructures & InteractionListenerStructures;

type ClientListenerNames = keyof ClientListenerStructures;
type InteractionListenerNames = keyof InteractionListenerStructures;
type ListenerNames = keyof ListenerStructures;

export type SimpleEventEmitter = Pick<EventEmitter, "emit" | "on" | "removeAllListeners">;

const listenerType: Record<ClientListenerNames | InteractionListenerNames, "client" | "interaction"> = {
  buttons: "interaction",
  commands: "interaction",
  discord: "client",
  modals: "interaction",
  twitch: "client"
};

abstract class BaseHandler<ListenerName extends ListenerNames> {
  #listenerName: ListenerName;
  #listenerDirectory: string;
  readonly bot: KrakenBot;
  readonly emitter: SimpleEventEmitter = new EventEmitter();
  readonly listeners = new Map<string, ListenerStructures[ListenerName]>();

  constructor(bot: KrakenBot, listenerToHandle: ListenerName) {
    const listenerTypeDirectory = `dist/listeners/${listenerType[listenerToHandle]}`;
    this.#listenerName = listenerToHandle;
    this.#listenerDirectory = path.join(process.cwd(), listenerTypeDirectory, this.#listenerName);
    this.bot = bot;
  }

  async fetchListenerFilenames(): Promise<string[]> {
    const directoryContents = await readdir(this.#listenerDirectory);
    const directoryFiles = directoryContents
      .filter(directoryContent => directoryContent.endsWith(".js"));

    return directoryFiles;
  }

  async loadListeners(): Promise<BaseHandler<ListenerName>["listeners"]> {
    const listenerFilenames = await this.fetchListenerFilenames();

    for await (const listenerFilename of listenerFilenames) {
      const listenerName = listenerFilename.split(".")[0]!;
      const listenerPath = path.join(this.#listenerDirectory, listenerFilename);

      const { "default": listenerData } = await import(listenerPath) as { default: ListenerStructures[ListenerName]; };
      if (this.listeners.has(listenerName)) this.unloadListener(listenerName);

      this.listeners.set(listenerName, listenerData);
    }

    return this.listeners;
  }

  async loadAndRegisterListeners(): Promise<void> {
    await this.loadListeners();
    await this.registerListeners();
  }

  unloadListener(listenerName: string): boolean {
    this.emitter.removeAllListeners(listenerName);

    return this.listeners.delete(listenerName);
  }

  abstract registerListeners(): Promise<void> | void;
}

export abstract class ClientHandler<ListenerName extends ClientListenerNames> extends BaseHandler<ListenerName> {}
export abstract class InteractionHandler<ListenerName extends InteractionListenerNames> extends BaseHandler<ListenerName> {}
