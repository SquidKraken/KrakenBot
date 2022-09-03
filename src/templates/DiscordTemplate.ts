import type { ClientEvents } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface DiscordTemplate<ListenerName extends keyof ClientEvents = keyof ClientEvents> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, ...restArguments: ClientEvents[ListenerName]): unknown;
}
