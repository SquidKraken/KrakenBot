import type {
  ChannelManager, Message, BaseMessageOptions, TextBasedChannel
} from "discord.js";
import type { Client as TMIClient } from "tmi.js";
import type { HelixGame, HelixStream, HelixUser } from "@twurple/api";
import {
  AttachmentBuilder, bold, EmbedBuilder, time
} from "discord.js";

import type { KrakenBot } from "../KrakenBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";
import type { TwitchClient } from "../handlers/client/TwitchClient.js";
import { isNullish } from "../utilities/nullishAssertion.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";
import {
  ANNOUNCEMENT_CHANNEL_ID, BOX_ART_URL_HEIGHT, BOX_ART_URL_WIDTH,
  SELF_PROMO_INTERVAL_MILLISECONDS, TWITCH_COLOR, TWITCH_ICON_FILENAME
} from "../config/constants.js";
import { ERRORS, PROMO_MESSAGES, TEXTUAL_INDICATORS } from "../config/messages.js";
import { shuffleArray } from "../utilities/shuffleArray.js";
import { createLinkButtonRow } from "../utilities/createLinkButton.js";

class PromoInterval {
  readonly client: TMIClient;
  interval: ReturnType<typeof setInterval> | undefined;
  calls = 0;

  constructor(client: TMIClient) {
    this.client = client;
  }

  start(hostID: string): void {
    if (!isNullish(this.interval)) return;

    const shuffledPromoMessages = shuffleArray(PROMO_MESSAGES);

    this.interval = setInterval(async () => {
      // The modulo operation will always return a number between 0 and the length of the array
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const promoMessageToSend = shuffledPromoMessages[this.calls % shuffledPromoMessages.length]!;
      this.calls += 1;

      await this.client.say(hostID, promoMessageToSend);
    }, SELF_PROMO_INTERVAL_MILLISECONDS);
  }

  stop(): void {
    if (isNullish(this.interval)) return;

    clearInterval(this.interval);
    // eslint-disable-next-line no-undefined
    this.interval = undefined;
    this.calls = 0;
    console.log("Interval cleared", this.interval);
  }
}

class AnnouncementManager {
  readonly channels: ChannelManager;
  message: Message | undefined;

  constructor(channels: ChannelManager) {
    this.channels = channels;
  }

  static generateStreamAnnouncementData(
    streamerData: HelixUser,
    streamData: HelixStream,
    gameData?: HelixGame
  ): Pick<BaseMessageOptions, "components" | "embeds" | "files"> {
    const isGameMissing = isNullish(gameData);
    const gameText = isGameMissing ? "" : `\n\nWe're streaming ${bold(gameData.name)}!`;
    const timeText = `\n\n🟢 Started ${time(streamData.startDate, "R")}`;
    const thumbnailURL = isGameMissing
      ? streamerData.profilePictureUrl
      : gameData.getBoxArtUrl(BOX_ART_URL_WIDTH, BOX_ART_URL_HEIGHT);

    // Path relative to project root
    const twitchLogo = new AttachmentBuilder(`./assets/${TWITCH_ICON_FILENAME}`);
    const announcementEmbed = new EmbedBuilder()
      .setAuthor({ name: "Twitch", iconURL: `attachment://${TWITCH_ICON_FILENAME}` })
      .setTitle(`${streamerData.displayName} is live!`)
      .setDescription(`${bold(streamData.title)}${gameText}${timeText}`)
      .setThumbnail(streamerData.profilePictureUrl)
      .setColor(TWITCH_COLOR)
      .setImage(thumbnailURL);

    const watchNowButtonRow = createLinkButtonRow("Watch Now!", `https://twitch.tv/${streamerData.name}`);

    return {
      components: [ watchNowButtonRow ],
      embeds: [ announcementEmbed ],
      files: [ twitchLogo ]
    };
  }

  async getChannel(): Promise<ServiceResponse<TextBasedChannel>> {
    const announcementChannel = await this.channels.fetch(ANNOUNCEMENT_CHANNEL_ID);
    if (isNullish(announcementChannel) || !announcementChannel.isTextBased()) return new ServiceError(ERRORS.MISSING_ANNOUNCEMENT_CHANNEL);

    return new ServiceData(announcementChannel);
  }

  async post(
    streamerData: HelixUser,
    streamData: HelixStream,
    gameData?: HelixGame
  ): Promise<ServiceResponse<Message>> {
    const serviceResponse = await this.getChannel();
    if (serviceResponse.errored) return serviceResponse;

    try {
      const announcementChannel = serviceResponse.data;
      const streamAnnouncementData = AnnouncementManager.generateStreamAnnouncementData(streamerData, streamData, gameData);
      const sentMessage = await announcementChannel.send(streamAnnouncementData);
      this.message = sentMessage;

      return new ServiceData(sentMessage);
    } catch {
      return new ServiceError(ERRORS.CANT_ANNOUNCE_STREAM);
    }
  }

  async markOffline(): Promise<ServiceResponse<Message>> {
    if (isNullish(this.message)) return new ServiceError(ERRORS.MISSING_STREAM_ANNOUNCEMENT);

    const onlineEmbed = this.message.embeds.at(0);
    if (isNullish(onlineEmbed) || isNullish(onlineEmbed.description)) return new ServiceError(ERRORS.MALFORMED_ANNOUNCEMENT);

    const offlineEmbed = new EmbedBuilder(onlineEmbed.toJSON())
      .setDescription(onlineEmbed.description.replace(/🟢 Started <t:\d+:\w>/u, TEXTUAL_INDICATORS.STREAM_OVER));

    const offlineMessage = await this.message.edit({
      embeds: [ offlineEmbed ],
      components: this.message.components
    });

    return new ServiceData(offlineMessage);
  }
}

export class StreamActivityService {
  readonly bot: KrakenBot;
  readonly announcement: AnnouncementManager;
  readonly interval: PromoInterval;
  readonly twitch: TwitchClient;

  constructor(bot: KrakenBot) {
    this.bot = bot;
    this.twitch = bot.clients.twitch;
    this.announcement = new AnnouncementManager(bot.clients.discord.emitter.channels);
    this.interval = new PromoInterval(this.twitch.chat.emitter.client);
  }

  async online(hostID: string): Promise<ServiceResponse<Message>> {
    const hostUser = await this.twitch.api.users.getUserById(hostID);
    if (isNullish(hostUser)) return new ServiceError("I could not fetch stream host data!");

    const hostStream = await this.twitch.api.streams.getStreamByUserId(hostID);
    if (isNullish(hostStream)) return new ServiceError("I could not fetch the stream's data!");

    const gameData = await hostStream.getGame();
    this.interval.start(hostID);

    return isNullish(gameData)
      ? this.announcement.post(hostUser, hostStream)
      : this.announcement.post(hostUser, hostStream, gameData);
  }

  async offline(): Promise<ServiceResponse<Message>> {
    this.interval.stop();

    return this.announcement.markOffline();
  }
}
