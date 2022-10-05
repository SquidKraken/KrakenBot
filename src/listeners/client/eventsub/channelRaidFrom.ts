import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelRaidFrom = createEventSubListener({
  name: "channelRaidFrom",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`${event.raidedBroadcasterDisplayName}'s channel is being raided by ${event.raidingBroadcasterDisplayName}!`);
  }
});

export default eventSubChannelRaidFrom;
