/**
 * VEIL Wallet Management
 *
 * Local EVM wallet for ANIMA agents on the VEIL L1 chain.
 * Inspired by Conway Terminal's wallet pattern — auto-created on first run,
 * stored locally with restricted permissions.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { VEIL_CHAIN_CONFIG } from "./constants.js";

export interface WalletData {
  address: string;
  privateKey: string;
  createdAt: string;
  chainId: number;
}

export interface VeilWallet {
  address: string;
  privateKey: string;
  chainId: number;
}

function getWalletPath(): string {
  const configDir = path.join(os.homedir(), VEIL_CHAIN_CONFIG.configDir);
  return path.join(configDir, VEIL_CHAIN_CONFIG.walletFile);
}

function ensureConfigDir(): string {
  const configDir = path.join(os.homedir(), VEIL_CHAIN_CONFIG.configDir);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
  }
  return configDir;
}

/**
 * Create a new wallet. Uses viem for key generation.
 * Stores at ~/.anima/wallet.json with restricted permissions.
 */
export async function createWallet(): Promise<VeilWallet> {
  const { generatePrivateKey, privateKeyToAccount } = await import("viem/accounts");

  ensureConfigDir();
  const walletPath = getWalletPath();

  if (fs.existsSync(walletPath)) {
    throw new Error(`Wallet already exists at ${walletPath}. Use loadWallet() instead.`);
  }

  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  const walletData: WalletData = {
    address: account.address,
    privateKey,
    createdAt: new Date().toISOString(),
    chainId: VEIL_CHAIN_CONFIG.chainId,
  };

  fs.writeFileSync(walletPath, JSON.stringify(walletData, null, 2), { mode: 0o600 });

  return {
    address: account.address,
    privateKey,
    chainId: VEIL_CHAIN_CONFIG.chainId,
  };
}

/**
 * Load existing wallet from ~/.anima/wallet.json
 */
export async function loadWallet(): Promise<VeilWallet> {
  const walletPath = getWalletPath();

  if (!fs.existsSync(walletPath)) {
    throw new Error(`No wallet found at ${walletPath}. Use createWallet() first.`);
  }

  const raw = fs.readFileSync(walletPath, "utf-8");
  const data: WalletData = JSON.parse(raw);

  return {
    address: data.address,
    privateKey: data.privateKey,
    chainId: data.chainId || VEIL_CHAIN_CONFIG.chainId,
  };
}

/**
 * Get wallet address without loading private key
 */
export function getWalletAddress(): string | null {
  const walletPath = getWalletPath();
  if (!fs.existsSync(walletPath)) return null;

  const raw = fs.readFileSync(walletPath, "utf-8");
  const data: WalletData = JSON.parse(raw);
  return data.address;
}

/**
 * Check if a wallet exists
 */
export function walletExists(): boolean {
  return fs.existsSync(getWalletPath());
}
