import { logger } from "@/lib/logger";

export interface InstallScript {
  name: string;
  description: string;
  command: string;
  args?: string[];
  env?: NodeJS.ProcessEnv;
  output?: "inherit" | "pipe";
}

/**
 * Creates a set of installation scripts based on application configuration
 *
 * @param appConfig The application configuration
 * @returns A set of Script objects for various installation tasks
 */
export function createInstallationScripts(): Set<InstallScript> {
  return new Set([
    {
      name: "install-task",
      description: "Download and install Task",
      command: "sh",
      args: ["-c", "curl -fsSL https://taskfile.dev/install.sh | sh -s -- -d"],
      env: { ...Bun.env },
      output: "inherit",
    },
  ]);
}

/**
 * Downloads and installs Task using the predefined script
 */
export async function downloadAndInstallTask(): Promise<void> {
  const taskScript = Array.from(createInstallationScripts()).find((script) => script.name === "install-task");

  if (!taskScript) {
    throw new Error("Task installation script not found");
  }

  logger.info(`Starting: ${taskScript.description}`);

  try {
    const proc = Bun.spawn({
      cmd: [taskScript.command, ...(taskScript.args || [])],
      env: taskScript.env,
      stdout: taskScript.output === "inherit" ? "inherit" : "pipe",
      stderr: taskScript.output === "inherit" ? "inherit" : "pipe",
    });

    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      throw new Error(`Task installation failed with exit code ${exitCode}`);
    }

    logger.info("Task installed successfully");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Installation error: ${error.message}`);
    } else {
      logger.error(`Installation error: ${String(error)}`);
    }
    throw error;
  }
}
