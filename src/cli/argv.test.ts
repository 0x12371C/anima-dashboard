import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "anima", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "anima", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "anima", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "anima", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "anima", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "anima", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "anima", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "anima", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "anima", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "anima", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "anima", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "anima", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "anima"],
      expected: null,
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "anima", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "anima", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "anima", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "anima", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "anima", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "anima", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "anima", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "anima", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "anima", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "anima", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "anima", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "anima", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "anima", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "anima", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "anima", "status"],
        expected: ["node", "anima", "status"],
      },
      {
        rawArgs: ["node-22", "anima", "status"],
        expected: ["node-22", "anima", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "anima", "status"],
        expected: ["node-22.2.0.exe", "anima", "status"],
      },
      {
        rawArgs: ["node-22.2", "anima", "status"],
        expected: ["node-22.2", "anima", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "anima", "status"],
        expected: ["node-22.2.exe", "anima", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "anima", "status"],
        expected: ["/usr/bin/node-22.2.0", "anima", "status"],
      },
      {
        rawArgs: ["nodejs", "anima", "status"],
        expected: ["nodejs", "anima", "status"],
      },
      {
        rawArgs: ["node-dev", "anima", "status"],
        expected: ["node", "anima", "node-dev", "anima", "status"],
      },
      {
        rawArgs: ["anima", "status"],
        expected: ["node", "anima", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "anima",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "anima",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "anima", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "anima", "status"],
      ["node", "anima", "health"],
      ["node", "anima", "sessions"],
      ["node", "anima", "config", "get", "update"],
      ["node", "anima", "config", "unset", "update"],
      ["node", "anima", "models", "list"],
      ["node", "anima", "models", "status"],
      ["node", "anima", "memory", "status"],
      ["node", "anima", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "anima", "agents", "list"],
      ["node", "anima", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
