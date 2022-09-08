import type { Options } from "tmi.js";
import { Client as DJSClient } from "discord.js";
import { Client as TMIClient } from "tmi.js";

import { DISCORD_BOT_CONFIG, TWITCH_BOT_CONFIG } from "../config.js";
import { DiscordClient } from "../handlers/client/DiscordClient.js";
import { TwitchClient } from "../handlers/client/TwitchClient.js";
import { ButtonHandler } from "../handlers/interaction/ButtonHandler.js";
import { CommandHandler } from "../handlers/interaction/CommandHandler.js";
import { ModalHandler } from "../handlers/interaction/ModalHandler.js";

class BotClients {
  readonly discord: DiscordClient;
  readonly twitch: TwitchClient;

  constructor(bot: KrakenBot, discordBotToken: string, discordBotApplicationID: string, twitchCredentials: Options["identity"]) {
    const djsClient = new DJSClient(DISCORD_BOT_CONFIG);
    const tmiClient = new TMIClient({
      ...TWITCH_BOT_CONFIG,
      identity: twitchCredentials
    });

    this.discord = new DiscordClient(bot, djsClient, discordBotToken, discordBotApplicationID);
    this.twitch = new TwitchClient(bot, tmiClient);
  }

  async instantiateAll(): Promise<void> {
    await this.discord.loadAndRegisterListeners();
    await this.twitch.loadAndRegisterListeners();
  }
}

class BotInteractions {
  readonly button: ButtonHandler;
  readonly command: CommandHandler;
  readonly modal: ModalHandler;

  constructor(bot: KrakenBot) {
    this.button = new ButtonHandler(bot);
    this.command = new CommandHandler(bot);
    this.modal = new ModalHandler(bot);
  }

  async instantiateAll(): Promise<void> {
    await this.button.loadAndRegisterListeners();
    await this.command.loadAndRegisterListeners();
    await this.modal.loadAndRegisterListeners();
  }
}

export class KrakenBot {
  readonly clients: BotClients;
  readonly interactions: BotInteractions;

  constructor(discordBotToken: string, discordApplicationID: string, twitchCredentials: Options["identity"]) {
    this.clients = new BotClients(this, discordBotToken, discordApplicationID, twitchCredentials);
    this.interactions = new BotInteractions(this);
  }

  async login(discordToken: string): Promise<KrakenBot> {
    await this.clients.instantiateAll();
    await this.interactions.instantiateAll();
    await this.clients.discord.emitter.login(discordToken);
    await this.clients.twitch.emitter.client.connect();

    return this;
  }
}
