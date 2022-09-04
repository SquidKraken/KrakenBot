import type { ModalActionRowComponentBuilder } from "discord.js";
import {
  TextChannel, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";
import { ACCESS_ROLE_ID, INTRODUCTION_CHANNEL_ID, ROLES_CHANNEL_ID } from "../../../constants.js";

import { createModal } from "../../../templates/ModalTemplate.js";
import { isNullish } from "../../../utilities/nullishAssertion.js";

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
  // eslint-disable-next-line max-lines-per-function, max-statements
  async run(_bot, interaction) {
    const introductionChannel = await interaction.guild?.channels.fetch(INTRODUCTION_CHANNEL_ID);
    if (isNullish(introductionChannel) || !(introductionChannel instanceof TextChannel)) return interaction.reply({
      content: "Could not find the interaction channel!",
      ephemeral: true
    });
    if (isNullish(interaction.member)) return;

    const aboutUser = interaction.fields.getTextInputValue("aboutInput");
    const userAge = interaction.fields.getTextInputValue("ageInput");
    const userPronouns = interaction.fields.getTextInputValue("pronounsInput");
    const userHobbies = interaction.fields.getTextInputValue("hobbiesInput");
    const embedToSend = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL()!
      })
      .setDescription([
        `🙋 **About Me:** ${aboutUser}`,
        `🧙 **My Age:** ${userAge}`,
        `❔ **My Pronouns**: ${userPronouns}`,
        `⚽ **My Hobbies:** ${userHobbies}`
      ].join("\n"));

    if (Array.isArray(interaction.member.roles)) return interaction.reply({
      content: "An unexpected error occured. Please try again.",
      ephemeral: true
    });

    try {
      await interaction.member.roles.add(ACCESS_ROLE_ID);
    } catch {
      return interaction.reply({
        content: "An unexpected error occured. Please try again.",
        ephemeral: true
      });
    }

    await introductionChannel.send({ embeds: [ embedToSend ] });

    return interaction.reply({
      content: `Thank you for letting us know about yourself! Grab yourself some roles from <#${ROLES_CHANNEL_ID}> to get access to the rest of the server.`,
      ephemeral: true
    });
  }
});

export default modalData;
