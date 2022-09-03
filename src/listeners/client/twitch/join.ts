import type { TwitchTemplate } from "../../../templates/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";

const twitchChannelJoin: TwitchTemplate<"join"> = {
  name: "join",
  runOnce: false,
  run(_bot, _client, channel, username, isSelf) {
    const targetPhrase = isSelf
      ? "I have"
      : `${username} has`;

    void twitchLog(`${targetPhrase} joined ${channel}'s channel`);
  }
};

export default twitchChannelJoin;
