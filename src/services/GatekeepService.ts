import type { APIInteractionGuildMember, GuildMember } from "discord.js";

import type { KrakenBot } from "../KrakenBot.js";
import type { ServiceResponse } from "../utilities/ServiceResponse.js";
import { ServiceData, ServiceError } from "../utilities/ServiceResponse.js";
import { ACCESS_ROLE_ID, CHILD_ROLE_ID, GROWN_UP_ROLE_ID } from "../config/constants.js";
import { ERRORS } from "../config/messages.js";

type APIGuildMember = APIInteractionGuildMember | GuildMember;

export class GatekeepService {
  readonly bot: KrakenBot;

  constructor(bot: KrakenBot) {
    this.bot = bot;
  }

  // eslint-disable-next-line class-methods-use-this
  async giveAccessRoles(member: APIGuildMember, memberAge: number): Promise<ServiceResponse<APIGuildMember>> {
    if (Array.isArray(member.roles)) return new ServiceError(ERRORS.UNEXPECTED);

    try {
      const guildMember = await member.roles.add([
        ACCESS_ROLE_ID,
        memberAge >= 18 ? GROWN_UP_ROLE_ID : CHILD_ROLE_ID
      ]);

      return new ServiceData(guildMember);
    } catch {
      return new ServiceError(ERRORS.CANT_ASSIGN_ROLES);
    }
  }
}
