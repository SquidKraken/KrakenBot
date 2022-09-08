import type { ModalActionRowComponentBuilder, ModalSubmitInteraction } from "discord.js";
import {
  TextChannel, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import { ACCESS_ROLE_ID, INTRODUCTION_CHANNEL_ID, ROLES_CHANNEL_ID } from "../../../constants.js";

import { createModal } from "../../../templates/ModalTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

function generateIntroductionEmbed({ fields, user }: ModalSubmitInteraction): EmbedBuilder {
  const aboutUser = fields.getTextInputValue("aboutInput");
  const userAge = fields.getTextInputValue("ageInput");
  const userPronouns = fields.getTextInputValue("pronounsInput");
  const userHobbies = fields.getTextInputValue("hobbiesInput");

  return new EmbedBuilder()
    .setAuthor({
      name: user.username,
      iconURL: user.avatarURL()!
    })
    .setDescription([
      `🙋 **About Me:** ${aboutUser}`,
      `🧙 **My Age:** ${userAge}`,
      `❔ **My Pronouns**: ${userPronouns}`,
      `⚽ **My Hobbies:** ${userHobbies}`
    ].join("\n"));
}
const aboutInput = new TextInputBuilder()
  .setCustomId("aboutInput")
  .setLabel("🙋 Tell us a bit about yourself!")
  .setStyle(TextInputStyle.Paragraph);

const ageInput = new TextInputBuilder()
  .setCustomId("ageInput")
  .setLabel("🧙 How old are you?")
  .setStyle(TextInputStyle.Short);

const pronounsInput = new TextInputBuilder()
  .setCustomId("pronounsInput")
  .setLabel("❔ What pronous would you like to be called?")
  .setStyle(TextInputStyle.Short);

const hobbiesInput = new TextInputBuilder()
  .setCustomId("hobbiesInput")
  .setLabel("⚽ Tell us a bit more about your hobbies!")
  .setStyle(TextInputStyle.Paragraph);

const introductionModal = new ModalBuilder()
  .setCustomId("introduction")
  .setTitle("👋 Introduce Yourself!")
  .addComponents(
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(aboutInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(ageInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pronounsInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput)
  );

const modalData = createModal({
  name: "introduction",
  modal: introductionModal,
  // eslint-disable-next-line max-statements
  async run(_bot, controller) {
    const interactionMemberRoles = controller.interaction.member?.roles;
    const introductionChannel = await controller.interaction.guild?.channels.fetch(INTRODUCTION_CHANNEL_ID);
    if (isNullish(introductionChannel) || !(introductionChannel instanceof TextChannel)) return controller.error("I could not find the introduction channel!");
    if (isNullish(interactionMemberRoles)) return controller.error("I could not fetch member data!");

    const embedToSend = generateIntroductionEmbed(controller.interaction);
    if (Array.isArray(interactionMemberRoles)) return controller.error("An unexpected error occured. Please try again.");

    try {
      await interactionMemberRoles.add(ACCESS_ROLE_ID);
    } catch {
      return controller.error("I was unable to give you the required roles!");
    }

    await introductionChannel.send({ embeds: [ embedToSend ] });

    return controller.reply({
      content: `Thank you for letting us know about yourself! Grab yourself some roles from <#${ROLES_CHANNEL_ID}> to get access to the rest of the server.`,
      ephemeral: true
    });
  }
});

export default modalData;
