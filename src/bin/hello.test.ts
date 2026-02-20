import { afterEach, expect, test } from "bun:test";
import { hello, helloTo } from "@/bin/hello";
import { logger } from "@/lib/logger";

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

test("helloTo() greets the provided name", async () => {
  const originalInfo = logger.info;
  let loggedMessage = "";
  logger.info = (msg: string) => {
    loggedMessage = msg;
  };

  await helloTo("Alice");

  expect(loggedMessage).toBe("Hello, Alice!");
  logger.info = originalInfo;
});

test("helloTo() greets in uppercase when loud option is set", async () => {
  const originalInfo = logger.info;
  let loggedMessage = "";
  logger.info = (msg: string) => {
    loggedMessage = msg;
  };

  await helloTo("Bob", { loud: true });

  expect(loggedMessage).toBe("HELLO, BOB!");
  logger.info = originalInfo;
});

test("helloTo() uses console.info when logger option is false", async () => {
  const originalConsole = console.info;
  let consoleMessage = "";
  console.info = (msg: string) => {
    consoleMessage = msg;
  };

  const originalInfo = logger.info;
  let loggerCalled = false;
  logger.info = () => {
    loggerCalled = true;
  };

  await helloTo("Carol", { logger: false });

  expect(consoleMessage).toBe("Hello, Carol!");
  expect(loggerCalled).toBe(false);

  console.info = originalConsole;
  logger.info = originalInfo;
});
