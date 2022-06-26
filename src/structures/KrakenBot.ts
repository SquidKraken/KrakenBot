import { REST } from "@discordjs/rest";
import { Client, Intents } from "discord.js";
import { ButtonHandler } from "../handlers/ButtonHandler.js";
import { ClientHandler } from "../handlers/ClientHandler.js";
import { CommandHandler } from "../handlers/CommandHandler.js";
import { ModalHandler } from "../handlers/ModalHandler.js";

const BOT_CONFIG = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
  ]
};

export class KrakenBot {
  readonly applicationID: string;
  readonly client = new Client(BOT_CONFIG);
  readonly handlers: BotHandlers;

  constructor(botToken: string, applicationID: string) {
    this.applicationID = applicationID;
    this.handlers = new BotHandlers(this, botToken);
  }
}

class BotHandlers {
  readonly button: ButtonHandler;
  readonly client: ClientHandler;
  readonly command: CommandHandler;
  readonly modal: ModalHandler;
  readonly rest: REST;

  constructor(bot: KrakenBot, botToken: string) {
    this.button = new ButtonHandler(bot);
    this.client = new ClientHandler(bot);
    this.command = new CommandHandler(bot);
    this.modal = new ModalHandler(bot);
    this.rest = new REST({ version: "9" }).setToken(botToken);
  }

  async loadAndRegisterAll(): Promise<void> {
    await this.button.loadAndRegisterListeners();
    await this.client.loadAndRegisterListeners();
    await this.command.loadAndRegisterListeners();
    await this.modal.loadAndRegisterListeners();
  }
}
