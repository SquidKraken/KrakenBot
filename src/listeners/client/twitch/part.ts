import { createTwitchListener } from "../../../types/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const twitchChannelPart = createTwitchListener({
  name: "part",
  runOnce: false,
  run(_bot, _client, channel, username, isSelf) {
    const targetPhrase = isSelf
      ? "I have"
      : `${username} has`;

    void twitchLog(`${targetPhrase} parted from ${channel}'s channel`);
  }
});

export default twitchChannelPart;
