/**
 * VEIL Identity — ZER0ID Integration
 *
 * Privacy-preserving identity via ZK-SNARKs (Groth16/BN254).
 * Agents register their identity, generate proofs, and manage credentials.
 */

import { VeilChain } from "./chain.js";

export interface ZeroIdCredential {
  id: string;
  trustLevel: number; // L0-L4
  proofHash: string;
  issuedAt: string;
  expiresAt?: string;
  constraints: string[];
}

export interface IdentityRegistration {
  address: string;
  credentialId: string;
  trustLevel: number;
  txHash: string;
}

export class VeilIdentity {
  private chain: VeilChain;

  constructor(chain: VeilChain) {
    this.chain = chain;
  }

  /**
   * Register agent identity via ZER0ID.
   * Generates a Groth16 proof of identity without revealing PII.
   *
   * Trust levels:
   * L0 — Anonymous (wallet only)
   * L1 — Pseudonymous (social verification)
   * L2 — Verified (KYC-equivalent, ZK-proven)
   * L3 — Institutional (org verification)
   * L4 — Sovereign (full validator + identity bond)
   */
  async register(
    privateKey: string,
    trustLevel: number = 0,
    proofData?: string,
  ): Promise<IdentityRegistration> {
    const result = await this.chain.rpc("veilvm.registerIdentity", [{
      trustLevel,
      proofData: proofData || "",
      signer: privateKey,
    }]);
    return result as IdentityRegistration;
  }

  /** Get ZER0ID credential for an address */
  async getCredential(address: string): Promise<ZeroIdCredential | null> {
    const result = await this.chain.rpc("veilvm.getIdentity", [address]);
    return (result as ZeroIdCredential) || null;
  }

  /** Generate a selective disclosure proof for a specific verifier */
  async generateProof(
    privateKey: string,
    verifierAddress: string,
    disclosedFields: string[],
  ): Promise<{ proof: string; publicInputs: string[] }> {
    // In production, this runs Groth16 proof generation locally
    // using the circom circuits from the ZER0ID SDK
    const result = await this.chain.rpc("veilvm.generateIdentityProof", [{
      signer: privateKey,
      verifier: verifierAddress,
      disclosedFields,
    }]);
    return result as { proof: string; publicInputs: string[] };
  }

  /** Verify a ZER0ID proof */
  async verifyProof(
    proof: string,
    publicInputs: string[],
  ): Promise<{ valid: boolean; trustLevel: number }> {
    const result = await this.chain.rpc("veilvm.verifyIdentityProof", [{
      proof,
      publicInputs,
    }]);
    return result as { valid: boolean; trustLevel: number };
  }

  /** Check if an address has minimum trust level */
  async meetsThreshold(address: string, minLevel: number): Promise<boolean> {
    const cred = await this.getCredential(address);
    if (!cred) return false;
    return cred.trustLevel >= minLevel;
  }
}
