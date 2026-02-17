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
        subcommands: false,
      },
      {
        name: "install",
        description: "Install tools",
        subcommands: true,
        children: [
          {
            name: "task",
            description: "Install task",
            subcommands: false,
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

  const installCommand = program.commands.find((cmd) => cmd.name() === "install");
  expect(installCommand).toBeDefined();
  expect(installCommand?.commands.map((cmd) => cmd.name())).toContain("task");
});

test("createProgram() throws on unknown command", () => {
  const config: Config = {
    app: {
      name: "test-cli",
      description: "Test CLI",
      version: "1.0.0",
    },
    commands: [
      {
        name: "unknown",
        description: "Unknown command",
        subcommands: false,
      },
    ],
  };

  expect(() => createProgram(config)).toThrow("Unknown command: unknown");
});

test("createProgram() throws on unknown subcommand", () => {
  const config: Config = {
    app: {
      name: "test-cli",
      description: "Test CLI",
      version: "1.0.0",
    },
    commands: [
      {
        name: "install",
        description: "Install tools",
        subcommands: true,
        children: [
          {
            name: "unknown-sub",
            description: "Unknown subcommand",
            subcommands: false,
          },
        ],
      },
    ],
  };

  expect(() => createProgram(config)).toThrow("Unknown subcommand: unknown-sub");
});
