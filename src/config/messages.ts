import { DISCORD_INVITE, ROLES_CHANNEL_ID, TWITTER_LINK, YOUTUBE_LINK } from "./constants.js";

export const ERRORS = {
  UNEXPECTED: "An unexpected error occured. Please try again.",
  CANT_ASSIGN_ROLES: "I was unable to give you the required roles!",
  MISSING_MODAL: "Missing Introduction modal!",
  MISSING_INTRO_CHANNEL: "Missing Introduction channel!",
  MISSING_ANNOUNCEMENT_CHANNEL: "Missing Announcement channel!",
  CANT_SEND_INTRO: "Could not send introduction message to the introduction channel!",
  CANT_ANNOUNCE_STREAM: "I could not post the streamer online announcement!",
  MISSING_STREAM_ANNOUNCEMENT: "Stream is not online or announcement message is missing!",
  MALFORMED_ANNOUNCEMENT: "Announcement message is malformed!",
  FAILED_STREAMER_DATA_FETCH: "I could not fetch stream host data!",
  FAILED_STREAM_DATA_FETCH: "I could not fetch the stream's data!",
  INVALID_SUBSCRIBE_METHOD: "Invalid event subscribe method name!",
  FAILED_INTRO_BUTTON_SETUP: "Could not set up the Introduction button!",
  MISSING_INTRO_BUTTON_DATA: "Could not find the Introduction button data!",
  MISSING_SAY_ARGUMENTS: "You have not provided anything for me to say!"
} as const;

export const TEXTUAL_INDICATORS = {
  STREAM_OVER: "🔴 Stream is over!",
  BOT_READY: "Bot is ready!",
  INTRO_TITLE: "Introduce Yourself!",
  INTRO_EMOJI: "👋",
  DISCORD_SERVER_TEXT: "Squid's Discord Server",
} as const;

export const COMMAND_DESCRIPTIONS = {
  DISCORD: "View Squid's Discord server's invite",
  INTRODUCE: "Introduce yourself to this server!",
  PING: "Replies with 'Pong!'",
  RESTORE_INTRODUCE_BUTTON: "Restores the button for introduction form",
  SAY: "Say something!",
  TWITTER: "View Squid's Twitter page link",
  YOUTUBE: "View Squid's YouTube channel link"
} as const;

export const MESSAGE_CONTENT = {
  INTRODUCE_INSTRUCTION: "**Introduce Yourself** by clicking the button below!"
} as const;

export const REPLY_CONTENT = {
  INTRO_BUTTON_SETUP: "Successfully set up the Introduction button!",
  INTRO_RECEIVED: `Thank you for letting us know about yourself! Grab yourself some roles from <#${ROLES_CHANNEL_ID}> to get access to the rest of the server.`
} as const;

export const PROMO_MESSAGES = [
  `Interact with the rest of the community over at Squid's Discord server: ${DISCORD_INVITE}`,
  `Keep up to date with announcements, updates and polls over at Squid's Twitter: ${TWITTER_LINK}`,
  `Explore more of Squid's content over at their YouTube channel: ${YOUTUBE_LINK}`
]