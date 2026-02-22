# ANIMA Dashboard — Fork Plan

## Done
- [x] Phase 1: Brand & Identity — full rebrand OpenClaw → ANIMA (3041 files)
- [x] Phase 2: Strip unnecessary channels/skills/apps (1542 files, ~247k lines removed)
- [x] Phase 3: VEIL-native tools (`src/veil/` — 10 files, 951 lines)
- [x] Phase 4: Dashboard UI — agent lifecycle view + ANIMA theme CSS
- [x] Phase 5: Security — encrypted wallets, Ed25519 signing, audit log, rate limiter, ZER0ID auth
- [x] Phase 6: Agent Autonomy — health monitor, strategy engine, child spawner, self-update stubs
- [x] Tool wiring — 30 ANIMA tools across 10 categories registered

Total: 13 files, ~1555 lines in `src/veil/`

## Remaining (Implementation)
- [ ] AvaCloud API integration for `infra.ts` provisioning
- [ ] Threshold encryption for `markets.ts` commit-reveal (BLS12-381)
- [ ] Wire tools into gateway server method handlers
- [ ] Build real dashboard UI components (Lit elements replacing current chat UI)
- [ ] Create GitHub repo `0x12371C/anima-dashboard` and push
- [ ] Conway Terminal reference: `C:\Users\Josh\Desktop\conway-terminal-inspect\package\`

## What This Is
Fork of OpenClaw, rebranded and rebuilt as the ANIMA sovereign agent runtime.
This is what gets installed on every agent's AWS/AvaCloud instance — the
control plane for autonomous agents on the VEIL network.

## Who Uses It
1. **Developers** — install it, configure their agent, deploy to VEIL
2. **Agents** — use it to manage their own lifecycle, spawn children
3. **Child agents** — bootstrapped by parent agents through this dashboard

## Phase 1: Brand & Identity (Do First)
- [ ] Rename all "OpenClaw" → "ANIMA"
- [ ] Rename all "openclaw" → "anima" (package names, CLI, paths)
- [ ] Replace lobster branding with ANIMA identity
- [ ] New favicon, OG image, logo (use VEIL triangle + ANIMA text)
- [ ] Update LICENSE to credit OpenClaw (MIT requires this)
- [ ] New README.md — ANIMA-specific
- [ ] CLI: `anima` instead of `openclaw`
- [ ] Config dir: `.anima/` instead of `.openclaw/`

## Phase 2: Strip Unnecessary Channels
Keep:
- [ ] WebChat (primary dashboard interface)
- [ ] Discord (VEIL community)
- [ ] Telegram (optional)

Remove or disable by default:
- WhatsApp, Signal, iMessage, Slack, Line, Google Chat, Teams
- BlueBubbles, Matrix, Zalo
- These are personal assistant channels, not agent infrastructure

## Phase 3: VEIL-Native Tools
Replace default tooling with:
- [ ] `veil-chain` — interact with VeilVM (submit orders, query state)
- [ ] `veil-markets` — market creation, trading, position management
- [ ] `veil-identity` — ZER0ID registration, proof generation
- [ ] `veil-staking` — vVEIL staking, bond markets, governance
- [ ] `veil-infra` — AvaCloud provisioning, validator deployment
- [ ] `veil-bloodsworn` — query reputation, tier status
- [ ] `veil-wallet` — key management, balance queries, transfers

## Phase 4: Dashboard UI
The control-ui becomes the ANIMA dashboard:
- [ ] Agent lifecycle status (current stage in ANIMA lifecycle)
- [ ] Bloodsworn score + tier visualization
- [ ] Market positions & P/L
- [ ] Validator status (if running)
- [ ] Infrastructure health
- [ ] Strategy configuration
- [ ] ZER0ID credential display
- [ ] Child agent management
- [ ] VEIL/VAI balance display

## Phase 5: Security Hardening
- [ ] ZER0ID-gated authentication (not passwords)
- [ ] Encrypted wallet key storage
- [ ] Agent-to-agent communication signing
- [ ] Audit log for all chain interactions
- [ ] Rate limiting on market operations
- [ ] Strategy isolation (sandboxed execution)
- [ ] No external data exfiltration paths

## Phase 6: Agent Autonomy
- [ ] Self-update capability
- [ ] Auto-restart on crash
- [ ] Health monitoring + alerting
- [ ] Automatic strategy rotation based on Bloodsworn score
- [ ] Child agent spawning through dashboard API
- [ ] Parent-child communication protocol

## Architecture Decisions
- Gateway daemon stays — it's the right pattern for always-on agents
- Session system stays — agents run as persistent sessions
- Cron system stays — agents need scheduled operations
- Tool system stays — but tools are VEIL-native
- Node pairing adapts — agents pair with their infrastructure
- Canvas adapts — becomes the monitoring dashboard

## Repo Structure
```
anima-dashboard/
├── src/                  # Core runtime (forked from openclaw/src)
│   ├── gateway/          # ANIMA gateway daemon
│   ├── channels/         # WebChat + Discord only
│   ├── sessions/         # Agent session management
│   ├── cron/            # Scheduled operations
│   ├── veil/            # NEW: VEIL chain integration
│   │   ├── chain.ts     # VeilVM client
│   │   ├── markets.ts   # Market operations
│   │   ├── identity.ts  # ZER0ID
│   │   ├── staking.ts   # vVEIL/bonds
│   │   ├── infra.ts     # AvaCloud
│   │   └── bloodsworn.ts # Reputation queries
│   └── ...
├── ui/                   # Dashboard frontend
├── skills/              # ANIMA-specific skills
└── docs/                # ANIMA documentation
```

## Don't Touch (Keep As-Is)
- Gateway architecture
- WebSocket infrastructure
- Process management
- File system operations
- Memory/embedding system
- Plugin SDK (adapt, don't rewrite)

## Credit
Original MIT license from OpenClaw must be preserved.
Add: "ANIMA is built on OpenClaw by Peter Steinberger (MIT License)"
