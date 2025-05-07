import { expect, test } from "bun:test";
import { has } from "@/lib";

test("works with real commands", async () => {
  // Using actual commands that should exist on most systems
  expect(await has("ls")).toBe(true);
  expect(await has("echo")).toBe(true);

  // This command likely doesn't exist
  expect(await has("command-that-does-not-exist-123")).toBe(false);
});
