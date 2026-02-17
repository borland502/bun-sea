/**
 * Shared shape for named configuration entries.
 */
interface ConfigItem {
  /** Display name used in CLI registration. */
  name: string;
  /** Human-readable description shown in help output. */
  description: string;
}

/**
 * Application metadata loaded from the `[app]` section.
 */
export interface AppConfig extends ConfigItem {
  /** Semantic version string for the CLI application. */
  version: string;
}

/**
 * Base command definition loaded from `[[commands]]` and `[[commands.children]]`.
 */
export interface CommandConfig extends ConfigItem {
  /** Indicates whether this command contains nested subcommands. */
  subcommands: boolean;
  /** Nested command definitions when `subcommands` is enabled. */
  children?: CommandConfig[];
}

/**
 * Command variant that requires nested subcommands.
 */
export interface CommandWithSubcommands extends CommandConfig {
  subcommands: true;
  children: CommandConfig[];
}

/**
 * Command variant without nested subcommands.
 */
export interface CommandWithoutSubcommands extends CommandConfig {
  subcommands: false;
  children?: never;
}

/**
 * Discriminated union for all supported command shapes.
 */
export type Command = CommandWithSubcommands | CommandWithoutSubcommands;

/**
 * Root configuration object returned by the config loader.
 */
export interface Config {
  /** Top-level application metadata. */
  app: AppConfig;
  /** Ordered command definitions used to register the CLI. */
  commands: Command[];
}
