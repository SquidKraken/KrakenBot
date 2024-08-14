import { createEventSubListener } from "../../../templates/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubStreamOffline = createEventSubListener({
  name: "streamOffline",
  runOnce: false,
  async run(bot, _client, event) {
    const serviceResponse = await bot.services.streamStatus.offline();
    if (serviceResponse.errored) console.error(serviceResponse.message);

    void twitchLog(`Broadcaster ${event.broadcasterDisplayName} is no longer streaming!.`);
  }
});

export default eventSubStreamOffline;
