import type { ModalActionRowComponentBuilder } from "discord.js";
import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle
} from "discord.js";

import { createModal } from "../../../templates/ModalTemplate.js";
import { REPLY_CONTENT } from "../../../config/messages.js";

const nameInput = new TextInputBuilder()
  .setCustomId("nameInput")
  .setLabel("👤 What is your name?")
  .setStyle(TextInputStyle.Short);

const birthInput = new TextInputBuilder()
  .setCustomId("birthInput")
  .setLabel("📅 When were you born? (MM/DD/YYYY)")
  .setStyle(TextInputStyle.Short)
  .setRequired(false);

const pronounsInput = new TextInputBuilder()
  .setCustomId("pronounsInput")
  .setLabel("❔ What pronouns do you go by?")
  .setStyle(TextInputStyle.Short);

const aboutInput = new TextInputBuilder()
  .setCustomId("aboutInput")
  .setLabel("🙋 Tell us a bit about yourself!")
  .setStyle(TextInputStyle.Paragraph);

const hobbiesInput = new TextInputBuilder()
  .setCustomId("hobbiesInput")
  .setLabel("⚽ Tell us a bit more about your hobbies!")
  .setStyle(TextInputStyle.Paragraph);

const introductionModal = new ModalBuilder()
  .setCustomId("introduction")
  .setTitle("👋 Introduce Yourself!")
  .addComponents(
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(birthInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pronounsInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(aboutInput),
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput)
  );

const introductionModalData = createModal({
  name: "introduction",
  allowInDMs: false,
  modal: introductionModal,
  async run(bot, context) {
    const { interaction: { user, fields, member } } = context;
    const givenBirth = fields.getTextInputValue("birthInput");
    const calculatedAge = givenBirth && !Number.isNaN(Date.parse(givenBirth))
      ? Math.abs(new Date(Date.now() - Date.parse(givenBirth)).getUTCFullYear() - 1970)
      : -1;

    const introductionDetails = {
      name: user.username,
      iconURL: user.displayAvatarURL(),
      userName: fields.getTextInputValue("nameInput"),
      userAge: calculatedAge,
      userPronouns: fields.getTextInputValue("pronounsInput"),
      aboutUser: fields.getTextInputValue("aboutInput"),
      userHobbies: fields.getTextInputValue("hobbiesInput")
    };

    const introductionResponse = await bot.services.introduction.postIntro(introductionDetails);
    if (introductionResponse.errored) return context.error(introductionResponse.message);


    const gatekeepResponse = await bot.services.gatekeep.giveAccessRoles(member, calculatedAge);
    if (gatekeepResponse.errored) return context.error(gatekeepResponse.message);

    return context.reply({
      content: REPLY_CONTENT.INTRO_RECEIVED,
      ephemeral: true
    });
  }
});

export default introductionModalData;
