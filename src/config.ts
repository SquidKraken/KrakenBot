/* eslint-disable node/no-process-env */
import type { Options } from "tmi.js";
import { GatewayIntentBits } from "discord.js";

import { isNullish } from "./utilities/nullishAssertion.js";

if (isNullish(process.env.DISCORD_BOT_TOKEN)) throw new Error("Discord Bot token not found!");
if (isNullish(process.env.DISCORD_BOT_APPLICATION_ID)) throw new Error("Discord Bot application ID not found!");
if (isNullish(process.env.TWITCH_BOT_USERNAME)) throw new Error("Twitch Bot username not found!");
if (isNullish(process.env.TWITCH_BOT_OAUTH_CODE)) throw new Error("Twitch Bot OAuth code not found!");

export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
export const DISCORD_BOT_APPLICATION_ID = process.env.DISCORD_BOT_APPLICATION_ID;
export const DISCORD_BOT_CONFIG = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions
  ]
};

export const HOST_TWITCH_USERNAME = "squid_pers0n";
export const OWNER_TWITCH_USERNAME = "spuggle_";
export const TWITCH_BOT_USERNAME = process.env.TWITCH_BOT_USERNAME;
export const TWITCH_BOT_OAUTH_CODE = process.env.TWITCH_BOT_OAUTH_CODE;
export const TWITCH_BOT_CONFIG: Options = {
  channels: [ HOST_TWITCH_USERNAME, OWNER_TWITCH_USERNAME, TWITCH_BOT_USERNAME ],
  connection: {
    reconnect: true,
    secure: true
  }
};
export const TWITCH_BOT_CREDENTIALS = {
  username: TWITCH_BOT_USERNAME,
  password: TWITCH_BOT_OAUTH_CODE
};
