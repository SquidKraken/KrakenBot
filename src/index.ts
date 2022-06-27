/* eslint-disable node/no-process-env */
import "dotenv/config";
import { login as loginBot } from "./bot.js";
import { startKrakenServer } from "./server.js";
import { isNullish } from "./utilities/nullishAssertion.js";

const botToken = process.env.BOT_TOKEN;
const botApplicationID = process.env.BOT_APPLICATION_ID;
if (isNullish(botToken)) throw new Error("Bot token not found!");
if (isNullish(botApplicationID)) throw new Error("Bot application ID not found!");

await loginBot(botToken, botApplicationID);
startKrakenServer();
