/* eslint-disable @typescript-eslint/require-await */
import chalk from "chalk";
import { DISCORD_COLOR, TWITCH_COLOR } from "../config/constants.js";

export async function discordLog(...content: unknown[]): Promise<void> {
  console.log(chalk.hex(DISCORD_COLOR)("DISCORD"), ...content);
}

export async function twitchLog(...content: unknown[]): Promise<void> {
  console.log(chalk.hex(TWITCH_COLOR)("TWITCH"), ...content);
}
