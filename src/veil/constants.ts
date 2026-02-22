/**
 * VEIL Chain Constants
 */

export const VEIL_CHAIN_CONFIG = {
  chainId: 22207,
  token: "VEIL",
  stablecoin: "VAI",
  subnetId: "hW1PX8sV3HUf7ZVLeCN5wcFAGQyypyMqfdEsUX6787MUV9maf",
  blockchainId: "2L5JWLhXnDm8dPyBFMjBuqsbPSytL4bfbGJJj37jk5ri1KdXhd",
  rpc: {
    local: "http://127.0.0.1:9650/ext/bc/2L5JWLhXnDm8dPyBFMjBuqsbPSytL4bfbGJJj37jk5ri1KdXhd/rpc",
    fuji: "", // TODO: set when fuji deployment is live
  },
  configDir: ".anima",
  walletFile: "wallet.json",
} as const;

/** VeilVM Action IDs — 41 native actions */
export const VEIL_ACTIONS = {
  Transfer: 0,
  CreateMarket: 1,
  CommitOrder: 2,
  RevealBatch: 3,
  ClearBatch: 4,
  ResolveMarket: 5,
  Dispute: 6,
  RouteFees: 7,
  ReleaseCOLTranche: 8,
  MintVAI: 9,
  BurnVAI: 10,
  CreatePool: 11,
  AddLiquidity: 12,
  RemoveLiquidity: 13,
  SwapExactIn: 14,
  UpdateReserveState: 15,
  SetRiskParams: 16,
  SubmitBatchProof: 17,
  SetProofConfig: 18,
  BondDeposit: 19,
  BondRedeem: 20,
  CreateBondMarket: 21,
  PurchaseBond: 22,
  RedeemBondNote: 23,
  SetYRFConfig: 24,
  RunYRFWeeklyReset: 25,
  RunYRFDailyBeat: 26,
  SetRBSConfig: 27,
  TickRBS: 28,
  LiquidateCDP: 29,
  SetVVEILPolicy: 30,
  StakeVEIL: 31,
  WrapVVEIL: 32,
  UnwrapGVEIL: 33,
  UnstakeVEIL: 34,
  ClaimOracleReward: 35,
  SlashOracle: 36,
  RegisterBloodsworn: 37,
  UpdateBloodswornScore: 38,
  SetGlobalPause: 39,
  SetActionPause: 40,
  SetRevealCommittee: 41,
} as const;

/** Fee routing split */
export const FEE_ROUTING = {
  msrb: 0.70,  // 70% → Market Scoring Rule Bank (depth)
  col: 0.20,   // 20% → Chain-Owned Liquidity (buyback-and-make)
  ops: 0.10,   // 10% → Operations
} as const;
