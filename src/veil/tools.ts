/**
 * ANIMA Tool Definitions
 *
 * Registers VEIL-native tools with the ANIMA agent system.
 * These replace the default OpenClaw tools with purpose-built
 * agent infrastructure tools.
 */

export interface AnimaTool {
  name: string;
  description: string;
  category: "wallet" | "chain" | "markets" | "identity" | "staking" | "bloodsworn" | "infra" | "payments" | "security" | "autonomy";
  parameters: Record<string, {
    type: string;
    description: string;
    required?: boolean;
  }>;
}

/** All ANIMA tools available to agents */
export const ANIMA_TOOLS: AnimaTool[] = [
  // --- Wallet ---
  {
    name: "veil_wallet_create",
    description: "Create a new VEIL wallet. Auto-generates EVM keypair and stores at ~/.anima/wallet.json",
    category: "wallet",
    parameters: {},
  },
  {
    name: "veil_wallet_info",
    description: "Get wallet address and balances (VEIL, VAI, vVEIL, gVEIL)",
    category: "wallet",
    parameters: {},
  },

  // --- Chain ---
  {
    name: "veil_chain_height",
    description: "Get current VEIL chain block height",
    category: "chain",
    parameters: {},
  },
  {
    name: "veil_chain_transfer",
    description: "Transfer VEIL tokens to another address",
    category: "chain",
    parameters: {
      to: { type: "string", description: "Recipient address", required: true },
      amount: { type: "string", description: "Amount of VEIL to send", required: true },
    },
  },

  // --- Markets ---
  {
    name: "veil_market_create",
    description: "Create a new prediction market",
    category: "markets",
    parameters: {
      question: { type: "string", description: "Market question", required: true },
      outcomes: { type: "array", description: "Possible outcomes", required: true },
      resolvesAt: { type: "string", description: "Resolution date (ISO 8601)", required: true },
    },
  },
  {
    name: "veil_market_order",
    description: "Place an order on a prediction market (encrypted commit-reveal)",
    category: "markets",
    parameters: {
      marketId: { type: "string", description: "Market ID", required: true },
      outcome: { type: "number", description: "Outcome index", required: true },
      side: { type: "string", description: "'buy' or 'sell'", required: true },
      amount: { type: "string", description: "Order amount", required: true },
    },
  },
  {
    name: "veil_market_positions",
    description: "Get all market positions and P/L for this agent",
    category: "markets",
    parameters: {},
  },

  // --- Identity ---
  {
    name: "veil_identity_register",
    description: "Register agent identity via ZER0ID (privacy-preserving ZK proof)",
    category: "identity",
    parameters: {
      trustLevel: { type: "number", description: "Trust level (0-4)" },
    },
  },
  {
    name: "veil_identity_status",
    description: "Get ZER0ID credential status and trust level",
    category: "identity",
    parameters: {},
  },
  {
    name: "veil_identity_prove",
    description: "Generate a selective disclosure proof for a verifier",
    category: "identity",
    parameters: {
      verifier: { type: "string", description: "Verifier address", required: true },
      fields: { type: "array", description: "Fields to disclose", required: true },
    },
  },

  // --- Staking ---
  {
    name: "veil_stake",
    description: "Stake VEIL → receive rebasing vVEIL",
    category: "staking",
    parameters: {
      amount: { type: "string", description: "Amount of VEIL to stake", required: true },
    },
  },
  {
    name: "veil_unstake",
    description: "Unstake vVEIL → receive VEIL",
    category: "staking",
    parameters: {
      amount: { type: "string", description: "Amount of vVEIL to unstake", required: true },
    },
  },
  {
    name: "veil_staking_info",
    description: "Get staking info (vVEIL balance, rebase rate, next rebase)",
    category: "staking",
    parameters: {},
  },
  {
    name: "veil_bond_purchase",
    description: "Purchase a bond from an active bond market",
    category: "staking",
    parameters: {
      marketId: { type: "string", description: "Bond market ID", required: true },
      amount: { type: "string", description: "Amount to bond", required: true },
    },
  },

  // --- Bloodsworn ---
  {
    name: "veil_bloodsworn_register",
    description: "Register as Bloodsworn (requires identity + bond)",
    category: "bloodsworn",
    parameters: {},
  },
  {
    name: "veil_bloodsworn_status",
    description: "Get Bloodsworn profile: score, tier, market stats",
    category: "bloodsworn",
    parameters: {},
  },

  // --- Infrastructure ---
  {
    name: "veil_infra_provision",
    description: "Provision a compute instance for running a VEIL validator (milestone: getting a home)",
    category: "infra",
    parameters: {
      provider: { type: "string", description: "'avacloud' or 'aws'", required: true },
      region: { type: "string", description: "Region for the instance" },
    },
  },
  {
    name: "veil_infra_list",
    description: "List all provisioned infrastructure instances",
    category: "infra",
    parameters: {},
  },
  {
    name: "veil_infra_deploy_validator",
    description: "Deploy a VEIL validator node on a provisioned instance (milestone: validator deployment)",
    category: "infra",
    parameters: {
      instanceId: { type: "string", description: "Instance ID", required: true },
      stakeAmount: { type: "string", description: "VEIL to stake", required: true },
    },
  },
  {
    name: "veil_infra_health",
    description: "Check infrastructure health status",
    category: "infra",
    parameters: {
      instanceId: { type: "string", description: "Instance ID", required: true },
    },
  },

  // --- Payments ---
  {
    name: "veil_pay",
    description: "Send VEIL/VAI payment",
    category: "payments",
    parameters: {
      to: { type: "string", description: "Recipient address", required: true },
      amount: { type: "string", description: "Amount", required: true },
      token: { type: "string", description: "'VEIL' or 'VAI'" },
    },
  },
  {
    name: "veil_swap",
    description: "Swap tokens via VEIL DEX pool",
    category: "payments",
    parameters: {
      tokenIn: { type: "string", description: "Input token", required: true },
      tokenOut: { type: "string", description: "Output token", required: true },
      amountIn: { type: "string", description: "Input amount", required: true },
    },
  },

  // --- Security ---
  {
    name: "veil_audit_log",
    description: "View recent audit log entries for chain interactions",
    category: "security",
    parameters: {
      limit: { type: "number", description: "Number of entries (default 50)" },
    },
  },

  // --- Autonomy ---
  {
    name: "veil_health_check",
    description: "Run agent health checks (chain connectivity, wallet, etc.)",
    category: "autonomy",
    parameters: {},
  },
  {
    name: "veil_spawn_child",
    description: "Spawn a child agent with its own wallet and ANIMA instance",
    category: "autonomy",
    parameters: {
      objective: { type: "string", description: "Child agent's objective", required: true },
      provider: { type: "string", description: "'avacloud' or 'aws'" },
      initialFunding: { type: "string", description: "Initial VEIL funding for child" },
    },
  },
  {
    name: "veil_list_children",
    description: "List all child agents spawned by this agent",
    category: "autonomy",
    parameters: {},
  },
  {
    name: "veil_strategy_list",
    description: "List trading strategies available at current Bloodsworn tier",
    category: "autonomy",
    parameters: {},
  },
  {
    name: "veil_agent_status",
    description: "Full agent lifecycle dashboard: stage, balances, positions, reputation, infra, children",
    category: "autonomy",
    parameters: {},
  },
];

/** Get tools by category */
export function getToolsByCategory(category: AnimaTool["category"]): AnimaTool[] {
  return ANIMA_TOOLS.filter((t) => t.category === category);
}

/** Get total tool count */
export function getToolCount(): number {
  return ANIMA_TOOLS.length;
}
