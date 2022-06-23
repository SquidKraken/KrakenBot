import type { ClientEvents } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface ClientListenerStructure<ListenerName extends keyof ClientEvents> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  readonly run: (bot: KrakenBot, ...restArguments: ClientEvents[ListenerName])=> Promise<void> | void;
}
