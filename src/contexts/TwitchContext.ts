/* eslint-disable class-methods-use-this */
import type { ChatUserstate, Client as TMIClient } from "tmi.js";
import type { RequiredMessageOptions, RequiredReplyOptions, SayReturnType } from "./BaseContext.js";
import { BaseContext, BaseFormatter } from "./BaseContext.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { LinkFormatType } from "../types/LinkFormatType.js";

class TwitchFormatter extends BaseFormatter {
  hyperlink(text: string, url: `https://${string}`, nameFormat: LinkFormatType): string {
    return nameFormat === LinkFormatType.Bracket
      ? `${text} (${url})`
      : `${text}: ${url}`;
  }
}

export class TwitchContext extends BaseContext {
  readonly client: TMIClient;
  readonly channel: string;
  readonly userstate: ChatUserstate;

  constructor(tmiClient: TMIClient, channel: string, userstate: ChatUserstate) {
    const formatter = new TwitchFormatter();
    super(formatter);
    this.client = tmiClient;
    this.channel = channel;
    this.userstate = userstate;
  }

  override async send(options: RequiredMessageOptions | string): Promise<SayReturnType | void> {
    const isMessageString = typeof options === "string";
    const content = isMessageString ? options : options.content;
    const username = this.userstate.username;
    if (isNullish(username)) return;

    return this.client.say(this.channel, content);
  }

  override async reply(options: RequiredReplyOptions | string): Promise<SayReturnType | void> {
    const isMessageString = typeof options === "string";
    const isWhisper = (isMessageString ? false : options.ephemeral ?? false) || (this.userstate["message-type"] === "whisper");
    const content = isMessageString ? options : options.content;
    const username = this.userstate.username;
    if (isNullish(username)) return;

    return isWhisper
      ? this.client.whisper(username, content)
      : this.client.say(this.channel, `${username} ${content}`);
  }

  override async error(errorMessage: string): Promise<SayReturnType | void> {
    return this.reply({
      content: errorMessage,
      ephemeral: true
    });
  }
}
