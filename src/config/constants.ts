/* eslint-disable node/no-process-env */
import { isNullish } from "../utilities/nullishAssertion.js";

if (isNullish(process.env.DISCORD_INVITE_CODE)) throw new Error("Missing Discord Invite code!");
if (isNullish(process.env.HOST_USERNAME)) throw new Error("Missing Host username!");
if (isNullish(process.env.CREATOR_USERNAME)) throw new Error("Missing creator username!");

export const DISCORD_COLOR = "#5865f2";
export const TWITCH_COLOR = "#a970ff";

export const DISCORD_INVITE = `https://discord.gg/${process.env.DISCORD_INVITE_CODE}` as const;
export const TWITTER_LINK = `https://twitter.com/${process.env.HOST_USERNAME}` as const;
export const YOUTUBE_LINK = `https://www.youtube.com/c/${process.env.CREATOR_USERNAME}` as const;
export const TWITCH_LINK = `https://www.twitch.tv/${process.env.HOST_USERNAME}` as const;

export const ACCESS_ROLE_ID = "742869132990742688";
export const ROLES_CHANNEL_ID = "743079881398812693";
export const ANNOUNCEMENT_CHANNEL_ID = "743475845930287237";
export const INTRODUCTION_CHANNEL_ID = "742871181929218161";

export const SELF_PROMO_INTERVAL_MILLISECONDS = 45 * 60 * 1000;
export const TWITCH_ICON_FILENAME = "TwitchGlitchPurple.png";
export const BOX_ART_URL_WIDTH = 188;
export const BOX_ART_URL_HEIGHT = 250;
