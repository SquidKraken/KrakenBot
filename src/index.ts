import "dotenv/config";
import { KrakenBot } from "./structures/KrakenBot.js";
import { startKrakenServer } from "./server.js";
import { DISCORD_BOT_APPLICATION_ID, DISCORD_BOT_TOKEN, TWITCH_BOT_CREDENTIALS } from "./config.js";

const bot = new KrakenBot(DISCORD_BOT_TOKEN, DISCORD_BOT_APPLICATION_ID, TWITCH_BOT_CREDENTIALS);
await bot.login(DISCORD_BOT_TOKEN);

startKrakenServer();
