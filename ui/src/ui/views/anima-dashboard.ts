/**
 * ANIMA Dashboard — Agent Lifecycle View
 *
 * The primary view for ANIMA agents. Shows:
 * - Agent lifecycle stage
 * - Bloodsworn score + tier
 * - Market positions & P/L
 * - Validator status
 * - Infrastructure health
 * - VEIL/VAI balances
 * - ZER0ID credential
 * - Child agent management
 */

export interface AgentLifecycleState {
  stage: "birth" | "registered" | "trading" | "earning" | "provisioning" | "validating" | "sovereign";
  address: string;
  bloodswornTier: string;
  bloodswornScore: number;
  balances: {
    veil: string;
    vai: string;
    vveil: string;
    gveil: string;
  };
  identity: {
    registered: boolean;
    trustLevel: number;
    credentialId?: string;
  };
  markets: {
    activePositions: number;
    totalPnl: string;
    totalVolume: string;
  };
  validator: {
    isActive: boolean;
    nodeId?: string;
    uptimePercent?: number;
    stakeAmount?: string;
  };
  infra: {
    instances: number;
    healthStatus: "healthy" | "degraded" | "down" | "none";
  };
  children: {
    count: number;
    active: number;
  };
}

const LIFECYCLE_STAGES = [
  { id: "birth", label: "Birth", icon: "◇", desc: "Agent created, wallet generated" },
  { id: "registered", label: "Registered", icon: "▽", desc: "ZER0ID identity established" },
  { id: "trading", label: "Trading", icon: "◈", desc: "Active in prediction markets" },
  { id: "earning", label: "Earning", icon: "◆", desc: "Generating revenue from markets" },
  { id: "provisioning", label: "Provisioning", icon: "⬡", desc: "Deploying own infrastructure" },
  { id: "validating", label: "Validating", icon: "⬢", desc: "Running VEIL validator node" },
  { id: "sovereign", label: "Sovereign", icon: "▼", desc: "Full chain participant" },
];

const BLOODSWORN_TIERS = {
  unsworn: { color: "#666", label: "Unsworn" },
  initiate: { color: "#8B5CF6", label: "Initiate" },
  bloodsworn: { color: "#10B981", label: "Bloodsworn" },
  sentinel: { color: "#F59E0B", label: "Sentinel" },
  sovereign: { color: "#EF4444", label: "Sovereign" },
};

export function renderAnimaDashboard(state: AgentLifecycleState): string {
  const currentStageIdx = LIFECYCLE_STAGES.findIndex((s) => s.id === state.stage);
  const tierInfo = BLOODSWORN_TIERS[state.bloodswornTier as keyof typeof BLOODSWORN_TIERS] || BLOODSWORN_TIERS.unsworn;

  return `
    <div class="anima-dashboard" style="font-family: 'Space Grotesk', system-ui, sans-serif; background: #060606; color: rgba(255,255,255,0.87); padding: 24px;">

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 16px;">
        <div>
          <div style="font-size: 9px; letter-spacing: 0.4em; color: rgba(16,185,129,0.5); text-transform: uppercase; margin-bottom: 4px;">ANIMA RUNTIME</div>
          <div style="font-size: 20px; font-weight: 300; letter-spacing: -0.02em;">▽ ${state.address.slice(0, 6)}...${state.address.slice(-4)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: ${tierInfo.color}; font-weight: 600;">${tierInfo.label}</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.3);">Score: ${state.bloodswornScore}</div>
        </div>
      </div>

      <!-- Lifecycle Progress -->
      <div style="margin-bottom: 32px;">
        <div style="font-size: 9px; letter-spacing: 0.3em; color: rgba(255,255,255,0.25); text-transform: uppercase; margin-bottom: 12px;">LIFECYCLE</div>
        <div style="display: flex; gap: 4px; align-items: center;">
          ${LIFECYCLE_STAGES.map((s, i) => `
            <div style="
              flex: 1; padding: 8px; text-align: center; border-radius: 6px;
              background: ${i <= currentStageIdx ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)"};
              border: 1px solid ${i === currentStageIdx ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.04)"};
              opacity: ${i <= currentStageIdx ? 1 : 0.4};
            ">
              <div style="font-size: 16px; margin-bottom: 2px;">${s.icon}</div>
              <div style="font-size: 8px; letter-spacing: 0.1em; color: ${i === currentStageIdx ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.4)"};">${s.label}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px;">
        ${renderStatCard("VEIL", state.balances.veil, "rgba(16,185,129,0.6)")}
        ${renderStatCard("VAI", state.balances.vai, "rgba(139,92,246,0.6)")}
        ${renderStatCard("vVEIL", state.balances.vveil, "rgba(245,158,11,0.6)")}
        ${renderStatCard("gVEIL", state.balances.gveil, "rgba(239,68,68,0.6)")}
      </div>

      <!-- Panels -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">

        <!-- Markets -->
        <div style="background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;">
          <div style="font-size: 9px; letter-spacing: 0.3em; color: rgba(16,185,129,0.4); text-transform: uppercase; margin-bottom: 12px;">MARKETS</div>
          <div style="font-size: 24px; font-weight: 300; margin-bottom: 4px;">${state.markets.activePositions} <span style="font-size: 11px; color: rgba(255,255,255,0.3);">positions</span></div>
          <div style="font-size: 11px; color: ${Number(state.markets.totalPnl) >= 0 ? "rgba(16,185,129,0.8)" : "rgba(239,68,68,0.8)"};">P/L: ${state.markets.totalPnl} VEIL</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 4px;">Volume: ${state.markets.totalVolume}</div>
        </div>

        <!-- Identity -->
        <div style="background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;">
          <div style="font-size: 9px; letter-spacing: 0.3em; color: rgba(139,92,246,0.4); text-transform: uppercase; margin-bottom: 12px;">ZER0ID</div>
          <div style="font-size: 24px; font-weight: 300; margin-bottom: 4px;">L${state.identity.trustLevel}</div>
          <div style="font-size: 11px; color: rgba(255,255,255,0.4);">${state.identity.registered ? "Verified" : "Unregistered"}</div>
          ${state.identity.credentialId ? `<div style="font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 4px;">${state.identity.credentialId.slice(0, 16)}...</div>` : ""}
        </div>

        <!-- Validator -->
        <div style="background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;">
          <div style="font-size: 9px; letter-spacing: 0.3em; color: rgba(245,158,11,0.4); text-transform: uppercase; margin-bottom: 12px;">VALIDATOR</div>
          ${state.validator.isActive ? `
            <div style="font-size: 14px; font-weight: 300; margin-bottom: 4px;">⬢ Active</div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.4);">Uptime: ${state.validator.uptimePercent}%</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 4px;">Stake: ${state.validator.stakeAmount} VEIL</div>
          ` : `
            <div style="font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.2);">◇ Inactive</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.15); margin-top: 4px;">Requires Sovereign tier</div>
          `}
        </div>

        <!-- Infrastructure -->
        <div style="background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 16px;">
          <div style="font-size: 9px; letter-spacing: 0.3em; color: rgba(239,68,68,0.4); text-transform: uppercase; margin-bottom: 12px;">INFRASTRUCTURE</div>
          <div style="font-size: 24px; font-weight: 300; margin-bottom: 4px;">${state.infra.instances} <span style="font-size: 11px; color: rgba(255,255,255,0.3);">instances</span></div>
          <div style="font-size: 11px; color: ${state.infra.healthStatus === "healthy" ? "rgba(16,185,129,0.8)" : state.infra.healthStatus === "none" ? "rgba(255,255,255,0.2)" : "rgba(239,68,68,0.8)"};">${state.infra.healthStatus}</div>
          <div style="font-size: 9px; color: rgba(255,255,255,0.2); margin-top: 4px;">Children: ${state.children.active}/${state.children.count}</div>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between;">
        <div style="font-size: 8px; color: rgba(255,255,255,0.15);">ANIMA v0.1.0 · Chain 22207 · Testnet</div>
        <div style="font-size: 8px; color: rgba(255,255,255,0.15);">THE SECRET LAB</div>
      </div>
    </div>
  `;
}

function renderStatCard(label: string, value: string, color: string): string {
  return `
    <div style="background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 12px;">
      <div style="font-size: 8px; letter-spacing: 0.2em; color: ${color}; text-transform: uppercase; margin-bottom: 4px;">${label}</div>
      <div style="font-size: 18px; font-weight: 300;">${formatBalance(value)}</div>
    </div>
  `;
}

function formatBalance(raw: string): string {
  const num = Number(raw);
  if (isNaN(num)) return raw;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(2);
}
