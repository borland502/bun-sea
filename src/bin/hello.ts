import { has, pathAdd } from "@/lib";
import { logger } from "@/lib/logger";

export interface HelloToOptions {
  loud?: boolean;
  logger?: boolean;
}

export async function helloTo(name: string, options?: HelloToOptions): Promise<void> {
  const greeting = `Hello, ${name}!`;
  const message = options?.loud ? greeting.toUpperCase() : greeting;

  if (options?.logger === false) {
    console.log(message);
  } else {
    logger.info(message);
  }
}

export async function hello(): Promise<void> {
  // Using various log levels from the global logger
  logger.info("Hello world from info level!");
  logger.warn("This is a warning message");
  logger.error("This is an error message");
  logger.debug("This is a debug message (may not show with current log level)");

  if (await has("ls")) {
    logger.info("The 'ls' command is available on this system.");
  } else {
    logger.warn("The 'ls' command is not available on this system.");
  }

  if (await has("brew")) {
    logger.info("The 'brew' command is available on this system.");
  } else {
    logger.warn("The 'brew' command is not available on this system.");
  }

  await pathAdd("PATH", "~/.local/bin", "~/bin");

  logger.info(`Path variable: ${process.env.PATH}`);
}
