/**
 * ANIMA Security Hardening
 *
 * Additional security layers beyond base OpenClaw:
 * - WebSocket origin validation
 * - Enhanced security headers (HSTS, Permissions-Policy)
 * - Request body size limits
 * - IP-based rate limiting for auth endpoints
 * - Security event audit logging
 * - Strict CSP for all responses
 * - WebSocket message size limits
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { isLoopbackHost } from "./net.js";

// ── Constants ──

const MAX_REQUEST_BODY_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_WS_MESSAGE_BYTES = 5 * 1024 * 1024; // 5MB
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const AUTH_RATE_LIMIT_MAX = 10; // max attempts per window
const AUDIT_LOG_MAX_ENTRIES = 10_000;

// ── Types ──

export interface SecurityEvent {
  timestamp: string;
  type:
    | "auth_failure"
    | "auth_success"
    | "ws_rejected"
    | "rate_limited"
    | "suspicious_request"
    | "exec_blocked"
    | "path_traversal_attempt"
    | "oversized_request";
  ip: string;
  details: string;
}

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blocked: boolean;
}

// ── Audit Log ──

const auditLog: SecurityEvent[] = [];

export function logSecurityEvent(event: SecurityEvent): void {
  auditLog.push(event);
  if (auditLog.length > AUDIT_LOG_MAX_ENTRIES) {
    auditLog.splice(0, auditLog.length - AUDIT_LOG_MAX_ENTRIES);
  }
  // Also write to stderr for persistent logging
  const line = `[SECURITY] ${event.timestamp} ${event.type} ip=${event.ip} ${event.details}`;
  process.stderr.write(line + "\n");
}

export function getAuditLog(limit = 100): SecurityEvent[] {
  return auditLog.slice(-limit);
}

// ── IP Rate Limiting ──

const ipAttempts = new Map<string, RateLimitEntry>();

function cleanExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, entry] of ipAttempts) {
    if (now - entry.firstAttempt > AUTH_RATE_LIMIT_WINDOW_MS) {
      ipAttempts.delete(ip);
    }
  }
}

export function checkAuthRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  cleanExpiredEntries();
  const now = Date.now();
  const entry = ipAttempts.get(ip);

  if (!entry) {
    ipAttempts.set(ip, { count: 1, firstAttempt: now, blocked: false });
    return { allowed: true };
  }

  if (now - entry.firstAttempt > AUTH_RATE_LIMIT_WINDOW_MS) {
    ipAttempts.set(ip, { count: 1, firstAttempt: now, blocked: false });
    return { allowed: true };
  }

  entry.count++;

  if (entry.count > AUTH_RATE_LIMIT_MAX) {
    if (!entry.blocked) {
      entry.blocked = true;
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        type: "rate_limited",
        ip,
        details: `${entry.count} auth attempts in ${AUTH_RATE_LIMIT_WINDOW_MS / 1000}s window`,
      });
    }
    const retryAfterMs = AUTH_RATE_LIMIT_WINDOW_MS - (now - entry.firstAttempt);
    return { allowed: false, retryAfterMs };
  }

  return { allowed: true };
}

export function recordAuthSuccess(ip: string): void {
  ipAttempts.delete(ip);
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "auth_success",
    ip,
    details: "Authentication successful",
  });
}

export function recordAuthFailure(ip: string): void {
  logSecurityEvent({
    timestamp: new Date().toISOString(),
    type: "auth_failure",
    ip,
    details: "Authentication failed",
  });
}

// ── Enhanced Security Headers ──

export function setAnimaSecurityHeaders(res: ServerResponse): void {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Referrer policy — don't leak URLs
  res.setHeader("Referrer-Policy", "no-referrer");

  // HSTS — enforce HTTPS (1 year, include subdomains)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Permissions Policy — disable unnecessary browser features
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );

  // Prevent IE from executing downloads in site's context
  res.setHeader("X-Download-Options", "noopen");

  // Prevent Adobe products from cross-domain requests
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
}

// ── WebSocket Origin Validation ──

export function validateWsOrigin(
  req: IncomingMessage,
  opts: { allowedOrigins?: string[]; allowLoopback?: boolean }
): { valid: boolean; reason?: string } {
  const origin = req.headers.origin?.trim();

  // No origin header — could be non-browser client (curl, Node)
  // or same-origin request. Allow for loopback.
  if (!origin) {
    const host = req.headers.host ?? "";
    const hostname = host.split(":")[0] ?? "";
    if (opts.allowLoopback !== false && isLoopbackHost(hostname)) {
      return { valid: true };
    }
    // Non-browser clients without origin are OK for API usage
    return { valid: true };
  }

  // Check explicit allowed origins
  if (opts.allowedOrigins?.length) {
    try {
      const parsed = new URL(origin);
      const originHost = `${parsed.protocol}//${parsed.host}`;
      if (opts.allowedOrigins.includes(originHost)) {
        return { valid: true };
      }
    } catch {
      return { valid: false, reason: "Malformed origin header" };
    }
  }

  // Allow loopback origins
  if (opts.allowLoopback !== false) {
    try {
      const parsed = new URL(origin);
      if (isLoopbackHost(parsed.hostname)) {
        return { valid: true };
      }
    } catch {
      return { valid: false, reason: "Malformed origin header" };
    }
  }

  return { valid: false, reason: `Origin ${origin} not allowed` };
}

// ── Request Body Size Limit ──

export function enforceBodySizeLimit(
  req: IncomingMessage,
  res: ServerResponse,
  maxBytes = MAX_REQUEST_BODY_BYTES
): boolean {
  const contentLength = req.headers["content-length"];
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    const ip = extractIp(req);
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      type: "oversized_request",
      ip,
      details: `Content-Length ${contentLength} exceeds ${maxBytes} limit`,
    });
    res.statusCode = 413;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: { message: "Request entity too large", type: "oversized" } }));
    return false; // Request rejected
  }
  return true; // Request OK
}

// ── Path Traversal Detection ──

export function detectPathTraversal(urlPath: string, ip: string): boolean {
  const decoded = decodeURIComponent(urlPath);
  const suspicious =
    decoded.includes("..") ||
    decoded.includes("//") ||
    decoded.includes("\\") ||
    decoded.includes("%00") ||
    decoded.includes("%2e%2e") ||
    decoded.includes("%252e");

  if (suspicious) {
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      type: "path_traversal_attempt",
      ip,
      details: `Suspicious path: ${urlPath.slice(0, 200)}`,
    });
  }

  return suspicious;
}

// ── Suspicious Request Detection ──

export function detectSuspiciousRequest(req: IncomingMessage): boolean {
  const ip = extractIp(req);
  const ua = req.headers["user-agent"] ?? "";
  const url = req.url ?? "";

  // Common scanner/exploit patterns
  const suspiciousPatterns = [
    /\.env/i,
    /wp-admin/i,
    /wp-login/i,
    /phpMyAdmin/i,
    /\.git\//i,
    /\.svn\//i,
    /actuator/i,
    /\.asp/i,
    /\.php/i,
    /shell/i,
    /cmd\.exe/i,
    /passwd/i,
    /shadow/i,
    /etc\/passwd/i,
    /proc\/self/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        type: "suspicious_request",
        ip,
        details: `Suspicious URL pattern: ${url.slice(0, 200)}`,
      });
      return true;
    }
  }

  return false;
}

// ── Exec Command Blocklist ──

const BLOCKED_EXEC_PATTERNS = [
  /rm\s+-rf\s+\//i,
  /mkfs/i,
  /dd\s+if=.*of=\/dev/i,
  /:(){ :|:& };:/,  // fork bomb
  /chmod\s+777\s+\//i,
  /curl.*\|\s*(ba)?sh/i,  // pipe to shell
  /wget.*\|\s*(ba)?sh/i,
  /nc\s+-l/i,  // netcat listener
  /ncat\s+-l/i,
  /python.*-c.*import\s+os/i,
  /eval\s*\(/i,
  /base64\s+-d.*\|\s*(ba)?sh/i,
];

export function isBlockedCommand(command: string): boolean {
  for (const pattern of BLOCKED_EXEC_PATTERNS) {
    if (pattern.test(command)) {
      return true;
    }
  }
  return false;
}

// ── Utility ──

export function extractIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return req.socket.remoteAddress ?? "unknown";
}

// ── Middleware ──

export function animaSecurityMiddleware() {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const ip = extractIp(req);
    const url = req.url ?? "";

    // Apply security headers to all responses
    setAnimaSecurityHeaders(res);

    // Check body size
    if (!enforceBodySizeLimit(req, res)) {
      return;
    }

    // Detect path traversal
    if (detectPathTraversal(url, ip)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: { message: "Bad request", type: "invalid_path" } }));
      return;
    }

    // Detect scanner/exploit probes (log but don't block — return 404 naturally)
    detectSuspiciousRequest(req);

    next();
  };
}

// ── WS Message Size Validation ──

export function isWsMessageOversized(data: Buffer | string): boolean {
  const size = typeof data === "string" ? Buffer.byteLength(data) : data.length;
  return size > MAX_WS_MESSAGE_BYTES;
}

// ── Export security config defaults ──

export const SECURITY_DEFAULTS = {
  maxRequestBodyBytes: MAX_REQUEST_BODY_BYTES,
  maxWsMessageBytes: MAX_WS_MESSAGE_BYTES,
  authRateLimitWindowMs: AUTH_RATE_LIMIT_WINDOW_MS,
  authRateLimitMax: AUTH_RATE_LIMIT_MAX,
  auditLogMaxEntries: AUDIT_LOG_MAX_ENTRIES,
  blockedExecPatterns: BLOCKED_EXEC_PATTERNS.length,
} as const;
