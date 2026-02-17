import { afterEach, expect, test } from "bun:test";
import { hello } from "@/bin/hello";

let originalPath = process.env.PATH;

afterEach(() => {
  process.env.PATH = originalPath;
});

test("hello() updates PATH with expected entries", async () => {
  originalPath = process.env.PATH;
  process.env.PATH = "/usr/bin:/bin";
  process.env.HOME = "/tmp/test-home";

  await hello();

  expect(process.env.PATH).toContain("/tmp/test-home/.local/bin");
  expect(process.env.PATH).toContain("/tmp/test-home/bin");
  expect(process.env.PATH).toContain("/usr/bin:/bin");
});
