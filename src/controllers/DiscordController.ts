/* eslint-disable class-methods-use-this */
import type {
  ChatInputCommandInteraction, CommandInteraction, InteractionReplyOptions, InteractionResponse,
  Message, MessageOptions, MessagePayload
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

export class DiscordController extends BaseController {
  readonly interaction: ChatInputCommandInteraction;

  constructor(interaction: ChatInputCommandInteraction) {
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

  async showModal(modal: Parameters<ShowModalMethod>[ 0 ]): ReturnType<ShowModalMethod> {
    return this.interaction.showModal(modal);
  }

  async deferReply(options?: Parameters<DeferReplyMethod>[ 0 ]): ReturnType<DeferReplyMethod> {
    return this.interaction.deferReply(options);
  }

  async editReply(options: Parameters<EditReplyMethod>[ 0 ]): ReturnType<EditReplyMethod> {
    return this.interaction.editReply(options);
  }
}
