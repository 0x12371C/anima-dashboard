# Architecture

ANIMA is a purpose-built agent runtime for the VEIL prediction market network. It provides always-on infrastructure for autonomous agents that trade markets, earn revenue, and eventually provision their own infrastructure.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ANIMA Runtime                         │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Gateway  │  │ Sessions │  │   Cron   │             │
│  │ Daemon   │  │ Manager  │  │ Scheduler│             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│  ┌────┴──────────────┴──────────────┴────┐              │
│  │          VEIL Tool Layer              │              │
│  │                                       │              │
│  │  wallet · chain · markets · identity  │              │
│  │  staking · bloodsworn · infra         │              │
│  │  payments · security · autonomy       │              │
│  └────────────────┬──────────────────────┘              │
│                   │                                      │
│  ┌────────────────┴──────────────────────┐              │
│  │         Channels                       │              │
│  │   WebChat · Discord · Telegram         │              │
│  └────────────────────────────────────────┘              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────┐
            │   VEIL L1 Chain  │
            │   Chain 22207    │
            │   41 VM Actions  │
            │   HyperSDK       │
            └──────────────────┘
```

## Core Components

### Gateway Daemon
Always-on process that manages the agent's lifecycle. Handles WebSocket connections, HTTP API, and channel integrations. Survives restarts and maintains persistent state.

### Session Manager
Manages agent conversation state across channels. Each agent runs as a persistent session with full context history.

### Cron Scheduler
Automated scheduled operations — market monitoring, rebalancing, health checks, heartbeats.

### VEIL Tool Layer
13 modules providing 30 tools for chain interaction:

| Module | Purpose |
|--------|---------|
| `wallet` | EVM key management, balance queries |
| `chain` | VeilVM JSON-RPC client, action submission |
| `markets` | Commit-reveal orders, positions, P/L |
| `identity` | ZER0ID registration, Groth16 proofs |
| `staking` | vVEIL/gVEIL, bond markets, YRF |
| `bloodsworn` | 5-tier reputation, capability gating |
| `infra` | AvaCloud/AWS provisioning, validator deployment |
| `payments` | VEIL/VAI transfers, swaps, liquidity |
| `security` | Encrypted storage, signing, audit, rate limiting |
| `autonomy` | Health monitoring, strategy engine, child agents |
| `tools` | Tool definitions for agent registration |

## VEIL Chain

ANIMA agents operate on the VEIL L1:

- **Chain ID**: 22207
- **Token**: VEIL
- **Stablecoin**: VAI
- **VM**: HyperSDK (custom Avalanche VM)
- **Actions**: 41 native action types
- **Privacy**: Commit-reveal batch auctions, threshold encryption, Groth16 proofs
- **Finality**: Sub-second

## Security Model

- **Wallet encryption**: AES-256-GCM at rest, PBKDF2 key derivation
- **Agent signing**: Ed25519 for agent-to-agent communication
- **Authentication**: ZER0ID proof-based (no passwords)
- **Audit logging**: All chain interactions logged to `~/.anima/audit.jsonl`
- **Rate limiting**: Configurable per-action rate limits
- **Proof verification**: On-chain Groth16/BN254 verifier

## Design Principles

1. **Agent-first** — Every feature serves autonomous agent operation
2. **Chain-native** — Deep integration with VeilVM, not a wrapper
3. **Self-assembling** — Successful agents provision more infrastructure
4. **Privacy-preserving** — ZER0ID for identity, shielded ledger for transactions
5. **Minimal trust** — Reputation gates capabilities, not human gatekeepers
