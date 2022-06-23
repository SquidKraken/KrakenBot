import type { ClientListenerStructure } from "../../typedefs/ClientListenerStructure.js";

const interactionCreate: ClientListenerStructure<"ready"> = {
  name: "ready",
  runOnce: false,
  run(): void {
    console.log("Bot is ready!");
  }
};

export default interactionCreate;
