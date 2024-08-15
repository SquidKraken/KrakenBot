import { HOST_TWITCH_ID } from "../../../config/api.js";
import { createEventSubListener } from "../../../templates/EventSubTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const eventSubStreamOnline = createEventSubListener({
  name: "streamOnline",
  runOnce: false,
  async run(bot, _client, event) {
    const serviceResponse = await bot.services.streamActivity.online(HOST_TWITCH_ID);
    if (serviceResponse.errored) console.error(serviceResponse.message);

    void twitchLog(`Broadcaster ${event.broadcasterDisplayName} is now streaming! The stream is of type ${event.type}.`);
  }
});

export default eventSubStreamOnline;
