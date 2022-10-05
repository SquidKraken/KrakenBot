import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelUpdate = createEventSubListener({
  name: "channelUpdate",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`Broadcaster ${event.broadcasterDisplayName}'s stream is updated! The stream is of category ${event.categoryName} with title "${event.streamTitle}".`);
  }
});

export default eventSubChannelUpdate;
