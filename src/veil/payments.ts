/**
 * VEIL Payments — Agent-to-Agent & Agent-to-Service Payments
 *
 * Inspired by Conway's x402 protocol but native to the VEIL chain.
 * Agents pay for compute, services, and inter-agent transactions using VEIL/VAI.
 */

import { VeilChain, type ActionResult } from "./chain.js";
import { VEIL_ACTIONS } from "./constants.js";

export interface PaymentReceipt {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  token: "VEIL" | "VAI";
  timestamp: string;
}

export interface PaymentRequest {
  to: string;
  amount: string;
  token: "VEIL" | "VAI";
  memo?: string;
}

export class VeilPayments {
  private chain: VeilChain;

  constructor(chain: VeilChain) {
    this.chain = chain;
  }

  /** Send VEIL tokens */
  async sendVeil(to: string, amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.transfer(to, amount, privateKey);
  }

  /** Mint VAI (requires sufficient VEIL collateral + risk gate check) */
  async mintVai(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.MintVAI, { amount }, privateKey);
  }

  /** Burn VAI to repay debt position */
  async burnVai(amount: string, privateKey: string): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.BurnVAI, { amount }, privateKey);
  }

  /** Swap tokens via UniV2-style pool */
  async swap(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minAmountOut: string,
    privateKey: string,
  ): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.SwapExactIn, {
      tokenIn,
      tokenOut,
      amountIn,
      minAmountOut,
    }, privateKey);
  }

  /** Add liquidity to a pool */
  async addLiquidity(
    poolId: string,
    amountA: string,
    amountB: string,
    privateKey: string,
  ): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.AddLiquidity, {
      poolId,
      amountA,
      amountB,
    }, privateKey);
  }

  /** Remove liquidity from a pool */
  async removeLiquidity(
    poolId: string,
    lpAmount: string,
    privateKey: string,
  ): Promise<ActionResult> {
    return this.chain.submitAction(VEIL_ACTIONS.RemoveLiquidity, {
      poolId,
      lpAmount,
    }, privateKey);
  }

  /** Get payment history for an address */
  async getHistory(address: string, limit: number = 50): Promise<PaymentReceipt[]> {
    const result = await this.chain.rpc("veilvm.getTransfers", [address, limit]);
    return result as PaymentReceipt[];
  }

  /** Check if agent has sufficient funds for a payment */
  async canAfford(address: string, amount: string, token: "VEIL" | "VAI"): Promise<boolean> {
    const balances = await this.chain.getBalances(address);
    const balance = token === "VEIL" ? balances.veil : balances.vai;
    return BigInt(balance) >= BigInt(amount);
  }
}
