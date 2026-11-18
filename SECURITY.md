# Security

## Reporting a vulnerability

Email **support@clickrunclaw.com** with the subject line `security`. Include the affected route, a reproduction, and the impact you believe it has. You will get a written reply within one business day. Please do not open a public issue for an unpatched vulnerability.

## What this repository covers

The site is a marketing front end plus one write endpoint. The attack surface is deliberately small:

- `POST /api/lead` accepts a JSON brief, capped at 20 kB.
- A hidden honeypot field absorbs most automated submissions with a silent `200`.
- Per-IP sliding-window rate limiting, five submissions per ten minutes.
- All incoming fields are trimmed, length-limited and stripped of control characters before they reach an email template.
- CORS is restricted to `NEXT_PUBLIC_SITE_URL`; other origins receive no `Access-Control-Allow-Origin` header.
- Provider errors are logged, never returned to the client.
- `GET /api/lead` returns status only, with no configuration detail.

## Headers

`public/_headers` applies HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, a restrictive `Permissions-Policy`, `Referrer-Policy`, and a Content Security Policy that allows only self-hosted assets plus Google Analytics/tag manager.

## Data handling

- Lead data is transmitted to the configured provider (Resend, Brevo, Telegram or your webhook) and is not persisted in this application.
- Analytics is consent-gated: Google Analytics loads only after an explicit opt-in, and IP anonymisation is enabled.
- No secrets are committed. `.env*` is ignored except `.env.example`, which contains names only.
