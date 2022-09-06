import { TwitchController } from "../../../controllers/TwitchController.js";
import { createTwitchListener } from "../../../templates/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const textCommandPattern = /^!(?<rawCommandName>[a-zA-Z]+)\s*(?<rawCommandArguments>\w*)$/gui;
const twitchMessage = createTwitchListener({
  name: "message",
  runOnce: false,
  // eslint-disable-next-line max-params, max-statements
  run(bot, client, channel, userstate, message, isSelf) {
    if (isSelf) return;

    const messageContent = message.trim();
    const messageType = userstate["message-type"] ?? "unknown";
    void twitchLog(`Received ${messageType} from ${channel}: ${messageContent}`, userstate);

    const commandMatch = textCommandPattern.exec(messageContent);
    if (isNullish(commandMatch) || isNullish(commandMatch.groups)) return;

    const { rawCommandName = "" } = commandMatch.groups;
    const commandName = rawCommandName.toLowerCase();
    const command = bot.interactions.command.listeners.get(commandName);
    if (isNullish(command)) return;

    const twitchController = new TwitchController(client, channel, userstate);

    return bot.interactions.command.runIfCompatible(command, "twitch", bot, twitchController);
  }
});

export default twitchMessage;
