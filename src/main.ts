import "@/globals";

import { downloadAndInstallTask } from "@/bin/install";
import { Command } from "commander";
import { hello } from "@/index";
import { has } from "@/lib";
import { appConfig } from "@/lib/config";
import type { Config } from "@/types/config";

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

function registerCommands(program: Command, config: Config): void {
  config.commands.forEach((cmd) => {
    switch (cmd.name) {
      case "hello": {
        program.command(cmd.name).description(cmd.description).action(handleHelloAction);
        break;
      }
      case "install": {
        const parentCommand = program.command(cmd.name).description(cmd.description);

        cmd.children?.forEach((subCmd) => {
          const command = parentCommand.command(subCmd.name).description(subCmd.description);

          switch (subCmd.name) {
            case "task": {
              command.action(handleInstallTaskAction);
              break;
            }
            default: {
              const message = `Unknown subcommand: ${subCmd.name}`;
              logger.error(message);
              throw new Error(message);
            }
          }
        });

        break;
      }
      default: {
        const message = `Unknown command: ${cmd.name}`;
        logger.error(message);
        throw new Error(message);
      }
    }
  });
}

export function createProgram(config: Config = appConfig): Command {
  const program = new Command();

  program.name(config.app.name).description(config.app.description).version(config.app.version);
  registerCommands(program, config);

  return program;
}

export const program = createProgram();

if (import.meta.main) {
  program.parse(process.argv);
}
