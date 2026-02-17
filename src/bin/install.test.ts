import { expect, test } from "bun:test";
import { createInstallationScripts } from "@/bin/install";

test("createInstallationScripts() returns install-task script", () => {
  const scripts = Array.from(createInstallationScripts());

  expect(scripts.length).toBe(1);
  expect(scripts[0]?.name).toBe("install-task");
  expect(scripts[0]?.command).toBe("sh");
  expect(scripts[0]?.output).toBe("inherit");
  expect(scripts[0]?.args?.[0]).toBe("-c");
});
