import { afterEach, expect, test } from "bun:test";
import config from "config";
import { loadConfig } from "@/lib/config";
import { logger } from "@/lib/logger";

const originalGet = config.get.bind(config);
const originalExit = process.exit;
const originalError = logger.error.bind(logger);

afterEach(() => {
  (config as { get: typeof config.get }).get = originalGet;
  process.exit = originalExit;
  logger.error = originalError;
});

test("loadConfig() loads configured app and commands", () => {
  const result = loadConfig();

  expect(result.app.name).toBeDefined();
  expect(result.app.version).toBeDefined();
  expect(Array.isArray(result.commands)).toBe(true);
});

test("loadConfig() logs and exits when config load fails", () => {
  (config as { get: typeof config.get }).get = (() => {
    throw new Error("boom");
  }) as typeof config.get;

  let loggedMessage = "";
  let exitCode: number | undefined;

  logger.error = ((message: string) => {
    loggedMessage = message;
    return logger;
  }) as typeof logger.error;

  process.exit = ((code?: number) => {
    exitCode = code;
    throw new Error("EXIT_CALLED");
  }) as typeof process.exit;

  expect(() => loadConfig()).toThrow("EXIT_CALLED");
  expect(loggedMessage).toBe("Failed to load configuration: boom");
  expect(exitCode).toBe(1);
});
