import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelSubscriptionEnd = createEventSubListener({
  name: "channelSubscriptionEnd",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.userDisplayName}'s subscription to ${event.broadcasterDisplayName}'s channel has ended!`);
  }
});

export default eventSubChannelSubscriptionEnd;
