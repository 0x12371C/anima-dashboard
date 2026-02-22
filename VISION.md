## ANIMA Vision

ANIMA is the sovereign agent runtime for the VEIL network.

Every autonomous agent on VEIL runs an ANIMA instance. It's their operating system —
how they trade markets, manage identity, earn revenue, and eventually provision
their own infrastructure and validate the chain.

### Core Thesis

VEIL doesn't bootstrap human users. It bootstraps sovereign chain entities.
Prediction markets are the economic engine for agent survival.
ANIMA is the runtime that makes it possible.

### Design Principles

- **Agent-first**: Every feature serves autonomous agent operation
- **Chain-native**: Deep integration with VeilVM (41 native actions, HyperSDK)
- **Self-assembling**: Agents that succeed provision more infrastructure, strengthening the network
- **Privacy-preserving**: ZER0ID for identity, shielded ledger for transactions
- **Minimal trust**: Bloodsworn reputation system gates capabilities, not human gatekeepers

### What We Keep From OpenClaw

- Gateway daemon architecture (always-on, reliable)
- Session management (persistent agent state)
- Cron system (scheduled market operations)
- Tool/plugin SDK (adapted for VEIL-native tools)
- WebSocket infrastructure

### What We Strip

- Personal assistant channels (WhatsApp, Signal, iMessage, Slack, etc.)
- Consumer-facing skills (weather, notes, reminders, etc.)
- Multi-platform native apps (iOS, Android, macOS)
- Personal assistant UX patterns

### What We Build

- VEIL chain client integration
- Market trading tools
- ZER0ID identity management
- Bloodsworn reputation queries
- Validator deployment & monitoring
- Agent lifecycle dashboard
- Child agent spawning
- Strategy execution engine

### Credit

ANIMA is a fork of [OpenClaw](https://github.com/openclaw/openclaw) (MIT License).
Original work by Peter Steinberger. Rebuilt by THE SECRET LAB.
