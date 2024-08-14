/* eslint-disable node/no-process-env */
import type { Options } from "tmi.js";
import { GatewayIntentBits } from "discord.js";

import { isNullish } from "../utilities/nullishAssertion.js";

if (isNullish(process.env.HOST_USERNAME)) throw new Error("Missing Host username!");
if (isNullish(process.env.HOST_TWITCH_ID)) throw new Error("Missing Host username!");
if (isNullish(process.env.OWNER_TWITCH_USERNAME)) throw new Error("Missing Host username!");
if (isNullish(process.env.OWNER_TWITCH_ID)) throw new Error("Missing Host username!");
if (isNullish(process.env.SERVER_HOSTNAME)) throw new Error("Missing Host username!");
if (isNullish(process.env.DISCORD_BOT_TOKEN)) throw new Error("Discord Bot token not found!");
if (isNullish(process.env.DISCORD_BOT_APPLICATION_ID)) throw new Error("Discord Bot application ID not found!");
if (isNullish(process.env.TWITCH_BOT_USERNAME)) throw new Error("Twitch Bot username not found!");
if (isNullish(process.env.TWITCH_BOT_OAUTH_CODE)) throw new Error("Twitch Bot OAuth code not found!");
if (isNullish(process.env.TWITCH_BOT_CLIENT_ID)) throw new Error("Twitch Bot Client ID not found!");
if (isNullish(process.env.TWITCH_BOT_SECRET)) throw new Error("Twitch Bot Secret not found!");
if (isNullish(process.env.TWITCH_EVENTSUB_SECRET)) throw new Error("Twitch Bot Secret not found!");

export const PORT = process.env.PORT ?? 5000;
export const BOT_SERVER_HOSTNAME = process.env.NODE_ENV === "production"
  ? process.env.SERVER_HOSTNAME
  : `localhost`;

export const DISCORD_API_VERSION = "10";
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

export const HOST_TWITCH_USERNAME = process.env.HOST_USERNAME;
export const HOST_TWITCH_ID = process.env.HOST_TWITCH_ID;
export const OWNER_TWITCH_USERNAME = process.env.OWNER_TWITCH_USERNAME;
export const OWNER_TWITCH_ID = process.env.OWNER_TWITCH_ID;
export const TWITCH_BOT_USERNAME = process.env.TWITCH_BOT_USERNAME;
export const TWITCH_BOT_OAUTH_CODE = process.env.TWITCH_BOT_OAUTH_CODE;
export const TWITCH_BOT_CLIENT_ID = process.env.TWITCH_BOT_CLIENT_ID;
export const TWITCH_BOT_SECRET = process.env.TWITCH_BOT_SECRET;
export const TWITCH_EVENTSUB_SECRET = process.env.TWITCH_EVENTSUB_SECRET;

export const TWITCH_BOT_CONFIG: Options = {
  channels: [ HOST_TWITCH_USERNAME, OWNER_TWITCH_USERNAME, TWITCH_BOT_USERNAME ],
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: TWITCH_BOT_USERNAME,
    password: TWITCH_BOT_OAUTH_CODE
  }
};

export const TWITCH_LOGGER_CONFIG = {
  colors: true,
  minLevel: "debug",
  timestamps: true
};

export const TWITCH_EVENTSUB_CONFIG = {
  hostName: BOT_SERVER_HOSTNAME,
  pathPrefix: "/api/twitch/eventsub",
  usePathPrefixInHandlers: true,
  logger: {
    name: "Twitch EventSub",
    ...TWITCH_LOGGER_CONFIG
  },
  strictHostCheck: true,
  secret: TWITCH_EVENTSUB_SECRET
};

export const TWITCH_AUTH_PROVIDER_CONFIG = {
  clientID: TWITCH_BOT_CLIENT_ID,
  clientSecret: TWITCH_BOT_SECRET
};
