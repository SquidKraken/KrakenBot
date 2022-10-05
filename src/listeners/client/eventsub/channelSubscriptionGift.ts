import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelSubscriptionGift = createEventSubListener({
  name: "channelSubscriptionGift",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.gifterDisplayName} gifted a subscription of amount ${event.amount} and tier ${event.tier} to ${event.broadcasterDisplayName}'s channel!`);
  }
});

export default eventSubChannelSubscriptionGift;
