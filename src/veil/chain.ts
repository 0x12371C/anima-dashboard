/**
 * VeilVM Chain Client
 *
 * Direct interaction with the VEIL L1 chain via JSON-RPC.
 * 41 native HyperSDK actions, sub-second finality.
 */

import { VEIL_CHAIN_CONFIG, VEIL_ACTIONS } from "./constants.js";

export interface ChainConfig {
  rpcUrl: string;
  chainId: number;
}

export interface ActionResult {
  success: boolean;
  txHash?: string;
  blockHeight?: number;
  error?: string;
}

export interface BalanceInfo {
  veil: string;
  vai: string;
  vveil: string;
  gveil: string;
}

export class VeilChain {
  private rpcUrl: string;
  private chainId: number;

  constructor(config?: Partial<ChainConfig>) {
    this.rpcUrl = config?.rpcUrl || VEIL_CHAIN_CONFIG.rpc.local;
    this.chainId = config?.chainId || VEIL_CHAIN_CONFIG.chainId;
  }

  /** Raw JSON-RPC call to VeilVM */
  async rpc(method: string, params: unknown[] = []): Promise<unknown> {
    const res = await fetch(this.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    if (!res.ok) {
      throw new Error(`RPC error ${res.status}: ${await res.text()}`);
    }

    const json = (await res.json()) as { result?: unknown; error?: { message: string } };
    if (json.error) {
      throw new Error(`RPC error: ${json.error.message}`);
    }

    return json.result;
  }

  /** Get VEIL/VAI/vVEIL/gVEIL balances for an address */
  async getBalances(address: string): Promise<BalanceInfo> {
    const result = (await this.rpc("veilvm.getBalances", [address])) as BalanceInfo;
    return result;
  }

  /** Submit a signed action to the chain */
  async submitAction(actionId: number, payload: Record<string, unknown>, privateKey: string): Promise<ActionResult> {
    const result = (await this.rpc("veilvm.submitAction", [
      { actionId, payload, signer: privateKey },
    ])) as ActionResult;
    return result;
  }

  /** Transfer VEIL tokens */
  async transfer(to: string, amount: string, privateKey: string): Promise<ActionResult> {
    return this.submitAction(VEIL_ACTIONS.Transfer, { to, amount }, privateKey);
  }

  /** Submit encrypted order commitment (privacy-preserving) */
  async commitOrder(
    marketId: string,
    encryptedPayload: string,
    commitmentHash: string,
    privateKey: string,
  ): Promise<ActionResult> {
    return this.submitAction(VEIL_ACTIONS.CommitOrder, {
      marketId,
      encryptedPayload,
      commitmentHash,
    }, privateKey);
  }

  /** Get current chain height */
  async getHeight(): Promise<number> {
    const result = (await this.rpc("veilvm.getHeight")) as { height: number };
    return result.height;
  }

  /** Get chain network info */
  async getNetworkInfo(): Promise<unknown> {
    return this.rpc("veilvm.getNetworkInfo");
  }

  /** Query market state */
  async getMarket(marketId: string): Promise<unknown> {
    return this.rpc("veilvm.getMarket", [marketId]);
  }

  /** Query batch state */
  async getBatch(batchId: string): Promise<unknown> {
    return this.rpc("veilvm.getBatch", [batchId]);
  }

  /** Get proof config */
  async getProofConfig(): Promise<unknown> {
    return this.rpc("veilvm.getProofConfig");
  }

  /** Get ZK timing metrics */
  async getZKMetrics(): Promise<unknown> {
    return this.rpc("veilvm.getZKMetrics");
  }
}
