import type { ClientEvents as DiscordEvents } from "discord.js";
import type { KrakenBot } from "../KrakenBot.js";

type DiscordEventNames = keyof DiscordEvents;

export interface DiscordTemplate<EventName extends DiscordEventNames = DiscordEventNames> {
  readonly name: EventName;
  readonly runOnce: boolean;
  run(bot: KrakenBot, ...restArguments: DiscordEvents[EventName]): unknown;
}

export function createDiscordListener<EventName extends DiscordEventNames>(
  discordListenerStructure: DiscordTemplate<EventName>
): DiscordTemplate<EventName> {
  return discordListenerStructure;
}
