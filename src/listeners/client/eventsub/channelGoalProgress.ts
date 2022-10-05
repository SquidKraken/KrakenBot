import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelGoalProgress = createEventSubListener({
  name: "channelGoalProgress",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`A goal of type ${event.type} on ${event.broadcasterDisplayName}'s channel has progressed! The goal is only ${event.targetAmount - event.currentAmount} points away from completion.`);
  }
});

export default eventSubChannelGoalProgress;
