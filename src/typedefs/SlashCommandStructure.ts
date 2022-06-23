import type { CommandInteraction } from "discord.js";
import type { KrakenBot } from "../structures/KrakenBot.js";

export interface SlashCommandStructure {
  readonly name: string;
  readonly description: string;
  readonly allowInDMs: boolean;
  readonly run: (client: KrakenBot, interaction: CommandInteraction)=> unknown;
}
