import { expect, test } from "bun:test";
import { createProgram } from "@/main";
import type { Config } from "@/types/config";

function createBaseConfig(): Config {
  return {
    app: {
      name: "test-cli",
      description: "Test CLI",
      version: "1.0.0",
    },
    commands: [
      {
        name: "hello",
        description: "Hello command",
        commands: [
          {
            name: "to",
            description: "Say hello to someone",
            arguments: [
              {
                name: "name",
                description: "The person to greet",
                required: true,
              },
            ],
            options: [
              {
                flags: "-l, --loud",
                description: "Greet in uppercase",
                defaultValue: false,
              },
            ],
          },
        ],
      },
      {
        name: "install",
        description: "Install tools",
        commands: [
          {
            name: "task",
            description: "Install task",
          },
        ],
      },
    ],
  };
}

test("createProgram() registers known commands and subcommands", () => {
  const program = createProgram(createBaseConfig());

  const rootCommandNames = program.commands.map((cmd) => cmd.name());
  expect(rootCommandNames).toContain("hello");
  expect(rootCommandNames).toContain("install");

  const helloCommand = program.commands.find((cmd) => cmd.name() === "hello");
  expect(helloCommand).toBeDefined();
  expect(helloCommand?.commands.map((cmd) => cmd.name())).toContain("to");

  const toCommand = helloCommand?.commands.find((cmd) => cmd.name() === "to");
  expect(toCommand).toBeDefined();
  expect(toCommand?.registeredArguments.length).toBe(1);
  expect(toCommand?.registeredArguments[0]?.name()).toBe("name");
  expect(toCommand?.registeredArguments[0]?.required).toBe(true);

  const installCommand = program.commands.find((cmd) => cmd.name() === "install");
  expect(installCommand).toBeDefined();
  expect(installCommand?.commands.map((cmd) => cmd.name())).toContain("task");
});

test("createProgram() registers options on commands", () => {
  const program = createProgram(createBaseConfig());

  const helloCommand = program.commands.find((cmd) => cmd.name() === "hello");
  const toCommand = helloCommand?.commands.find((cmd) => cmd.name() === "to");
  expect(toCommand).toBeDefined();

  const loudOpt = toCommand?.options.find((o) => o.long === "--loud");
  expect(loudOpt).toBeDefined();
  expect(loudOpt?.short).toBe("-l");
  expect(loudOpt?.description).toBe("Greet in uppercase");
});

test("createProgram() registers arguments at any command level", () => {
  const config: Config = {
    app: {
      name: "test-cli",
      description: "Test CLI",
      version: "1.0.0",
    },
    commands: [
      {
        name: "greet",
        description: "Greet someone",
        arguments: [{ name: "who", description: "Person to greet", required: true }],
        options: [{ flags: "-s, --shout", description: "Shout the greeting" }],
        commands: [
          {
            name: "formally",
            description: "Formal greeting",
            arguments: [{ name: "title", description: "Honorific", required: false }],
          },
        ],
      },
    ],
  };

  const program = createProgram(config);

  const greetCmd = program.commands.find((c) => c.name() === "greet");
  expect(greetCmd).toBeDefined();
  expect(greetCmd?.registeredArguments[0]?.name()).toBe("who");
  expect(greetCmd?.registeredArguments[0]?.required).toBe(true);
  expect(greetCmd?.options.find((o) => o.long === "--shout")).toBeDefined();

  const formallyCmd = greetCmd?.commands.find((c) => c.name() === "formally");
  expect(formallyCmd).toBeDefined();
  expect(formallyCmd?.registeredArguments[0]?.name()).toBe("title");
  expect(formallyCmd?.registeredArguments[0]?.required).toBe(false);
});

test("createProgram() registers options at any command level", () => {
  const config: Config = {
    app: {
      name: "test-cli",
      description: "Test CLI",
      version: "1.0.0",
    },
    commands: [
      {
        name: "deploy",
        description: "Deploy the app",
        options: [{ flags: "-e, --env <environment>", description: "Target env", required: true }],
        commands: [
          {
            name: "preview",
            description: "Preview deploy",
            options: [{ flags: "--dry-run", description: "Simulate only" }],
          },
        ],
      },
    ],
  };

  const program = createProgram(config);

  const deployCmd = program.commands.find((c) => c.name() === "deploy");
  expect(deployCmd).toBeDefined();

  const envOpt = deployCmd?.options.find((o) => o.long === "--env");
  expect(envOpt).toBeDefined();
  expect(envOpt?.mandatory).toBe(true);

  const previewCmd = deployCmd?.commands.find((c) => c.name() === "preview");
  expect(previewCmd).toBeDefined();
  expect(previewCmd?.options.find((o) => o.long === "--dry-run")).toBeDefined();
});
