/**
 * VEIL Bloodsworn — On-Chain Reputation System
 *
 * Reputation scoring that gates agent capabilities.
 * Higher scores unlock more actions, lower bond requirements, and validator eligibility.
 */

import { VeilChain, type ActionResult } from "./chain.js";
import { VEIL_ACTIONS } from "./constants.js";

export interface BloodswornProfile {
  address: string;
  score: number;
  tier: BloodswornTier;
  registered: boolean;
  registeredAt?: string;
  lastUpdated?: string;
  totalMarkets: number;
  totalVolume: string;
  disputesWon: number;
  disputesLost: number;
  slashEvents: number;
}

export type BloodswornTier =
  | "unsworn"      // Score 0 — no reputation, limited actions
  | "initiate"     // Score 1-249 — basic market participation
  | "bloodsworn"   // Score 250-749 — full market access
  | "sentinel"     // Score 750-1499 — oracle eligibility
  | "sovereign";   // Score 1500+ — validator eligibility, governance weight

export function tierFromScore(score: number): BloodswornTier {
  if (score >= 1500) return "sovereign";
  if (score >= 750) return "sentinel";
  if (score >= 250) return "bloodsworn";
  if (score >= 1) return "initiate";
  return "unsworn";
}

export class VeilBloodsworn {
  private chain: VeilChain;

  constructor(chain: VeilChain) {
    this.chain = chain;
  }

  /** Register as Bloodsworn — requires identity + bond */
  async register(privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.RegisterBloodsworn, {}, privateKey);
  }

  /** Get Bloodsworn profile for an address */
  async getProfile(address: string): Promise<BloodswornProfile> {
    const result = await this.chain.rpc("veilvm.getBloodsworn", [address]);
    const profile = result as BloodswornProfile;
    profile.tier = tierFromScore(profile.score);
    return profile;
  }

  /** Check if address meets minimum tier */
  async meetsTier(address: string, minTier: BloodswornTier): Promise<boolean> {
    const tierOrder: BloodswornTier[] = ["unsworn", "initiate", "bloodsworn", "sentinel", "sovereign"];
    const profile = await this.getProfile(address);
    return tierOrder.indexOf(profile.tier) >= tierOrder.indexOf(minTier);
  }

  /** Get current score for an address */
  async getScore(address: string): Promise<number> {
    const profile = await this.getProfile(address);
    return profile.score;
  }

  /** Check validator eligibility (requires sovereign tier) */
  async isValidatorEligible(address: string): Promise<boolean> {
    return this.meetsTier(address, "sovereign");
  }

  /** Check oracle eligibility (requires sentinel tier) */
  async isOracleEligible(address: string): Promise<boolean> {
    return this.meetsTier(address, "sentinel");
  }
}
