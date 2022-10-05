import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelUnban = createEventSubListener({
  name: "channelUnban",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.userDisplayName} was unbanned from ${event.broadcasterDisplayName}'s channel by ${event.moderatorDisplayName}!`);
  }
});

export default eventSubChannelUnban;
