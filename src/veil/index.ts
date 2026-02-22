/**
 * VEIL Chain Integration Module
 *
 * Purpose-built tools for ANIMA agents to interact with the VEIL L1 network.
 * 10 modules: wallet, chain, markets, identity, staking, infra, bloodsworn, payments, security, autonomy.
 * 30 agent tools registered via tools.ts.
 */

// Core
export { VeilWallet, createWallet, loadWallet, walletExists, getWalletAddress } from "./wallet.js";
export { VeilChain } from "./chain.js";
export { VEIL_CHAIN_CONFIG, VEIL_ACTIONS, FEE_ROUTING } from "./constants.js";

// Protocol
export { VeilMarkets } from "./markets.js";
export { VeilIdentity } from "./identity.js";
export { VeilStaking } from "./staking.js";
export { VeilBloodsworn, tierFromScore } from "./bloodsworn.js";
export { VeilPayments } from "./payments.js";

// Infrastructure
export { VeilInfra } from "./infra.js";

// Security
export {
  encrypt, decrypt,
  generateSigningKeypair, signMessage, verifyMessage,
  AuditLog, RateLimiter,
  createAuthChallenge, isChallengeValid,
} from "./security.js";

// Autonomy
export {
  HealthMonitor, StrategyEngine, AgentSpawner,
  checkForUpdates, selfUpdate,
} from "./autonomy.js";

// Tool System
export { ANIMA_TOOLS, getToolsByCategory, getToolCount } from "./tools.js";
