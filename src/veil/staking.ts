/**
 * VEIL Staking — vVEIL, gVEIL, Bonds, Governance
 *
 * Olympus-style staking mechanics:
 * - StakeVEIL → rebasing vVEIL shares
 * - WrapVVEIL → non-rebasing gVEIL (composable)
 * - Bond markets (Reserve, Inverse, VEIL, Liquidity)
 * - YRF (Yield Repurchase Facility) buybacks
 */

import { VeilChain, type ActionResult } from "./chain.js";
import { VEIL_ACTIONS } from "./constants.js";

export interface StakingInfo {
  stakedVeil: string;
  vveilBalance: string;
  gveilBalance: string;
  rebaseRate: string;
  nextRebaseAt: string;
}

export interface BondMarket {
  id: string;
  type: "reserve" | "inverse" | "veil" | "liquidity";
  status: "active" | "closed";
  discount: string;
  vestingPeriod: string;
  capacity: string;
  purchased: string;
}

export interface BondNote {
  id: string;
  marketId: string;
  payout: string;
  maturesAt: string;
  redeemed: boolean;
}

export class VeilStaking {
  private chain: VeilChain;

  constructor(chain: VeilChain) {
    this.chain = chain;
  }

  /** Stake VEIL → receive rebasing vVEIL */
  async stake(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.StakeVEIL, { amount }, privateKey);
  }

  /** Unstake vVEIL → receive VEIL */
  async unstake(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.UnstakeVEIL, { amount }, privateKey);
  }

  /** Wrap vVEIL → non-rebasing gVEIL */
  async wrap(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.WrapVVEIL, { amount }, privateKey);
  }

  /** Unwrap gVEIL → vVEIL */
  async unwrap(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.UnwrapGVEIL, { amount }, privateKey);
  }

  /** Get staking info for an address */
  async getStakingInfo(address: string): Promise<StakingInfo> {
    const result = await this.chain.rpc("veilvm.getStakingInfo", [address]);
    return result as StakingInfo;
  }

  /** Purchase a bond */
  async purchaseBond(marketId: string, amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.PurchaseBond, { marketId, amount }, privateKey);
  }

  /** Redeem a matured bond note */
  async redeemBond(noteId: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.RedeemBondNote, { noteId }, privateKey);
  }

  /** List active bond markets */
  async getBondMarkets(): Promise<BondMarket[]> {
    const result = await this.chain.rpc("veilvm.getBondMarkets");
    return result as BondMarket[];
  }

  /** Get bond notes for an address */
  async getBondNotes(address: string): Promise<BondNote[]> {
    const result = await this.chain.rpc("veilvm.getBondNotes", [address]);
    return result as BondNote[];
  }

  /** Deposit VAI into treasury buffer (bonding) */
  async bondDeposit(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.BondDeposit, { amount }, privateKey);
  }
}
