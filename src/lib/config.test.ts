import { afterEach, beforeEach, expect, test } from "bun:test";
import { resolve } from "path";
import { mkdirSync, rmSync } from "fs";
import { loadConfig } from "@/lib/config";
import { logger } from "@/lib/logger";

const originalExit = process.exit;
const originalError = logger.error;
const tmpDir = resolve("tmp-test-config");
const tmpFile = resolve(tmpDir, "test.toml");

beforeEach(() => {
  mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  process.exit = originalExit;
  logger.error = originalError;
  rmSync(tmpDir, { recursive: true, force: true });
});

test("loadConfig() loads and parses the default config file", async () => {
  const result = await loadConfig();

  expect(result.app.name).toBeDefined();
  expect(result.app.version).toBeDefined();
  expect(Array.isArray(result.commands)).toBe(true);
});

test("loadConfig() loads a config file from a custom path", async () => {
  const toml = `
[app]
name = "test-app"
description = "A test"
version = "0.0.1"

[[commands]]
name = "ping"
description = "Ping command"
`;
  await Bun.write(tmpFile, toml);

  const result = await loadConfig(tmpFile);

  expect(result.app.name).toBe("test-app");
  expect(result.app.version).toBe("0.0.1");
  expect(result.commands[0]?.name).toBe("ping");
});

test("loadConfig() logs and exits when config file is missing", async () => {
  let loggedMessage = "";
  let exitCode: number | undefined;

  logger.error = (message: string) => {
    loggedMessage = message;
  };

  process.exit = ((code?: number) => {
    exitCode = code;
    throw new Error("EXIT_CALLED");
  }) as typeof process.exit;

  await expect(loadConfig("/tmp/nonexistent.toml")).rejects.toThrow("EXIT_CALLED");
  expect(loggedMessage).toContain("Failed to load configuration");
  expect(exitCode).toBe(1);
});

test("loadConfig() logs and exits when config file contains invalid TOML", async () => {
  await Bun.write(tmpFile, "[invalid toml {{{");

  let loggedMessage = "";
  let exitCode: number | undefined;

  logger.error = (message: string) => {
    loggedMessage = message;
  };

  process.exit = ((code?: number) => {
    exitCode = code;
    throw new Error("EXIT_CALLED");
  }) as typeof process.exit;

  await expect(loadConfig(tmpFile)).rejects.toThrow("EXIT_CALLED");
  expect(loggedMessage).toContain("Failed to load configuration");
  expect(exitCode).toBe(1);
});
