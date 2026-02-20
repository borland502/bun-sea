import type { CommandOptions } from "commander";

/**
 * Application metadata loaded from the `[app]` section.
 */
export interface AppConfig {
  /** Display name used in CLI registration. */
  name: string;
  /** Human-readable description shown in help output. */
  description: string;
  /** Semantic version string for the CLI application. */
  version: string;
}

/**
 * Positional argument definition, modeled after Commander's `Argument` class.
 *
 * @see {@link https://github.com/tj/commander.js/blob/master/typings/index.d.ts | Commander Argument}
 */
export interface ArgumentDefinition {
  /**
   * Argument name. Use angle brackets for required (`<name>`) or square
   * brackets for optional (`[name]`) when registering with Commander.
   * The bare name stored here is wrapped automatically at registration time.
   */
  name: string;
  /** Human-readable description shown in help output. */
  description?: string;
  /** Whether the argument is required (default: `true`). */
  required?: boolean;
  /** Whether the argument accepts multiple values (variadic). */
  variadic?: boolean;
  /** Default value when the argument is not provided. */
  defaultValue?: string;
}

/**
 * Option / flag definition, modeled after Commander's `Option` class.
 *
 * @see {@link https://github.com/tj/commander.js/blob/master/typings/index.d.ts | Commander Option}
 */
export interface OptionDefinition {
  /**
   * Flag string passed to Commander's `.option()` / `.requiredOption()`.
   * Follows Commander's flag syntax, e.g. `"-l, --loud"`, `"-o, --out <path>"`.
   */
  flags: string;
  /** Human-readable description shown in help output. */
  description?: string;
  /** Default value when the option is not provided. */
  defaultValue?: string | boolean;
  /** Whether Commander should treat this as a required option. */
  required?: boolean;
}

/**
 * Command definition loaded from config, modeled after Commander's Command class
 * and extended with Commander's {@link CommandOptions} for native option support.
 *
 * Arguments and options can be declared at **any** level of the command tree.
 *
 * BREAKING CHANGE: The `subcommands` boolean discriminator has been removed.
 * Subcommand presence is now inferred from the `commands` array.
 *
 * BREAKING CHANGE: The `children` property has been renamed to `commands`
 * to align with Commander's `Command.commands` property.
 *
 * BREAKING CHANGE: The discriminated union types `CommandWithSubcommands` and
 * `CommandWithoutSubcommands` have been replaced by this single interface.
 */
export interface CommandDefinition extends CommandOptions {
  /** Command name, corresponds to Commander's `Command.name()`. */
  name: string;
  /** Human-readable description, corresponds to Commander's `Command.description()`. */
  description: string;
  /** Positional argument definitions, mirrors Commander's `Command.argument()`. */
  arguments?: ArgumentDefinition[];
  /** Option / flag definitions, mirrors Commander's `Command.option()`. */
  options?: OptionDefinition[];
  /** Nested subcommand definitions, mirrors Commander's `Command.commands`. */
  commands?: CommandDefinition[];
}

/**
 * Root configuration object returned by the config loader.
 */
export interface Config {
  /** Top-level application metadata. */
  app: AppConfig;
  /** Ordered command definitions used to register the CLI. */
  commands: CommandDefinition[];
}

// ---------------------------------------------------------------------------
// Backward-compatibility aliases (deprecated)
// ---------------------------------------------------------------------------

/** @deprecated Use {@link CommandDefinition} instead. */
export type Command = CommandDefinition;

/** @deprecated Use {@link CommandDefinition} instead. */
export type CommandConfig = CommandDefinition;
