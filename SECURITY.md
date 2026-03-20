# Security

This document explains the security vulnerabilities that were identified by GitHub Dependabot and fixed in this repository, along with guidance on what each issue was and how it was resolved.

---

## Fixed Vulnerabilities

### 1. Authentication Bypass by IP Spoofing — Hono AWS Lambda ALB

| Field | Detail |
|---|---|
| **Package** | `hono` |
| **Affected versions** | `>= 4.12.0`, `< 4.12.2` |
| **Severity** | High |
| **Fixed in** | `4.12.2` |

#### What is it?

When Hono is deployed behind an **AWS Application Load Balancer (ALB)**, the framework exposes a `conninfo` helper that reports the connecting client's IP address. The ALB sends the real client IP via a special HTTP header (`X-Forwarded-For`). Hono was reading this header to determine where a request came from.

The vulnerability was that an **attacker could forge this header**. Because the ALB appends (not replaces) the `X-Forwarded-For` header when it proxies a request, a malicious client could send a fake value in that header before the ALB adds the real one. If Hono read the _first_ value instead of the _last_ (real) one, it would use the attacker's fake IP address as the client's real IP.

#### How could it be exploited?

Suppose this application has **IP-based access control** — for example, a landlord admin panel that only allows requests from a specific office IP address, or a rate limiter that tracks requests per IP. An attacker who knows the allowed IP address could:

1. Send a request with a forged header: `X-Forwarded-For: <allowed-ip-address>`
2. Hono would read the forged value and treat the request as coming from the trusted IP
3. The attacker bypasses the IP-based check entirely, even though they are actually connecting from somewhere else

#### What was fixed?

The Hono team corrected how `conninfo` reads the `X-Forwarded-For` chain when running behind an AWS ALB. The fix ensures the **last (ALB-appended) value** is used as the authoritative client IP rather than the first (potentially attacker-controlled) value.

---

### 2. Arbitrary File Read via `serveStatic` — Path Traversal

| Field | Detail |
|---|---|
| **Package** | `hono` |
| **Affected versions** | `< 4.12.4` |
| **Severity** | High |
| **Fixed in** | `4.12.4` |

#### What is it?

Hono provides a `serveStatic` middleware that serves static files (images, CSS, JavaScript, etc.) from a directory on the server. For example, if you configure it to serve files from `/public`, a request to `/public/logo.png` would return that file.

The vulnerability was a **path traversal** (also called a **directory traversal**) attack. When Hono resolved the requested file path, it did not fully sanitize sequences like `../` (which means "go up one folder"). An attacker could craft a URL that walks out of the intended `/public` directory and read any file accessible to the web server process.

#### How could it be exploited?

Given a `serveStatic` setup serving files from `/public`, an attacker could send a request like:

```
GET /public/../../../../etc/passwd
```

or, URL-encoded:

```
GET /public/%2e%2e%2f%2e%2e%2fetc%2fpasswd
```

If Hono did not strip the `../` sequences before opening the file, it would resolve the path to `/etc/passwd` (the Unix user account file) and send its contents back to the attacker. In a Node.js deployment like this one, this could expose:

- **Environment variable files** (`.env`) containing database passwords, API keys, and secrets
- **Application source code** and internal business logic
- **System files** that reveal the server's configuration

This is particularly severe because this project stores sensitive credentials (database connection strings, authentication secrets, Cloudinary keys) in `.env` files.

#### What was fixed?

The Hono team added proper path sanitization in `serveStatic`. The middleware now normalises the request path and rejects (or neutralises) any `../` traversal sequences before resolving it to a file on disk, ensuring requests can only access files within the designated static directory.

---

## What We Did to Fix It

Both vulnerabilities were resolved by upgrading `hono` from version `4.12.1` to `4.12.8` in `pnpm-workspace.yaml`:

```diff
- hono: ^4.8.2
+ hono: ^4.12.8
```

Version `4.12.8` is the latest `4.12.x` release and includes the patches for both CVEs. No application code changes were required — updating the dependency was sufficient.

---

## Staying Secure Going Forward

- **GitHub Dependabot** is enabled on this repository and will automatically open pull requests when new vulnerabilities are discovered in dependencies.
- Review and merge Dependabot PRs promptly, especially those rated **High** or **Critical**.
- Run `pnpm audit` regularly during development to catch issues before they reach production.
- Never trust HTTP headers (like `X-Forwarded-For`) directly — always validate them through your framework's supported proxy-aware APIs.
- Never serve static files from a directory that contains `.env` files or source code; keep the static root isolated.
