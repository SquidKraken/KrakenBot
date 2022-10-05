import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelCheer = createEventSubListener({
  name: "channelCheer",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`${event.isAnonymous ? "Someone" : `User ${event.userDisplayName!}`} cheered in ${event.broadcasterDisplayName}'s channel!`);
  }
});

export default eventSubChannelCheer;
