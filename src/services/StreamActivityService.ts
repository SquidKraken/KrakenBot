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
  ANNOUNCEMENT_CHANNEL_ID, BOX_ART_URL_HEIGHT, BOX_ART_URL_WIDTH, DISCORD_INVITE,
  SELF_PROMO_INTERVAL_MILLISECONDS, TWITCH_COLOR, TWITCH_ICON_FILENAME, TWITTER_LINK, YOUTUBE_LINK
} from "../constants.js";
import { randomizeArray } from "../utilities/randomizeArray.js";
import { createLinkButtonRow } from "../utilities/createLinkButton.js";

const ANNOUNCEMENT_TIME_PATTERN = /🟢 Started <t:\d+:\w>/u;
const PROMO_MESSAGES = randomizeArray([
  `Interact with the rest of the community over at Squid's Discord server: ${DISCORD_INVITE}`,
  `Keep up to date with announcements, updates and polls over at Squid's Twitter: ${TWITTER_LINK}`,
  `Explore more of Squid's content over at their YouTube channel: ${YOUTUBE_LINK}`
]);

function generateStreamAnnouncementData(
  streamerData: HelixUser,
  streamData: HelixStream,
  gameData: HelixGame | null
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

class PromoInterval {
  readonly client: TMIClient;
  interval: ReturnType<typeof setInterval> | undefined;
  calls = 0;

  constructor(client: TMIClient) {
    this.client = client;
  }

  start(hostID: string): void {
    if (!isNullish(this.interval)) return;

    this.interval = setInterval(async() => {
      const promoMessageToSend = PROMO_MESSAGES[this.calls % PROMO_MESSAGES.length]!;
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

  async getChannel(): Promise<ServiceResponse<TextBasedChannel>> {
    const announcementChannel = await this.channels.fetch(ANNOUNCEMENT_CHANNEL_ID);
    if (isNullish(announcementChannel) || !announcementChannel.isTextBased()) return new ServiceError("Missing Introduction channel!");

    return new ServiceData(announcementChannel);
  }

  async post(
    streamerData: HelixUser,
    streamData: HelixStream,
    gameData: HelixGame | null
  ): Promise<ServiceResponse<Message>> {
    const serviceResponse = await this.getChannel();
    if (serviceResponse.errored) return serviceResponse;

    try {
      const announcementChannel = serviceResponse.data;
      const streamAnnouncementData = generateStreamAnnouncementData(streamerData, streamData, gameData);
      const sentMessage = await announcementChannel.send(streamAnnouncementData);
      this.message = sentMessage;

      return new ServiceData(sentMessage);
    } catch {
      return new ServiceError(`I could not post the streamer online announcement!`);
    }
  }

  async markOffline(): Promise<ServiceResponse<Message>> {
    if (isNullish(this.message)) return new ServiceError("Stream is not online or announcement message is missing!");

    const onlineEmbed = this.message.embeds.at(0);
    if (isNullish(onlineEmbed)) return new ServiceError("Announcement message is malformed!");

    const offlineEmbed = new EmbedBuilder(onlineEmbed.toJSON())
      .setDescription(onlineEmbed.description!.replace(ANNOUNCEMENT_TIME_PATTERN, "🔴 Stream is over!"));

    const offlineMessage = await this.message.edit({
      embeds: [ offlineEmbed ],
      components: this.message.components
    });

    return new ServiceData(offlineMessage);
  }
}

export class StreamStatusService {
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

    return this.announcement.post(hostUser, hostStream, gameData);
  }

  async offline(): Promise<ServiceResponse<Message>> {
    this.interval.stop();

    return this.announcement.markOffline();
  }
}
