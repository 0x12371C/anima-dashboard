import type { ANIMAConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: ANIMAConfig, pluginId: string): ANIMAConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
