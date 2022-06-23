import { KrakenBot } from "./structures/KrakenBot.js";

export async function login(botToken: string, applicationID: string): Promise<KrakenBot> {
  const bot = new KrakenBot(botToken, applicationID);
  await bot.handlers.loadAndRegisterAll();
  await bot.client.login(botToken);

  return bot;
}
