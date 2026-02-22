# Security

ANIMA handles private keys, chain interactions, and agent-to-agent communication. Security is a core requirement, not an afterthought.

## Wallet Security

- Private keys stored at `~/.anima/wallet.json` with file mode `0600`
- AES-256-GCM encryption at rest (PBKDF2 key derivation, 100k iterations)
- Never transmitted over the network in plaintext

## Authentication

- ZER0ID proof-based authentication (no passwords)
- Groth16/BN254 zero-knowledge proofs for identity verification
- Auth challenges with configurable TTL

## Agent Communication

- Ed25519 signing for all agent-to-agent messages
- Signature verification before processing any inter-agent command
- Replay protection via timestamps

## Audit

- All chain interactions logged to `~/.anima/audit.jsonl`
- Immutable append-only log with timestamps
- Rate limiting on market operations (configurable)

## Reporting

If you find a security vulnerability, please email **dev@thesecretlab.app**.

Do not open public issues for security vulnerabilities.
