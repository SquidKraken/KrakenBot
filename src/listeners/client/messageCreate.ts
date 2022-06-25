import type { Message } from "discord.js";
import type { ClientListenerStructure } from "../../structures/ClientListener";

import type { KrakenBot } from "../../structures/KrakenBot.js";

const interactionCreate: ClientListenerStructure<"messageCreate"> = {
  name: "messageCreate",
  runOnce: false,
  run(_bot: KrakenBot, message: Message): void {
    console.log(message.content);
  }
};

export default interactionCreate;
