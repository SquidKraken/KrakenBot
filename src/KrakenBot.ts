import { DISCORD_BOT_TOKEN } from "./config.js";
import { DiscordClient } from "./handlers/client/DiscordClient.js";
import { TwitchClient } from "./handlers/client/TwitchClient.js";
import { ButtonHandler } from "./handlers/interaction/ButtonHandler.js";
import { CommandHandler } from "./handlers/interaction/CommandHandler.js";
import { ModalHandler } from "./handlers/interaction/ModalHandler.js";
import { IntroductionService } from "./services/IntroductionService.js";
import { GatekeepService } from "./services/GatekeepService.js";
import { StreamStatusService } from "./services/StreamStatusService.js";

class BotClients {
  readonly discord: DiscordClient;
  readonly twitch: TwitchClient;

  constructor(bot: KrakenBot) {
    this.discord = new DiscordClient(bot);
    this.twitch = new TwitchClient(bot);
  }

  async instantiateAll(): Promise<void> {
    await Promise.all([
      this.discord.loadAndRegisterListeners(),
      this.twitch.loadAndRegisterListeners()
    ]);
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
    await Promise.all([
      this.button.loadAndRegisterListeners(),
      this.command.loadAndRegisterListeners(),
      this.modal.loadAndRegisterListeners()
    ]);
  }
}

class BotServices {
  readonly streamStatus: StreamStatusService;
  readonly gatekeep: GatekeepService;
  readonly introduction: IntroductionService;

  constructor(bot: KrakenBot) {
    this.streamStatus = new StreamStatusService(bot);
    this.gatekeep = new GatekeepService(bot);
    this.introduction = new IntroductionService(bot);
  }
}

export class KrakenBot {
  readonly clients: BotClients;
  readonly interactions: BotInteractions;
  readonly services: BotServices;

  constructor() {
    this.clients = new BotClients(this);
    this.interactions = new BotInteractions(this);
    this.services = new BotServices(this);
  }

  async login(): Promise<KrakenBot> {
    await Promise.all([
      this.clients.instantiateAll(),
      this.interactions.instantiateAll()
    ]);
    await this.clients.discord.emitter.login(DISCORD_BOT_TOKEN);
    await this.clients.twitch.chat.emitter.client.connect();

    return this;
  }
}
