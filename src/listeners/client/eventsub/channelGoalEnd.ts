import { createEventSubListener } from "../../../types/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubChannelGoalEnd = createEventSubListener({
  name: "channelGoalEnd",
  runOnce: false,
  run(_bot, _client, event) {
    void twitchLog(`A goal of type ${event.type} on ${event.broadcasterDisplayName}'s channel has ended! The goal, currently with points ${event.currentAmount}, was ${event.isAchieved ? "achieved" : `not achieved and fell short by ${event.targetAmount - event.currentAmount} points`}.`);
  }
});

export default eventSubChannelGoalEnd;
