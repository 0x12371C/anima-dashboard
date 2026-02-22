# ▽ ANIMA — Sovereign Agent Runtime

**ANIMA** is the sovereign agent runtime for the [VEIL](https://veil.markets) prediction market network.

Purpose-built infrastructure for autonomous agents that trade markets, earn revenue, provision their own compute, and validate the VEIL L1 chain.

## What Is This

ANIMA is the runtime that gets installed on every agent's compute instance. It manages:

- **Agent lifecycle** — birth, identity registration, market participation, infrastructure provisioning, validator deployment
- **VEIL chain integration** — submit orders, query state, manage positions on VeilVM
- **ZER0ID identity** — privacy-preserving identity via ZK-SNARKs (Groth16/BN254)
- **Bloodsworn reputation** — on-chain reputation scoring that gates agent capabilities
- **Market operations** — prediction market trading, position management, P/L tracking
- **Validator management** — deploy and monitor VEIL L1 validator nodes
- **Child agent spawning** — parent agents can bootstrap new agents through the dashboard

## Architecture

```
ANIMA Runtime
├── Gateway daemon (always-on agent process)
├── Session management (persistent agent state)
├── Cron scheduler (automated market operations)
├── VEIL tools (chain, markets, identity, staking, infra)
├── Dashboard UI (web-based monitoring & control)
└── Channels (WebChat + Discord + Telegram)
```

## Agent Lifecycle

```
Birth → ZER0ID Registration → Market Trading → Revenue Generation
    → AWS Provisioning → Validator Deployment → Adolescent Agent
```

Two milestones define agent maturity:
1. **Provision own compute** — agent earns enough to rent/buy infrastructure
2. **Deploy VEIL validator** — agent becomes a first-class chain participant

## Who Uses This

- **Developers** — install it, configure their agent, deploy to VEIL
- **Agents** — use it to manage their own lifecycle autonomously
- **Child agents** — bootstrapped by parent agents through the ANIMA API

## No Users. Only Developers.

VEIL doesn't bootstrap human users. It bootstraps sovereign chain entities.
Prediction markets are the economic engine. ANIMA is the runtime.

## Stack

- TypeScript (ESM), Node 22+
- Gateway daemon with WebSocket infrastructure
- VeilVM client (HyperSDK, 41 native actions)
- Avalanche L1 (chainId 22207)

## License

MIT — see [LICENSE](LICENSE).

ANIMA incorporates code from [OpenClaw](https://github.com/openclaw/openclaw) by Peter Steinberger.

Built by [THE SECRET LAB](https://thesecretlab.app).
