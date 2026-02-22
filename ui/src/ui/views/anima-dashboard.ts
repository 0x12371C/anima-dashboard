/**
 * ANIMA Dashboard — Sovereign Agent Lifecycle View
 *
 * The primary view for ANIMA agents. Renders agent lifecycle stage,
 * Bloodsworn reputation, VEIL balances, market positions, ZER0ID
 * identity, validator status, and infrastructure health.
 *
 * All values are demo/testnet data until wired to the gateway.
 */

import { html, nothing } from "lit";

// ── Types ──

interface LifecycleStage {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

const STAGES: LifecycleStage[] = [
  { id: "birth", label: "Birth", icon: "◇", desc: "Agent created, wallet generated" },
  { id: "registered", label: "Registered", icon: "▽", desc: "ZER0ID identity on-chain" },
  { id: "trading", label: "Trading", icon: "◈", desc: "Active in prediction markets" },
  { id: "earning", label: "Earning", icon: "◆", desc: "Generating market revenue" },
  { id: "provisioning", label: "Provision", icon: "⬡", desc: "Deploying own compute" },
  { id: "validating", label: "Validate", icon: "⬢", desc: "Running VEIL validator" },
  { id: "sovereign", label: "Sovereign", icon: "▼", desc: "Full chain participant" },
];

const TIERS = [
  { name: "Unsworn", min: 0, color: "var(--muted)" },
  { name: "Initiate", min: 1, color: "#8B5CF6" },
  { name: "Bloodsworn", min: 250, color: "#10B981" },
  { name: "Sentinel", min: 750, color: "#F59E0B" },
  { name: "Sovereign", min: 1500, color: "#EF4444" },
];

// ── Demo State (replace with gateway data) ──
const DEMO = {
  address: "0xbDAD2Ae46c6E110F419A40500b6aa0e7CdfB3a0C",
  stage: "earning",
  bloodswornScore: 487,
  bloodswornTier: "Bloodsworn",
  balances: { veil: "12,847.50", vai: "4,200.00", vveil: "8,500.00", gveil: "2,100.00" },
  markets: { positions: 14, pnl: "+1,247.50", winRate: "68%", volume: "42.8K", lastTrade: "4m ago" },
  identity: { trustLevel: 3, verified: true, proofs: 847, disputes: "23/24", credId: "0x7a3f...b2c1", age: "47d" },
  validator: { active: false, score: 487, required: 1500 },
  infra: { instances: 2, health: "healthy", regions: ["us-east-1", "eu-west-1"], children: { active: 3, total: 5 }, uptime: "99.7%" },
};

// ── Render ──

export function renderAnimaDashboard() {
  const currentIdx = STAGES.findIndex((s) => s.id === DEMO.stage);
  const tierInfo = TIERS.find((t) => t.name === DEMO.bloodswornTier) ?? TIERS[0];
  const fillPct = (DEMO.bloodswornScore / 1500) * 100;
  const addr = `${DEMO.address.slice(0, 6)}…${DEMO.address.slice(-4)}`;

  return html`
    <style>
      .anima { font-family: 'Figtree', 'Space Grotesk', system-ui, sans-serif; font-weight: 300; }

      /* Header */
      .anima-header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 20px; margin-bottom: 36px; border-bottom: 1px solid var(--border); }
      .anima-header__label { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(16,185,129,0.45); margin-bottom: 6px; }
      .anima-header__title { font-family: 'Instrument Serif', Georgia, serif; font-size: 32px; font-weight: 400; letter-spacing: -0.03em; line-height: 1; color: var(--text-strong); }
      .anima-header__mark { color: #10B981; font-style: italic; }
      .anima-header__right { text-align: right; }
      .anima-header__addr { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); }
      .anima-header__tier { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 3px; }
      .anima-header__score { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(255,255,255,0.15); margin-top: 2px; }

      /* Lifecycle */
      .anima-lifecycle { margin-bottom: 40px; }
      .anima-lifecycle__label { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(16,185,129,0.45); margin-bottom: 14px; }
      .anima-lifecycle__track { display: flex; gap: 5px; }
      .anima-lifecycle__stage {
        flex: 1; padding: 12px 6px 10px; text-align: center; border-radius: 10px;
        background: rgba(255,255,255,0.018); border: 1px solid var(--border);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        animation: anima-rise 0.5s var(--ease-out) forwards;
        opacity: 0; position: relative;
      }
      .anima-lifecycle__stage.completed { background: rgba(16,185,129,0.06); border-color: rgba(16,185,129,0.1); }
      .anima-lifecycle__stage.current { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.25); box-shadow: 0 0 30px rgba(16,185,129,0.05), inset 0 1px 0 rgba(16,185,129,0.08); }
      .anima-lifecycle__stage.future { opacity: 0 !important; }
      .anima-lifecycle__stage.future.shown { opacity: 0.25 !important; }
      .anima-lifecycle__stage.shown { opacity: 1; }
      .anima-lifecycle__icon { font-size: 18px; line-height: 1; margin-bottom: 4px; }
      .anima-lifecycle__stage.current .anima-lifecycle__icon { animation: anima-icon-pulse 3s ease-in-out infinite; }
      .anima-lifecycle__name { font-family: 'Space Grotesk', sans-serif; font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
      .anima-lifecycle__stage.current .anima-lifecycle__name { color: #10B981; }
      .anima-lifecycle__stage.future .anima-lifecycle__name { color: rgba(255,255,255,0.1); }

      /* Pulse ring */
      .anima-pulse { position: absolute; inset: -1px; border-radius: 10px; border: 1px solid #10B981; opacity: 0; animation: anima-pulse-ring 3s ease-out infinite; pointer-events: none; }

      /* Bloodsworn */
      .anima-bloodsworn { margin-bottom: 40px; }
      .anima-bloodsworn__track { height: 3px; background: rgba(255,255,255,0.04); border-radius: 2px; margin-top: 12px; overflow: hidden; position: relative; }
      .anima-bloodsworn__fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #8B5CF6, #10B981, #F59E0B, #EF4444); transition: width 1.8s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
      .anima-bloodsworn__dot { position: absolute; right: -4px; top: -3px; width: 9px; height: 9px; border-radius: 50%; background: white; box-shadow: 0 0 10px rgba(255,255,255,0.25); }
      .anima-bloodsworn__tiers { display: flex; justify-content: space-between; margin-top: 8px; }
      .anima-bloodsworn__tier { font-family: 'Space Grotesk', sans-serif; font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.12); transition: color 0.3s; }
      .anima-bloodsworn__tier.active { color: var(--muted); }

      /* Stats Grid */
      .anima-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 40px; }

      /* Cards */
      .anima-card {
        background: rgba(255,255,255,0.018); border: 1px solid var(--border); border-radius: 14px; padding: 18px;
        position: relative; overflow: hidden;
        transition: border-color 0.35s ease, background 0.35s ease;
        animation: anima-rise 0.5s var(--ease-out) forwards; opacity: 0;
      }
      .anima-card:hover { border-color: var(--border-hover); background: rgba(255,255,255,0.028); }
      .anima-card::before {
        content: ''; position: absolute; inset: 0; border-radius: 14px; opacity: 0;
        transition: opacity 0.4s ease; pointer-events: none;
        background: radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16,185,129,0.04), transparent 40%);
      }
      .anima-card:hover::before { opacity: 1; }
      .anima-card.purple::before { background: radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.04), transparent 40%); }
      .anima-card.amber::before { background: radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(245,158,11,0.04), transparent 40%); }
      .anima-card.red::before { background: radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239,68,68,0.04), transparent 40%); }

      .anima-card__label { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(16,185,129,0.4); margin-bottom: 6px; }
      .anima-card__label.purple { color: rgba(139,92,246,0.4); }
      .anima-card__label.amber { color: rgba(245,158,11,0.4); }
      .anima-card__label.red { color: rgba(239,68,68,0.4); }

      .anima-card__value { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 300; letter-spacing: -0.03em; line-height: 1.1; }
      .anima-card__unit { font-size: 11px; font-weight: 400; color: var(--muted); letter-spacing: 0; margin-left: 4px; }
      .anima-card__sub { font-size: 11px; color: var(--muted); margin-top: 5px; }
      .anima-card__sub.positive { color: rgba(16,185,129,0.7); }
      .anima-card__sub.negative { color: rgba(239,68,68,0.7); }
      .anima-card__detail { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.12); margin-top: 6px; }

      /* Mini stats inside panels */
      .anima-mini { display: flex; gap: 10px; margin-top: 12px; }
      .anima-mini__item { flex: 1; }
      .anima-mini__label { font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.12); }
      .anima-mini__val { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); margin-top: 2px; }
      .anima-mini__val.emerald { color: #10B981; }

      /* Sub-card */
      .anima-sub { padding: 8px; border-radius: 6px; border: 1px solid var(--border); margin-top: 10px; }
      .anima-sub.purple-tint { background: rgba(139,92,246,0.03); border-color: rgba(139,92,246,0.06); }
      .anima-sub.amber-tint { background: rgba(245,158,11,0.03); border-color: rgba(245,158,11,0.06); }

      /* Instance row */
      .anima-instance { display: flex; justify-content: space-between; align-items: center; padding: 5px 8px; background: rgba(255,255,255,0.015); border-radius: 6px; border: 1px solid var(--border); }
      .anima-instance + .anima-instance { margin-top: 5px; }
      .anima-instance__name { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted); }

      /* Status dot */
      .anima-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px; vertical-align: middle; }
      .anima-dot.healthy { background: #10B981; box-shadow: 0 0 6px rgba(16,185,129,0.4); }
      .anima-dot.inactive { background: rgba(255,255,255,0.15); }

      /* Progress bar in validator */
      .anima-progress { height: 2px; background: rgba(255,255,255,0.04); border-radius: 1px; margin-top: 6px; overflow: hidden; }
      .anima-progress__fill { height: 100%; border-radius: 1px; background: linear-gradient(90deg, rgba(245,158,11,0.4), #F59E0B); }

      /* Panels */
      .anima-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 40px; }

      /* Footer */
      .anima-footer { display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid var(--border); }
      .anima-footer__text { font-family: 'Space Grotesk', sans-serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.1); }

      /* Keyframes */
      @keyframes anima-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes anima-icon-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); opacity: 0.8; } }
      @keyframes anima-pulse-ring { 0% { opacity: 0.35; transform: scale(1); } 100% { opacity: 0; transform: scale(1.05); } }

      @media (max-width: 768px) {
        .anima-stats { grid-template-columns: repeat(2, 1fr); }
        .anima-panels { grid-template-columns: 1fr; }
        .anima-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        .anima-header__right { text-align: left; }
      }
    </style>

    <div class="anima">
      <!-- Header -->
      <div class="anima-header">
        <div>
          <div class="anima-header__label">ANIMA RUNTIME</div>
          <h1 class="anima-header__title"><span class="anima-header__mark">▽</span> Agent Dashboard</h1>
        </div>
        <div class="anima-header__right">
          <div class="anima-header__addr">${addr}</div>
          <div class="anima-header__tier" style="color: ${tierInfo.color}">${DEMO.bloodswornTier.toUpperCase()}</div>
          <div class="anima-header__score">${DEMO.bloodswornScore} / 1500</div>
        </div>
      </div>

      <!-- Lifecycle -->
      <section class="anima-lifecycle">
        <div class="anima-lifecycle__label">01 — LIFECYCLE</div>
        <div class="anima-lifecycle__track">
          ${STAGES.map((s, i) => {
            const cls = i < currentIdx ? "completed shown" : i === currentIdx ? "current shown" : "future shown";
            return html`
              <div class="anima-lifecycle__stage ${cls}" style="animation-delay: ${i * 70}ms">
                <div class="anima-lifecycle__icon">${s.icon}</div>
                <div class="anima-lifecycle__name">${s.label}</div>
                ${i === currentIdx ? html`<div class="anima-pulse"></div>` : nothing}
              </div>
            `;
          })}
        </div>
      </section>

      <!-- Bloodsworn -->
      <section class="anima-bloodsworn">
        <div class="anima-lifecycle__label">02 — BLOODSWORN REPUTATION</div>
        <div class="anima-bloodsworn__track">
          <div class="anima-bloodsworn__fill" style="width: ${fillPct}%">
            <div class="anima-bloodsworn__dot"></div>
          </div>
        </div>
        <div class="anima-bloodsworn__tiers">
          ${TIERS.map((t) => html`
            <span class="anima-bloodsworn__tier ${t.name === DEMO.bloodswornTier ? "active" : ""}">${t.name}</span>
          `)}
        </div>
      </section>

      <!-- Balances -->
      <section>
        <div class="anima-lifecycle__label" style="margin-bottom: 14px;">03 — BALANCES</div>
        <div class="anima-stats">
          <div class="anima-card" style="animation-delay: 0ms">
            <div class="anima-card__label">VEIL</div>
            <div class="anima-card__value">${DEMO.balances.veil}</div>
            <div class="anima-card__sub positive">+2.4% 24h</div>
          </div>
          <div class="anima-card purple" style="animation-delay: 60ms">
            <div class="anima-card__label purple">VAI</div>
            <div class="anima-card__value">${DEMO.balances.vai}</div>
            <div class="anima-card__sub">≈ $4,200</div>
          </div>
          <div class="anima-card" style="animation-delay: 120ms">
            <div class="anima-card__label amber">vVEIL</div>
            <div class="anima-card__value">${DEMO.balances.vveil}</div>
            <div class="anima-card__sub positive">5.2% APY</div>
          </div>
          <div class="anima-card red" style="animation-delay: 180ms">
            <div class="anima-card__label red">gVEIL</div>
            <div class="anima-card__value">${DEMO.balances.gveil}</div>
            <div class="anima-card__sub">governance weight</div>
          </div>
        </div>
      </section>

      <!-- System Panels -->
      <section>
        <div class="anima-lifecycle__label" style="margin-bottom: 14px;">04 — SYSTEMS</div>
        <div class="anima-panels">
          <!-- Markets -->
          <div class="anima-card" style="animation-delay: 80ms">
            <div class="anima-card__label">PREDICTION MARKETS</div>
            <div class="anima-card__value">${DEMO.markets.positions}<span class="anima-card__unit">active positions</span></div>
            <div class="anima-card__sub positive" style="margin-top: 10px;">P/L: ${DEMO.markets.pnl} VEIL</div>
            <div class="anima-mini">
              <div class="anima-mini__item">
                <div class="anima-mini__label">Win Rate</div>
                <div class="anima-mini__val emerald">${DEMO.markets.winRate}</div>
              </div>
              <div class="anima-mini__item">
                <div class="anima-mini__label">Volume</div>
                <div class="anima-mini__val">${DEMO.markets.volume}</div>
              </div>
            </div>
            <div class="anima-card__detail">Last: ${DEMO.markets.lastTrade} · commit-reveal #1847</div>
          </div>

          <!-- Identity -->
          <div class="anima-card purple" style="animation-delay: 150ms">
            <div class="anima-card__label purple">ZER0ID IDENTITY</div>
            <div class="anima-card__value">L${DEMO.identity.trustLevel}<span class="anima-card__unit">trust level</span></div>
            <div class="anima-card__sub" style="color: rgba(139,92,246,0.5); margin-top: 10px;">
              <span class="anima-dot healthy"></span>Verified · Groth16/BN254
            </div>
            <div style="display: flex; gap: 6px; margin-top: 10px;">
              <div class="anima-sub purple-tint" style="flex: 1;">
                <div class="anima-mini__label" style="color: rgba(139,92,246,0.35);">Proofs</div>
                <div class="anima-mini__val">${DEMO.identity.proofs}</div>
              </div>
              <div class="anima-sub purple-tint" style="flex: 1;">
                <div class="anima-mini__label" style="color: rgba(139,92,246,0.35);">Disputes</div>
                <div class="anima-mini__val">${DEMO.identity.disputes}</div>
              </div>
            </div>
            <div class="anima-card__detail">cred: ${DEMO.identity.credId} · registered ${DEMO.identity.age} ago</div>
          </div>

          <!-- Validator -->
          <div class="anima-card amber" style="animation-delay: 220ms">
            <div class="anima-card__label amber">VALIDATOR NODE</div>
            <div class="anima-card__value">
              <span class="anima-dot inactive"></span>
              <span style="color: rgba(255,255,255,0.2);">Inactive</span>
            </div>
            <div class="anima-card__sub" style="color: rgba(255,255,255,0.12); margin-top: 10px;">Requires Sovereign tier (1500+)</div>
            <div class="anima-sub amber-tint" style="margin-top: 10px;">
              <div class="anima-mini__label" style="color: rgba(245,158,11,0.35);">PROGRESS TO VALIDATOR</div>
              <div class="anima-progress"><div class="anima-progress__fill" style="width: ${(DEMO.validator.score / DEMO.validator.required) * 100}%"></div></div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.12); margin-top: 3px;">${DEMO.validator.score} / ${DEMO.validator.required}</div>
            </div>
          </div>

          <!-- Infrastructure -->
          <div class="anima-card red" style="animation-delay: 290ms">
            <div class="anima-card__label red">INFRASTRUCTURE</div>
            <div class="anima-card__value">${DEMO.infra.instances}<span class="anima-card__unit">instances</span></div>
            <div class="anima-card__sub" style="margin-top: 10px;"><span class="anima-dot healthy"></span>All systems operational</div>
            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 4px;">
              ${DEMO.infra.regions.map((r) => html`
                <div class="anima-instance">
                  <span class="anima-instance__name">${r}</span>
                  <span class="anima-dot healthy" style="margin: 0;"></span>
                </div>
              `)}
            </div>
            <div class="anima-card__detail">Children: ${DEMO.infra.children.active}/${DEMO.infra.children.total} · Uptime ${DEMO.infra.uptime}</div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <div class="anima-footer">
        <div class="anima-footer__text">ANIMA v0.1.0 · Chain 22207 · Testnet</div>
        <div class="anima-footer__text">THE SECRET LAB</div>
      </div>
    </div>
  `;
}
