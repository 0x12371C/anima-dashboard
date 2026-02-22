import { html, type TemplateResult } from "lit";

// ANIMA — Custom geometric icons
// Minimal, angular, VEIL-native aesthetic
// All use currentColor for stroke

export const icons = {
  // ── Navigation ──

  // Globe — ANIMA dashboard (inverted triangle / world)
  globe: html`
    <svg viewBox="0 0 24 24">
      <polygon points="12,3 3,20 21,20" fill="none" />
      <line x1="7.5" x2="16.5" y1="13" y2="13" />
      <line x1="5.5" x2="18.5" y1="17" y2="17" />
    </svg>
  `,

  // Terminal — agent chat
  messageSquare: html`
    <svg viewBox="0 0 24 24">
      <path d="M4 4h16v13H7l-3 3V4z" fill="none" />
      <line x1="8" x2="8.01" y1="10" y2="10" stroke-width="2" stroke-linecap="round" />
      <line x1="12" x2="12.01" y1="10" y2="10" stroke-width="2" stroke-linecap="round" />
      <line x1="16" x2="16.01" y1="10" y2="10" stroke-width="2" stroke-linecap="round" />
    </svg>
  `,

  // Bar chart — overview / usage
  barChart: html`
    <svg viewBox="0 0 24 24">
      <rect x="5" y="12" width="3" height="8" rx="0.5" fill="none" />
      <rect x="10.5" y="6" width="3" height="14" rx="0.5" fill="none" />
      <rect x="16" y="9" width="3" height="11" rx="0.5" fill="none" />
    </svg>
  `,

  // Link — channels
  link: html`
    <svg viewBox="0 0 24 24">
      <path d="M7 12h10" />
      <rect x="2" y="8" width="8" height="8" rx="2" fill="none" />
      <rect x="14" y="8" width="8" height="8" rx="2" fill="none" />
    </svg>
  `,

  // Radio — instances (signal)
  radio: html`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="14" r="2" fill="none" />
      <path d="M8.5 10.5a5 5 0 0 1 7 0" fill="none" />
      <path d="M6 8a8 8 0 0 1 12 0" fill="none" />
      <line x1="12" x2="12" y1="16" y2="20" />
    </svg>
  `,

  // File — sessions
  fileText: html`
    <svg viewBox="0 0 24 24">
      <path d="M4 4h10l4 4v12H4V4z" fill="none" />
      <line x1="14" x2="14" y1="4" y2="8" />
      <line x1="14" x2="18" y1="8" y2="8" />
      <line x1="7" x2="15" y1="13" y2="13" />
      <line x1="7" x2="12" y1="16" y2="16" />
    </svg>
  `,

  // Zap — skills (lightning)
  zap: html`
    <svg viewBox="0 0 24 24">
      <polygon points="12,2 5,13 11,13 10,22 19,11 13,11" fill="none" />
    </svg>
  `,

  // Monitor — nodes
  monitor: html`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="16" y2="20" />
    </svg>
  `,

  // Settings — config (hexagonal)
  settings: html`
    <svg viewBox="0 0 24 24">
      <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="none" />
      <circle cx="12" cy="12" r="3" fill="none" />
    </svg>
  `,

  // Bug → Diagnostics (pulse line)
  bug: html`
    <svg viewBox="0 0 24 24">
      <polyline points="2,12 6,12 9,6 12,18 15,10 18,12 22,12" fill="none" />
    </svg>
  `,

  // Scroll — logs (stacked lines)
  scrollText: html`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="16" y1="10" y2="10" />
      <line x1="4" x2="18" y1="14" y2="14" />
      <line x1="4" x2="14" y1="18" y2="18" />
    </svg>
  `,

  // Folder — agents
  folder: html`
    <svg viewBox="0 0 24 24">
      <path d="M3 6h6l2 2h10v12H3V6z" fill="none" />
    </svg>
  `,

  // Loader — scheduler (rotating segments)
  loader: html`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" opacity="0.25" />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke-linecap="round" />
    </svg>
  `,

  // ── UI Icons ──

  menu: html`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="7" y2="7" />
      <line x1="4" x2="16" y1="12" y2="12" />
      <line x1="4" x2="20" y1="17" y2="17" />
    </svg>
  `,
  x: html`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,
  check: html`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,
  arrowDown: html`
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  `,
  copy: html`
    <svg viewBox="0 0 24 24">
      <rect x="8" y="8" width="12" height="12" rx="1.5" fill="none" />
      <path d="M4 16V5a1 1 0 0 1 1-1h11" fill="none" />
    </svg>
  `,
  search: html`
    <svg viewBox="0 0 24 24">
      <circle cx="10" cy="10" r="7" fill="none" />
      <line x1="15" x2="21" y1="15" y2="21" />
    </svg>
  `,
  brain: html`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="5" fill="none" />
      <path d="M7 13c-2 1-3 3-3 5h16c0-2-1-4-3-5" fill="none" />
      <line x1="12" x2="12" y1="13" y2="22" />
    </svg>
  `,
  book: html`
    <svg viewBox="0 0 24 24">
      <path d="M4 4h16v16H4V4z" fill="none" />
      <line x1="9" x2="9" y1="4" y2="20" />
    </svg>
  `,

  // Tool icons
  wrench: html`
    <svg viewBox="0 0 24 24">
      <path d="M14.7 6.3l3 3-8.4 8.4-4.2.6.6-4.2 8.4-8.4z" fill="none" />
      <path d="M17 3l4 4" />
    </svg>
  `,
  fileCode: html`
    <svg viewBox="0 0 24 24">
      <path d="M4 4h10l4 4v12H4V4z" fill="none" />
      <path d="m10 13-2 2 2 2" fill="none" />
      <path d="m14 13 2 2-2 2" fill="none" />
    </svg>
  `,
  edit: html`
    <svg viewBox="0 0 24 24">
      <path d="M16.5 3.5 20 7l-12 12H4v-4L16.5 3.5z" fill="none" />
    </svg>
  `,
  penLine: html`
    <svg viewBox="0 0 24 24">
      <path d="M16.5 3.5 20 7l-12 12H4v-4L16.5 3.5z" fill="none" />
      <line x1="4" x2="20" y1="22" y2="22" />
    </svg>
  `,
  paperclip: html`
    <svg viewBox="0 0 24 24">
      <path d="M12 3v14a3 3 0 0 1-6 0V6a1.5 1.5 0 0 1 3 0v10" fill="none" />
    </svg>
  `,
  image: html`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="1.5" fill="none" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="none" />
      <path d="m21 15-4-4-8 8" fill="none" />
    </svg>
  `,
  smartphone: html`
    <svg viewBox="0 0 24 24">
      <rect x="6" y="2" width="12" height="20" rx="2" fill="none" />
      <line x1="12" x2="12.01" y1="18" y2="18" stroke-width="2" stroke-linecap="round" />
    </svg>
  `,
  plug: html`
    <svg viewBox="0 0 24 24">
      <line x1="9" x2="9" y1="2" y2="7" />
      <line x1="15" x2="15" y1="2" y2="7" />
      <rect x="6" y="7" width="12" height="7" rx="1" fill="none" />
      <line x1="12" x2="12" y1="14" y2="22" />
    </svg>
  `,
  circle: html`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" /></svg>
  `,
  puzzle: html`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="8" height="8" rx="1" fill="none" />
      <rect x="13" y="3" width="8" height="8" rx="1" fill="none" />
      <rect x="3" y="13" width="8" height="8" rx="1" fill="none" />
      <rect x="13" y="13" width="8" height="8" rx="1" fill="none" />
    </svg>
  `,
} as const;

export type IconName = keyof typeof icons;

export function icon(name: IconName): TemplateResult {
  return icons[name];
}

export function renderIcon(name: IconName, className = "nav-item__icon"): TemplateResult {
  return html`<span class=${className} aria-hidden="true">${icons[name]}</span>`;
}

export function renderEmojiIcon(
  iconContent: string | TemplateResult,
  className: string,
): TemplateResult {
  return html`<span class=${className} aria-hidden="true">${iconContent}</span>`;
}

export function setEmojiIcon(target: HTMLElement | null, icon: string): void {
  if (!target) {
    return;
  }
  target.textContent = icon;
}
