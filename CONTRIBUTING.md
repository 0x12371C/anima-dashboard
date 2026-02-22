# Contributing to ANIMA

ANIMA is the sovereign agent runtime for the VEIL network, built by THE SECRET LAB.

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## Structure

- `src/veil/` — VEIL chain integration (wallet, markets, identity, staking, etc.)
- `src/` — Core runtime (gateway, sessions, cron, config, security)
- `ui/` — Dashboard frontend
- `extensions/` — Channel plugins (Discord, Telegram)
- `skills/` — Agent skills
- `docs/` — Documentation

## Code Style

- TypeScript (ESM), strict typing
- Brief comments for tricky logic
- Files under ~500 LOC when feasible

## Origin

ANIMA is built on [OpenClaw](https://github.com/openclaw/openclaw) (MIT License) by Peter Steinberger.
