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
  const originalInfo = logger.info.bind(logger);
  let loggedMessage = "";
  logger.info = ((msg: string) => {
    loggedMessage = msg;
    return logger;
  }) as typeof logger.info;

  await helloTo("Alice");

  expect(loggedMessage).toBe("Hello, Alice!");
  logger.info = originalInfo;
});

test("helloTo() greets in uppercase when loud option is set", async () => {
  const originalInfo = logger.info.bind(logger);
  let loggedMessage = "";
  logger.info = ((msg: string) => {
    loggedMessage = msg;
    return logger;
  }) as typeof logger.info;

  await helloTo("Bob", { loud: true });

  expect(loggedMessage).toBe("HELLO, BOB!");
  logger.info = originalInfo;
});

test("helloTo() uses console.log when logger option is false", async () => {
  const originalLog = console.log;
  let consoleMessage = "";
  console.log = (msg: string) => {
    consoleMessage = msg;
  };

  const originalInfo = logger.info.bind(logger);
  let loggerCalled = false;
  logger.info = (() => {
    loggerCalled = true;
    return logger;
  }) as typeof logger.info;

  await helloTo("Carol", { logger: false });

  expect(consoleMessage).toBe("Hello, Carol!");
  expect(loggerCalled).toBe(false);

  console.log = originalLog;
  logger.info = originalInfo;
});
