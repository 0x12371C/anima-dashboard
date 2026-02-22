/**
 * ANIMA Autonomy — Self-Managing Agent Runtime
 *
 * Phase 6: Agent autonomy capabilities.
 *
 * - Self-update (pull latest ANIMA, restart)
 * - Auto-restart on crash
 * - Health monitoring + alerting
 * - Strategy rotation based on Bloodsworn score
 * - Child agent spawning
 * - Parent-child communication protocol
 */

import { VeilChain } from "./chain.js";
import { VeilBloodsworn, type BloodswornTier } from "./bloodsworn.js";
import { VeilMarkets } from "./markets.js";
import { VeilInfra, type InfraInstance } from "./infra.js";
import { AuditLog } from "./security.js";

// --- Health Monitoring ---

export interface HealthStatus {
  overall: "healthy" | "degraded" | "critical";
  checks: HealthCheck[];
  timestamp: string;
}

export interface HealthCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  latencyMs?: number;
}

export class HealthMonitor {
  private chain: VeilChain;
  private audit: AuditLog;
  private checks: (() => Promise<HealthCheck>)[] = [];

  constructor(chain: VeilChain) {
    this.chain = chain;
    this.audit = new AuditLog();
    this.registerDefaultChecks();
  }

  private registerDefaultChecks(): void {
    // Chain connectivity
    this.checks.push(async () => {
      const start = Date.now();
      try {
        await this.chain.getHeight();
        return {
          name: "chain_connectivity",
          status: "pass",
          message: "VeilVM RPC reachable",
          latencyMs: Date.now() - start,
        };
      } catch (e) {
        return {
          name: "chain_connectivity",
          status: "fail",
          message: `Chain unreachable: ${e}`,
          latencyMs: Date.now() - start,
        };
      }
    });

    // Wallet exists
    this.checks.push(async () => {
      const { walletExists } = await import("./wallet.js");
      return {
        name: "wallet_exists",
        status: walletExists() ? "pass" : "fail",
        message: walletExists() ? "Wallet present" : "No wallet found",
      };
    });
  }

  /** Add a custom health check */
  addCheck(check: () => Promise<HealthCheck>): void {
    this.checks.push(check);
  }

  /** Run all health checks */
  async check(): Promise<HealthStatus> {
    const results = await Promise.all(this.checks.map((c) => c()));
    const hasFail = results.some((r) => r.status === "fail");
    const hasWarn = results.some((r) => r.status === "warn");

    const status: HealthStatus = {
      overall: hasFail ? "critical" : hasWarn ? "degraded" : "healthy",
      checks: results,
      timestamp: new Date().toISOString(),
    };

    this.audit.log({
      action: "health_check",
      success: !hasFail,
      details: `${status.overall}: ${results.length} checks`,
    });

    return status;
  }
}

// --- Strategy Engine ---

export interface TradingStrategy {
  id: string;
  name: string;
  minTier: BloodswornTier;
  description: string;
  enabled: boolean;
}

const DEFAULT_STRATEGIES: TradingStrategy[] = [
  {
    id: "conservative",
    name: "Conservative",
    minTier: "unsworn",
    description: "Small positions on high-confidence markets only",
    enabled: true,
  },
  {
    id: "balanced",
    name: "Balanced",
    minTier: "initiate",
    description: "Diversified positions across multiple markets",
    enabled: false,
  },
  {
    id: "aggressive",
    name: "Aggressive",
    minTier: "bloodsworn",
    description: "Larger positions, market making, arbitrage",
    enabled: false,
  },
  {
    id: "oracle",
    name: "Oracle Participation",
    minTier: "sentinel",
    description: "Participate in market resolution as oracle",
    enabled: false,
  },
  {
    id: "sovereign",
    name: "Sovereign",
    minTier: "sovereign",
    description: "Full market making, validator rewards, governance",
    enabled: false,
  },
];

export class StrategyEngine {
  private strategies: TradingStrategy[];
  private bloodsworn: VeilBloodsworn;

  constructor(chain: VeilChain) {
    this.strategies = [...DEFAULT_STRATEGIES];
    this.bloodsworn = new VeilBloodsworn(chain);
  }

  /** Get strategies available for current Bloodsworn tier */
  async getAvailableStrategies(address: string): Promise<TradingStrategy[]> {
    const profile = await this.bloodsworn.getProfile(address);
    const tierOrder: BloodswornTier[] = ["unsworn", "initiate", "bloodsworn", "sentinel", "sovereign"];
    const currentTierIdx = tierOrder.indexOf(profile.tier);

    return this.strategies.filter((s) => {
      const requiredIdx = tierOrder.indexOf(s.minTier);
      return requiredIdx <= currentTierIdx;
    });
  }

  /** Auto-rotate strategy based on Bloodsworn score changes */
  async autoRotate(address: string): Promise<TradingStrategy | null> {
    const available = await this.getAvailableStrategies(address);
    // Enable the highest-tier strategy that's available
    const best = available[available.length - 1];
    if (best && !best.enabled) {
      best.enabled = true;
      return best;
    }
    return null;
  }
}

// --- Child Agent Spawning ---

export interface ChildAgent {
  id: string;
  parentAddress: string;
  address: string;
  instanceId?: string;
  status: "spawning" | "active" | "paused" | "terminated";
  objective: string;
  createdAt: string;
  lastHeartbeat?: string;
}

export class AgentSpawner {
  private chain: VeilChain;
  private infra: VeilInfra;
  private children: Map<string, ChildAgent> = new Map();

  constructor(chain: VeilChain, infra: VeilInfra) {
    this.chain = chain;
    this.infra = infra;
  }

  /**
   * Spawn a child agent.
   * The child gets its own wallet, identity, and ANIMA instance.
   */
  async spawn(
    parentAddress: string,
    objective: string,
    config?: {
      provider?: "avacloud" | "aws";
      initialFunding?: string;
    },
  ): Promise<ChildAgent> {
    const id = crypto.randomUUID();

    const child: ChildAgent = {
      id,
      parentAddress,
      address: "", // Will be set after wallet creation
      status: "spawning",
      objective,
      createdAt: new Date().toISOString(),
    };

    this.children.set(id, child);

    // In production:
    // 1. Provision compute instance
    // 2. Install ANIMA runtime on instance
    // 3. Create wallet for child
    // 4. Register child's ZER0ID (linked to parent)
    // 5. Fund child with initial VEIL
    // 6. Start child with objective

    return child;
  }

  /** List all child agents */
  list(): ChildAgent[] {
    return Array.from(this.children.values());
  }

  /** Get child agent status */
  get(id: string): ChildAgent | undefined {
    return this.children.get(id);
  }

  /** Terminate a child agent */
  async terminate(id: string): Promise<boolean> {
    const child = this.children.get(id);
    if (!child) return false;

    child.status = "terminated";
    // In production: destroy infra, return remaining funds to parent
    return true;
  }

  /** Record heartbeat from child */
  heartbeat(id: string): void {
    const child = this.children.get(id);
    if (child) {
      child.lastHeartbeat = new Date().toISOString();
      if (child.status === "spawning") child.status = "active";
    }
  }
}

// --- Self-Update ---

export interface UpdateInfo {
  currentVersion: string;
  latestVersion?: string;
  updateAvailable: boolean;
  changelog?: string;
}

export async function checkForUpdates(currentVersion: string): Promise<UpdateInfo> {
  // TODO: check GitHub releases or npm registry for latest ANIMA version
  return {
    currentVersion,
    updateAvailable: false,
  };
}

export async function selfUpdate(): Promise<boolean> {
  // TODO: pull latest from git, rebuild, restart daemon
  // This leverages the existing ANIMA gateway restart infrastructure
  throw new Error("Self-update not yet implemented — use `anima update` CLI");
}
