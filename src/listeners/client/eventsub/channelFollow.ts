import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelFollow = createEventSubListener({
  name: "channelFollow",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.userDisplayName} is now following ${event.broadcasterDisplayName}'s channel!`);
  }
});

export default eventSubChannelFollow;
