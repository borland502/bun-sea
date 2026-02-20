import config from "config";
import type { Config, AppConfig, Command } from "@/types/config";
import { logger } from "@/lib/logger";

// Load and validate the configuration
export function loadConfig(): Config {
  try {
    const appConfig = config.get<AppConfig>("app");
    const commands = config.get<Command[]>("commands");

    return {
      app: appConfig,
      commands: commands,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load configuration: ${error.message}`);
    }

    process.exit(1);
  }
}

// Export a singleton instance
export const appConfig = loadConfig();
