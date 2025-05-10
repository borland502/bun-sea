import config from "config";

export interface AppConfig {
  name: string;
  version: string;
  description: string;
}

export interface CommandConfig {
  name: string;
  description: string;
  module?: string;
  subcommands?: boolean;
  children?: CommandConfig[];
}

export interface Config {
  app: AppConfig;
  commands: CommandConfig[];
}

// Load and validate the configuration
export function loadConfig(): Config {
  try {
    const appConfig = config.get<AppConfig>("app");
    const commands = config.get<CommandConfig[]>("commands");

    return {
      app: appConfig,
      commands: commands,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load configuration: ${error.message}`);
    }
    // Provide reasonable defaults
    return {
      app: {
        name: "bun-sea",
        version: "0.1.1",
        description: "Bun Single Executable Application",
      },
      commands: [],
    };
  }
}

// Export a singleton instance
export const appConfig = loadConfig();
