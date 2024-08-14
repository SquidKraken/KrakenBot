import type { ApplicationCommandOptionType } from "discord-api-types/v9";
import type { KrakenBot } from "../KrakenBot.js";
import type { BaseContext } from "../contexts/BaseContext.js";
import type { DiscordCommandContext } from "../contexts/DiscordContext.js";
import type { TwitchContext } from "../contexts/TwitchContext.js";

interface CommandOption {
  readonly name: string;
  readonly description: string;
  readonly type: ApplicationCommandOptionType;
  readonly required: boolean;
}

type ReadonlyCommandOptions = readonly CommandOption[];

interface OnlyTwitchCompatible {
  discord: false;
  twitch: true;
}

interface OnlyDiscordCompatible {
  discord: true;
  twitch: false;
}

interface BothCompatible {
  discord: true;
  twitch: true;
}

type CommandCompatibility = BothCompatible | OnlyDiscordCompatible | OnlyTwitchCompatible;
type PickCompatibleContext<GivenCompatibility extends CommandCompatibility, AllowedInDMs extends boolean> = (
  GivenCompatibility extends BothCompatible ? BaseContext : (
    GivenCompatibility extends OnlyDiscordCompatible ? DiscordCommandContext<AllowedInDMs> : (
      GivenCompatibility extends OnlyTwitchCompatible ? TwitchContext : never
    )
  )
);

// Contexted command interaction: ContexedCommandInteraction<GivenOptions>
export interface CommandTemplate<
  GivenCompatibility extends CommandCompatibility = CommandCompatibility,
  GivenOptions extends ReadonlyCommandOptions = ReadonlyCommandOptions,
  AllowedInDMs extends boolean = boolean
> {
  readonly name: string;
  readonly description: string;
  readonly allowInDMs: AllowedInDMs;
  readonly guildPermissions: bigint;
  readonly compatibility: GivenOptions[0] extends undefined ? GivenCompatibility : { discord: true; twitch: false; };
  readonly options: GivenOptions;
  run(
    client: KrakenBot,
    context: PickCompatibleContext<GivenCompatibility, AllowedInDMs>
  ): Promise<unknown>;
}

export interface DiscordCommandTemplate<
  GivenOptions extends ReadonlyCommandOptions = ReadonlyCommandOptions,
  AllowedInDMs extends boolean = boolean
> {
  readonly name: string;
  readonly description: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly dm_permissions: AllowedInDMs;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly default_member_permissions: string;
  readonly options: GivenOptions;
}

export function createCommand<
  GivenCompatibility extends CommandCompatibility,
  GivenOptions extends ReadonlyCommandOptions,
  AllowedInDMs extends boolean
>(
  commandStructure: CommandTemplate<GivenCompatibility, GivenOptions, AllowedInDMs>
): CommandTemplate<GivenCompatibility, GivenOptions, AllowedInDMs> {
  return commandStructure;
}

export function transformToDiscordCommand<
  GivenCompatibility extends CommandCompatibility,
  GivenOptions extends ReadonlyCommandOptions,
  AllowedInDMs extends boolean
>(
  commandStructure: CommandTemplate<GivenCompatibility, GivenOptions, AllowedInDMs>
): DiscordCommandTemplate<GivenOptions, AllowedInDMs> {
  return {
    options: commandStructure.options,
    name: commandStructure.name,
    description: commandStructure.description,
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    dm_permissions: commandStructure.allowInDMs,
    // eslint-disable-next-line @typescript-eslint/naming-convention, camelcase
    default_member_permissions: commandStructure.guildPermissions.toString()
  };
}

export {
  ApplicationCommandOptionType as CommandOptionType,
  PermissionFlagsBits as PermissionFlags
} from "discord-api-types/v9";
