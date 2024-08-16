import type { Message, TextBasedChannel } from "discord.js";
import { EmbedBuilder } from "discord.js";

import type { DiscordNonModalContext } from "../contexts/DiscordContext.js";
import type introductionModalData from "../listeners/interaction/modals/introduction.js";
import type { KrakenBot } from "../KrakenBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";
import { INTRODUCTION_CHANNEL_ID } from "../config/constants.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";
import { IntroductionDetails } from "../types/IntroductionDetails.js";
import { ERRORS } from "../config/messages.js";

function generateIntroductionEmbed({
  name, iconURL, userName, userAge, userPronouns, aboutUser, userHobbies
}: IntroductionDetails): EmbedBuilder {
  const birthDate = userAge === -1 ? "" : `Born <t:${Date.parse(`${new Date().getFullYear() - userAge + 1}`) / 1000}:R>\u2006\n\u200B`;

  return new EmbedBuilder()
    .setAuthor({
      name,
      iconURL
    })
    .setDescription("## 👋 My Introduction")
    .addFields([
      { name: "👤 My Name", value: `${userName}\u2006\n\u200B`, inline: true },
      ...(userAge === -1 ? [] : [ { name: "🧙 My Age", value: birthDate, inline: true } ]),
      { name: "❔ My Pronouns", value: `${userPronouns}\u2006\n\u200B`, inline: true },
      { name: "🙋 About Me", value: `${aboutUser}\n\u200B` },
      { name: "⚽ My Hobbies", value: userHobbies }
    ])
    .setColor("#6a1f36");
}

/**
 * Manages Receiving and Posting introduction messages
 *
 * Two types of methods:
 * - Possessive: Require context to manage user interface
 * - Implicit: Require raw data to produce side-effect
 */
export class IntroductionService {
  readonly bot: KrakenBot;

  constructor(bot: KrakenBot) {
    this.bot = bot;
  }

  get introductionModal(): (typeof introductionModalData)["modal"] {
    const introductionModal = this.bot.interactions.modal.listeners.get("introduction")?.modal;
    if (isNullish(introductionModal)) throw new Error(ERRORS.MISSING_MODAL);

    return introductionModal;
  }

  async getIntroductionChannel(): Promise<ServiceResponse<TextBasedChannel>> {
    const introductionChannel = await this.bot.clients.discord.emitter.channels.fetch(INTRODUCTION_CHANNEL_ID);
    if (isNullish(introductionChannel) || !introductionChannel.isTextBased()) return new ServiceError(ERRORS.MISSING_INTRO_CHANNEL);

    return new ServiceData(introductionChannel);
  }

  async requestIntroUsing(context: DiscordNonModalContext<false>): Promise<void> {
    return context.showModal(this.introductionModal);
  }

  async postIntro(introductionDetails: IntroductionDetails): Promise<ServiceResponse<Message>> {
    const serviceResponse = await this.getIntroductionChannel();
    if (serviceResponse.errored) return serviceResponse;

    const introductionChannel = serviceResponse.data;
    const embedToSend = generateIntroductionEmbed(introductionDetails);

    try {
      const sentMessage = await introductionChannel.send({ embeds: [ embedToSend ] });

      return new ServiceData(sentMessage);
    } catch {
      return new ServiceError(ERRORS.CANT_SEND_INTRO);
    }
  }
}
