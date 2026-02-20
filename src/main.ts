import "@/globals";

import { downloadAndInstallTask } from "@/bin/install";
import { helloTo } from "@/bin/hello";
import { Command } from "commander";
import { hello } from "@/index";
import { has } from "@/lib";
import { appConfig } from "@/lib/config";
import type { Config, CommandDefinition, ArgumentDefinition, OptionDefinition } from "@/types/config";

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

async function handleHelloAction(): Promise<void> {
  await hello();
}

async function handleInstallTaskAction(): Promise<void> {
  try {
    if (await has("task")) {
      logger.info("Task is already installed");
      return;
    }

    await downloadAndInstallTask();
    logger.info("Task installation complete");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    } else {
      logger.error(`Error: ${String(error)}`);
    }
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Action registry — maps "parent/child" command paths to action handlers.
// Any command whose fully-qualified name is NOT in this map will be
// registered without an action (it may still serve as a parent for
// subcommands).
// ---------------------------------------------------------------------------

type ActionHandler = (...args: any[]) => void | Promise<void>;

const actionRegistry = new Map<string, ActionHandler>([
  ["hello", handleHelloAction],
  [
    "hello/to",
    (name: string, opts: Record<string, unknown>) => helloTo(name, opts as { loud?: boolean; logger?: boolean }),
  ],
  ["install/task", handleInstallTaskAction],
]);

// ---------------------------------------------------------------------------
// Generic registration helpers
// ---------------------------------------------------------------------------

/**
 * Register positional arguments from config onto a Commander command.
 */
function registerArguments(command: Command, args?: ArgumentDefinition[]): void {
  if (!args) return;
  for (const arg of args) {
    const required = arg.required !== false;
    const syntax = required ? `<${arg.name}>` : `[${arg.name}]`;
    command.argument(syntax, arg.description ?? "", arg.defaultValue);
  }
}

/**
 * Register options / flags from config onto a Commander command.
 */
function registerOptions(command: Command, opts?: OptionDefinition[]): void {
  if (!opts) return;
  for (const opt of opts) {
    if (opt.required) {
      command.requiredOption(opt.flags, opt.description ?? "", opt.defaultValue as string);
    } else {
      command.option(opt.flags, opt.description ?? "", opt.defaultValue as string);
    }
  }
}

/**
 * Recursively register a command tree. Arguments and options are attached at
 * every level. An action is attached only when the command's fully-qualified
 * path (e.g. "install/task") exists in {@link actionRegistry}.
 *
 * @param parent   The Commander command to attach children to.
 * @param defs     Array of {@link CommandDefinition} for this level.
 * @param prefix   Slash-delimited path prefix used for action-registry lookup.
 */
function registerCommandTree(parent: Command, defs: CommandDefinition[], prefix = ""): void {
  for (const def of defs) {
    const cmd = parent.command(def.name).description(def.description);

    registerArguments(cmd, def.arguments);
    registerOptions(cmd, def.options);

    const path = prefix ? `${prefix}/${def.name}` : def.name;
    const action = actionRegistry.get(path);
    if (action) {
      cmd.action(action);
    }

    if (def.commands) {
      registerCommandTree(cmd, def.commands, path);
    }
  }
}

export function createProgram(config: Config = appConfig): Command {
  const program = new Command();

  program.name(config.app.name).description(config.app.description).version(config.app.version);
  registerCommandTree(program, config.commands);

  return program;
}

export const program = createProgram();

if (import.meta.main) {
  program.parse(process.argv);
}
