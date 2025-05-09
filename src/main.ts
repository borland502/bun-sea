import "@/globals";

// Add this to main.ts
import { downloadAndInstallTask, isTaskInstalled } from "@/bin/download.ts";
import { Command } from "commander";
import { hello } from "@/index";

export const program = new Command();

program.name("bun-sea").description("A CLI template for bootstrapping Bun applications.").version("0.0.1");

program
  .command("hello")
  .description("Hello world command")
  .action(async () => {
    await hello();
  });

// Create download command
const downloadCommand = program.command("download").description("Download and install tools");

// Add task subcommand
downloadCommand
  .command("task")
  .description("Download and install Task from taskfile.dev")
  .action(async () => {
    try {
      if (await isTaskInstalled()) {
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
  });

program.parse(process.argv);
