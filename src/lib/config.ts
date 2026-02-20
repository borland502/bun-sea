import { resolve } from "path";
import type { Config } from "@/types/config";
import { logger } from "@/lib/logger";

/** Default config path, resolved from CWD. Override via CONFIG_PATH env var. */
const DEFAULT_CONFIG_PATH = "config/default.toml";

/**
 * Load and parse the TOML configuration file.
 *
 * Resolution order for the config file path:
 * 1. `CONFIG_PATH` environment variable (absolute or relative to CWD)
 * 2. `config/default.toml` relative to CWD
 */
export async function loadConfig(configPath?: string): Promise<Config> {
  const filePath = configPath ?? Bun.env.CONFIG_PATH ?? DEFAULT_CONFIG_PATH;

  try {
    const raw = await Bun.file(resolve(filePath)).text();
    const parsed = Bun.TOML.parse(raw) as unknown as Config;

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load configuration: ${error.message}`);
    }

    process.exit(1);
  }
}

// Export a singleton instance (top-level await)
export const appConfig = await loadConfig();
