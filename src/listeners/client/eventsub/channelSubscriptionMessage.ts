import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelSubscriptionMessage = createEventSubListener({
  name: "channelSubscriptionMessage",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.userDisplayName} subscribed to ${event.broadcasterDisplayName}'s channel for ${event.durationMonths} months, and with message ${event.messageText}!`);
  }
});

export default eventSubChannelSubscriptionMessage;
