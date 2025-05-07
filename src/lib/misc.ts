import { $ } from "bun";

/**
 * Determines whether a given command is available in the system's PATH.
 *
 * @param command - The name of the command to check for
 * @returns `true` if the command exists and is accessible, `false` otherwise
 *
 * @example
 * ```typescript
 * // Check if 'git' is installed
 * if (has('git')) {
 *   // Execute git commands...
 * }
 * ```
 */
export async function has(command: string): Promise<boolean> {
  try {
    const result = await $`which ${command}`.quiet();
    logger.debug(`Command "${command}" has result with exit code ${result.exitCode}.`);
    return result.exitCode === 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    logger.debug(`Command "${command}" not found in PATH.`);
    return false;
  }
}
