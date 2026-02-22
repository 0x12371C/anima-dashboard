import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  resolveDefaultConfigCandidates,
  resolveConfigPathCandidate,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers ANIMA_OAUTH_DIR over ANIMA_STATE_DIR", () => {
    const env = {
      ANIMA_OAUTH_DIR: "/custom/oauth",
      ANIMA_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from ANIMA_STATE_DIR when unset", () => {
    const env = {
      ANIMA_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  async function withTempRoot(prefix: string, run: (root: string) => Promise<void>): Promise<void> {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    try {
      await run(root);
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  }

  function expectANIMAHomeDefaults(env: NodeJS.ProcessEnv): void {
    const configuredHome = env.ANIMA_HOME;
    if (!configuredHome) {
      throw new Error("ANIMA_HOME must be set for this assertion helper");
    }
    const resolvedHome = path.resolve(configuredHome);
    expect(resolveStateDir(env)).toBe(path.join(resolvedHome, ".anima"));

    const candidates = resolveDefaultConfigCandidates(env);
    expect(candidates[0]).toBe(path.join(resolvedHome, ".anima", "anima.json"));
  }

  it("uses ANIMA_STATE_DIR when set", () => {
    const env = {
      ANIMA_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("uses ANIMA_HOME for default state/config locations", () => {
    const env = {
      ANIMA_HOME: "/srv/anima-home",
    } as NodeJS.ProcessEnv;
    expectANIMAHomeDefaults(env);
  });

  it("prefers ANIMA_HOME over HOME for default state/config locations", () => {
    const env = {
      ANIMA_HOME: "/srv/anima-home",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv;
    expectANIMAHomeDefaults(env);
  });

  it("orders default config candidates in a stable order", () => {
    const home = "/home/test";
    const resolvedHome = path.resolve(home);
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    const expected = [
      path.join(resolvedHome, ".anima", "anima.json"),
      path.join(resolvedHome, ".anima", "animabot.json"),
      path.join(resolvedHome, ".anima", "moldbot.json"),
      path.join(resolvedHome, ".anima", "animabot.json"),
      path.join(resolvedHome, ".animabot", "anima.json"),
      path.join(resolvedHome, ".animabot", "animabot.json"),
      path.join(resolvedHome, ".animabot", "moldbot.json"),
      path.join(resolvedHome, ".animabot", "animabot.json"),
      path.join(resolvedHome, ".moldbot", "anima.json"),
      path.join(resolvedHome, ".moldbot", "animabot.json"),
      path.join(resolvedHome, ".moldbot", "moldbot.json"),
      path.join(resolvedHome, ".moldbot", "animabot.json"),
      path.join(resolvedHome, ".animabot", "anima.json"),
      path.join(resolvedHome, ".animabot", "animabot.json"),
      path.join(resolvedHome, ".animabot", "moldbot.json"),
      path.join(resolvedHome, ".animabot", "animabot.json"),
    ];
    expect(candidates).toEqual(expected);
  });

  it("prefers ~/.anima when it exists and legacy dir is missing", async () => {
    await withTempRoot("anima-state-", async (root) => {
      const newDir = path.join(root, ".anima");
      await fs.mkdir(newDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("falls back to existing legacy state dir when ~/.anima is missing", async () => {
    await withTempRoot("anima-state-legacy-", async (root) => {
      const legacyDir = path.join(root, ".animabot");
      await fs.mkdir(legacyDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyDir);
    });
  });

  it("CONFIG_PATH prefers existing config when present", async () => {
    await withTempRoot("anima-config-", async (root) => {
      const legacyDir = path.join(root, ".anima");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyPath = path.join(legacyDir, "anima.json");
      await fs.writeFile(legacyPath, "{}", "utf-8");

      const resolved = resolveConfigPathCandidate({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyPath);
    });
  });

  it("respects state dir overrides when config is missing", async () => {
    await withTempRoot("anima-config-override-", async (root) => {
      const legacyDir = path.join(root, ".anima");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyConfig = path.join(legacyDir, "anima.json");
      await fs.writeFile(legacyConfig, "{}", "utf-8");

      const overrideDir = path.join(root, "override");
      const env = { ANIMA_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "anima.json"));
    });
  });
});
