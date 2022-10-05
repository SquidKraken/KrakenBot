import "dotenv/config";
import { KrakenBot } from "./KrakenBot.js";
import { PORT } from "./config.js";
import { krakenApp } from "./server.js";

const bot = new KrakenBot();
await bot.clients.twitch.registerRouteListeners(krakenApp);
await bot.login();

// eslint-disable-next-line no-promise-executor-return
await new Promise(() => krakenApp.listen(PORT, async() => {
  await bot.clients.twitch.eventsub.middleware.markAsReady();
}));
