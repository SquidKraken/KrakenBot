/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */
import type {
  ButtonInteraction, ChatInputCommandInteraction, CommandInteraction, InteractionReplyOptions,
  MessageContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction, UserContextMenuCommandInteraction,
  InteractionResponse, Message, MessageOptions, MessagePayload
} from "discord.js";
import { BaseController, BaseFormatter } from "./BaseController.js";

type ShowModalMethod = CommandInteraction[ "showModal" ];
type DeferReplyMethod = CommandInteraction[ "deferReply" ];
type EditReplyMethod = CommandInteraction[ "editReply" ];

class DiscordFormatter extends BaseFormatter {
  hyperlink(text: string, url: `https://${string}`): string {
    return `[${text}](<${url}>)`;
  }
}

type ComponentInteractions = ButtonInteraction
| ChatInputCommandInteraction
| MessageContextMenuCommandInteraction
| SelectMenuInteraction
| UserContextMenuCommandInteraction;

type ModalInteraction = ModalSubmitInteraction;

type BaseInteractions = ComponentInteractions | ModalInteraction;

export class DiscordBaseController extends BaseController {
  readonly interaction: BaseInteractions;

  constructor(interaction: BaseInteractions) {
    const formatter = new DiscordFormatter();
    super(formatter);
    this.interaction = interaction;
  }

  override async reply(options: InteractionReplyOptions | MessagePayload | string): Promise<InteractionResponse> {
    return this.interaction.reply(options);
  }

  override async send(options: MessageOptions | MessagePayload | string): Promise<Message | undefined> {
    return this.interaction.channel?.send(options);
  }

  override async error(errorMessage: string): Promise<InteractionResponse> {
    return this.interaction.reply({
      content: errorMessage,
      ephemeral: true
    });
  }

  async deferReply(options?: Parameters<DeferReplyMethod>[ 0 ]): ReturnType<DeferReplyMethod> {
    return this.interaction.deferReply(options);
  }

  async editReply(options: Parameters<EditReplyMethod>[ 0 ]): ReturnType<EditReplyMethod> {
    return this.interaction.editReply(options);
  }
}

class DiscordInteractableController extends DiscordBaseController {
  override readonly interaction: ComponentInteractions;

  constructor(interaction: ComponentInteractions) {
    super(interaction);
    this.interaction = interaction;
  }

  async showModal(modal: Parameters<ShowModalMethod>[ 0 ]): ReturnType<ShowModalMethod> {
    return this.interaction.showModal(modal);
  }
}

export class DiscordModalController extends DiscordBaseController {
  override readonly interaction: ModalSubmitInteraction;

  constructor(interaction: ModalSubmitInteraction) {
    super(interaction);
    this.interaction = interaction;
  }
}

export class DiscordButtonController extends DiscordInteractableController {
  override readonly interaction: ButtonInteraction;

  constructor(interaction: ButtonInteraction) {
    super(interaction);
    this.interaction = interaction;
  }
}

export class DiscordCommandController extends DiscordInteractableController {
  override readonly interaction: ChatInputCommandInteraction;

  constructor(interaction: ChatInputCommandInteraction) {
    super(interaction);
    this.interaction = interaction;
  }
}
