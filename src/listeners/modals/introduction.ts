/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
import type { ModalActionRowComponent } from "discord.js";
import type { ModalStructure } from "../../structures/ModalStructure.js";
import {
  TextChannel, MessageActionRow, MessageEmbed, Modal, TextInputComponent
} from "discord.js";
import { isNullish } from "../../utilities/nullishAssertion.js";

const ACCESS_ROLE_ID = "742869132990742688";
const ROLES_CHANNEL_ID = "743079881398812693";
const INTRODUCTION_CHANNEL_ID = "742871181929218161";
const aboutInput = new TextInputComponent()
  .setCustomId("aboutInput")
  .setLabel("🙋 Tell us a bit about yourself!")
  .setStyle("PARAGRAPH");

const ageInput = new TextInputComponent()
  .setCustomId("ageInput")
  .setLabel("🧙 How old are you?")
  .setStyle("SHORT");

const pronounsInput = new TextInputComponent()
  .setCustomId("pronounsInput")
  .setLabel("❔ What pronous would you like to be called?")
  .setStyle("SHORT");

const hobbiesInput = new TextInputComponent()
  .setCustomId("hobbiesInput")
  .setLabel("⚽ Tell us a bit more about your hobbies!")
  .setStyle("PARAGRAPH");

const introductionModal = new Modal()
  .setCustomId("introduction")
  .setTitle("👋 Introduce Yourself!")
  .addComponents(
    new MessageActionRow<ModalActionRowComponent>().addComponents(aboutInput),
    new MessageActionRow<ModalActionRowComponent>().addComponents(ageInput),
    new MessageActionRow<ModalActionRowComponent>().addComponents(pronounsInput),
    new MessageActionRow<ModalActionRowComponent>().addComponents(hobbiesInput)
  );

const modalData: ModalStructure = {
  name: "introduction",
  modal: introductionModal,
  async run(_bot, interaction): Promise<void> {
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
    const embedToSend = new MessageEmbed()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL()! })
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
    await interaction.reply({ content: `Thank you for letting us know about yourself! Grab yourself some roles from <#${ROLES_CHANNEL_ID}> to get access to the rest of the server.`, ephemeral: true });
  }
};

export default modalData;
