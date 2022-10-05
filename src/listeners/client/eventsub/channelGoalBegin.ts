import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelGoalBegin = createEventSubListener({
  name: "channelGoalBegin",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`A goal of type ${event.type} on ${event.broadcasterDisplayName}'s channel has been set! The target of this goal is ${event.targetAmount} points.`);
  }
});

export default eventSubChannelGoalBegin;
