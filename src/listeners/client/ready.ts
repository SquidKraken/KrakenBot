import type { ClientListenerStructure } from "../../structures/ClientListener.js";

const interactionCreate: ClientListenerStructure<"ready"> = {
  name: "ready",
  runOnce: false,
  run() {
    console.log("Bot is ready!");
  }
};

export default interactionCreate;
