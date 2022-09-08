import type { ClientEvents as DiscordEvents } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

type DiscordEventNames = keyof DiscordEvents;

export interface DiscordTemplate<ListenerName extends DiscordEventNames = DiscordEventNames> {
  readonly name: ListenerName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, ...restArguments: DiscordEvents[ListenerName]): unknown;
}

export function createDiscordListener<ListenerName extends DiscordEventNames>(
  discordListenerStructure: DiscordTemplate<ListenerName>
): DiscordTemplate<ListenerName> {
  return discordListenerStructure;
}
