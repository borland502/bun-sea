import { afterEach, expect, test } from "bun:test";
import config from "config";
import { loadConfig } from "@/lib/config";

const originalGet = config.get.bind(config);

afterEach(() => {
  (config as { get: typeof config.get }).get = originalGet;
});

test("loadConfig() loads configured app and commands", () => {
  const result = loadConfig();

  expect(result.app.name).toBeDefined();
  expect(result.app.version).toBeDefined();
  expect(Array.isArray(result.commands)).toBe(true);
});

test("loadConfig() returns defaults when config throws", () => {
  (config as { get: typeof config.get }).get = (() => {
    throw new Error("boom");
  }) as typeof config.get;

  const result = loadConfig();

  expect(result.app.name).toBe("bun-sea");
  expect(result.app.version).toBe("0.1.1");
  expect(result.commands).toEqual([]);
});
