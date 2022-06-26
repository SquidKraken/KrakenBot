import EventEmitter from "node:events";
import { readdir } from "node:fs/promises";
import path from "node:path";

import type { KrakenBot } from "../structures/KrakenBot.js";
import type { ButtonStructure } from "../structures/ButtonStructure.js";
import type { ClientListenerStructure } from "../structures/ClientListener.js";
import type { SlashCommandStructure } from "../structures/SlashCommand.js";
import type { ModalStructure } from "../structures/ModalStructure.js";

interface ListenerStructures {
  buttons: ButtonStructure;
  client: ClientListenerStructure;
  commands: SlashCommandStructure;
  modals: ModalStructure;
}

type ListenerNames = keyof ListenerStructures;

export abstract class BaseHandler<ListenerName extends ListenerNames> {
  #listenerName: ListenerName;
  #listenerDirectory: string;
  readonly bot: KrakenBot;
  readonly emitter: EventEmitter;
  readonly listeners = new Map<string, ListenerStructures[ListenerName]>();

  constructor(bot: KrakenBot, listenerToHandle: ListenerName) {
    this.#listenerName = listenerToHandle;
    this.#listenerDirectory = path.join(process.cwd(), "dist/listeners/", this.#listenerName);
    this.bot = bot;
    this.emitter = new EventEmitter();
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

      // eslint-disable-next-line quote-props
      const { default: listenerData } = await import(listenerPath) as { default: ListenerStructures[ListenerName]; };
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
