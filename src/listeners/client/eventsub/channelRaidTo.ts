import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelRaidTo = createEventSubListener({
  name: "channelRaidTo",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`${event.raidingBroadcasterDisplayName} is raiding ${event.raidedBroadcasterDisplayName}'s channel!`);
  }
});

export default eventSubChannelRaidTo;