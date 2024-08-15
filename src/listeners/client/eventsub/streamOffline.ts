import { HOST_TWITCH_ID } from "../../../config/api.js";
import { createEventSubListener } from "../../../templates/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubStreamOffline = createEventSubListener({
  event: "onStreamOffline",
  runOnce: false,
  target: [HOST_TWITCH_ID],
  async run(bot, _client, event) {
    const serviceResponse = await bot.services.streamActivity.offline();
    if (serviceResponse.errored) console.error(serviceResponse.message);

    void twitchLog(`Broadcaster ${event.broadcasterDisplayName} is no longer streaming!.`);
  }
});

export default eventSubStreamOffline;
