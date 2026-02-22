import type { ANIMAPluginApi } from "anima/plugin-sdk";
import { emptyPluginConfigSchema } from "anima/plugin-sdk";
import { createDiagnosticsOtelService } from "./src/service.js";

const plugin = {
  id: "diagnostics-otel",
  name: "Diagnostics OpenTelemetry",
  description: "Export diagnostics events to OpenTelemetry",
  configSchema: emptyPluginConfigSchema(),
  register(api: ANIMAPluginApi) {
    api.registerService(createDiagnosticsOtelService());
  },
};

export default plugin;
