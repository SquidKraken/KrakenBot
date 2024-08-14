import { TwitchContext } from "../../../contexts/TwitchContext.js";
import { createTwitchListener } from "../../../templates/TwitchTemplate.js";
import { twitchLog } from "../../../utilities/logger.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

const textCommandPattern = /^!(?<rawCommandName>[a-zA-Z]+)\s*(?<rawCommandArguments>\w*)$/gui;

function extractTextCommandName(content: string): string | undefined {
  const commandMatch = textCommandPattern.exec(content);

  const { rawCommandName } = commandMatch?.groups ?? {};

  return rawCommandName?.toLowerCase();
}
const twitchMessage = createTwitchListener({
  name: "message",
  runOnce: false,
  // eslint-disable-next-line max-params
  run(bot, client, channel, userstate, message, isSelf) {
    if (isSelf) return;

    const messageContent = message.trim();
    const messageType = userstate["message-type"] ?? "unknown";
    void twitchLog(`Received ${messageType} from ${channel}: ${messageContent}`, userstate);

    const commandName = extractTextCommandName(messageContent);
    if (isNullish(commandName)) return;

    const command = bot.interactions.command.listeners.get(commandName);
    if (isNullish(command)) return;

    const context = new TwitchContext(client, channel, userstate);

    return bot.interactions.command.runIfCompatible(command, "twitch", bot, context);
  }
});

export default twitchMessage;
