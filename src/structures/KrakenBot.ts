import { REST } from "@discordjs/rest";
import { Client, GatewayIntentBits } from "discord.js";
import { ButtonHandler } from "../handlers/ButtonHandler.js";
import { ClientHandler } from "../handlers/ClientHandler.js";
import { CommandHandler } from "../handlers/CommandHandler.js";
import { ModalHandler } from "../handlers/ModalHandler.js";

const BOT_CONFIG = {
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

export class KrakenBot {
  readonly applicationID: string;
  readonly client = new Client(BOT_CONFIG);
  readonly handlers: BotHandlers;

  constructor(botToken: string, applicationID: string) {
    this.applicationID = applicationID;
    this.handlers = new BotHandlers(this, botToken);
  }
}
