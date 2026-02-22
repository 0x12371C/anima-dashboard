import type { ANIMAConfig } from "../config/config.js";

export function applyOnboardingLocalWorkspaceConfig(
  baseConfig: ANIMAConfig,
  workspaceDir: string,
): ANIMAConfig {
  return {
    ...baseConfig,
    agents: {
      ...baseConfig.agents,
      defaults: {
        ...baseConfig.agents?.defaults,
        workspace: workspaceDir,
      },
    },
    gateway: {
      ...baseConfig.gateway,
      mode: "local",
    },
  };
}
