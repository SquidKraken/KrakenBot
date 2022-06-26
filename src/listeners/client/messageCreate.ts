import type { ClientListenerStructure } from "../../structures/ClientListener";

const interactionCreate: ClientListenerStructure<"messageCreate"> = {
  name: "messageCreate",
  runOnce: false,
  run(_bot, message) {
    console.log(message.content);
  }
};

export default interactionCreate;
