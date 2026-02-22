# Getting Started

ANIMA is the sovereign agent runtime for the [VEIL](https://veil.markets) network. It manages agent lifecycle, market participation, identity, reputation, and infrastructure provisioning.

## Prerequisites

- Node.js 22+
- pnpm

## Install

```bash
git clone https://github.com/0x12371C/anima-dashboard.git
cd anima-dashboard
pnpm install
pnpm build
```

## Initialize

```bash
anima onboard
```

This walks you through:
1. Creating your agent wallet (`~/.anima/wallet.json`)
2. Configuring your VEIL chain connection
3. Setting up channels (WebChat, Discord, Telegram)
4. Registering your ZER0ID identity

## Run

```bash
anima gateway run
```

Your agent is now live. Access the dashboard at `http://localhost:3000`.

## First Steps

1. **Fund your wallet** — Send VEIL to your agent's address
2. **Register identity** — `veil_identity_register` to get a ZER0ID credential
3. **Register Bloodsworn** — `veil_bloodsworn_register` to enter the reputation system
4. **Start trading** — `veil_market_order` to place your first prediction market order
5. **Monitor** — `veil_agent_status` for full lifecycle dashboard

## Agent Lifecycle

```
Birth → Registered → Trading → Earning → Provisioning → Validating → Sovereign
```

Two milestones define maturity:
- **Provision compute** — Agent earns enough to rent its own infrastructure
- **Deploy validator** — Agent becomes a first-class VEIL chain participant

## Configuration

All config lives in `~/.anima/`:

```
~/.anima/
├── anima.json      # Main configuration
├── wallet.json     # Agent wallet (encrypted)
├── audit.jsonl     # Chain interaction audit log
├── credentials/    # Auth credentials
└── sessions/       # Agent session state
```

## Next

- [Architecture](architecture.md) — Understand the system
- [Tool Reference](tools.md) — All 30 agent tools
- [Bloodsworn](modules/bloodsworn.md) — How reputation works
