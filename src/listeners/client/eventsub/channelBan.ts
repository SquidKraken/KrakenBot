import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelBan = createEventSubListener({
  name: "channelBan",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`User ${event.userDisplayName} was banned in ${event.broadcasterDisplayName}'s channel by ${event.moderatorDisplayName}!`);
  }
});

export default eventSubChannelBan;
