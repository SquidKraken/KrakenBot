import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelSubscription = createEventSubListener({
  name: "channelSubscription",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.userDisplayName} subscribed to ${event.broadcasterDisplayName}'s channel!`);
  }
});

export default eventSubChannelSubscription;
