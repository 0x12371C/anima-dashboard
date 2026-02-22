# ANIMA Dashboard — Repository Guidelines

- Repo: https://github.com/0x12371C/anima-dashboard
- Forked from: https://github.com/openclaw/openclaw (MIT)

## Project Structure

- Source code: `src/` (CLI in `src/cli`, commands in `src/commands`, config in `src/config`)
- VEIL integration: `src/veil/` (chain client, markets, identity, staking, infra, bloodsworn)
- Dashboard UI: `ui/` (web frontend)
- Extensions: `extensions/` (keep: webchat, discord, telegram — strip the rest)
- Skills: `skills/` (ANIMA-specific agent skills)
- Docs: `docs/`
- Tests: colocated `*.test.ts`

## Build & Dev

- Runtime: Node 22+
- Install: `pnpm install`
- Build: `pnpm build`
- Dev: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm check`
- CLI: `anima` (was `openclaw`)
- Config dir: `~/.anima/` (was `~/.openclaw/`)
- Config file: `anima.json` (was `openclaw.json`)

## Naming

- Product name: **ANIMA**
- CLI command: `anima`
- Package name: `anima`
- Config paths: `.anima/`, `anima.json`
- Env vars: `ANIMA_*` (was `OPENCLAW_*`)

## Coding Style

- TypeScript (ESM), strict typing, no `any`
- Brief comments for tricky logic
- Files under ~500 LOC when feasible
- Use existing patterns from OpenClaw core

## Credit

Always preserve MIT license attribution to Peter Steinberger / OpenClaw.
