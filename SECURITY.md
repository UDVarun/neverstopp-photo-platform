# Security Policy

## Reporting a vulnerability
Please report security issues privately to the project maintainer before public disclosure.

## Security baseline
- Do not commit secrets, tokens, or database credentials.
- Keep all runtime secrets in environment variables.
- Use HTTPS in production.
- Restrict CORS origins to known frontend domains.
- Validate payment signatures on the server before granting paid access.

## Secret rotation
If any secret is exposed:
1. Rotate the secret immediately in the provider dashboard.
2. Invalidate old tokens/keys where possible.
3. Update deployment environment variables.
4. Audit logs for suspicious use.

## Recommended checks
- Run dependency scans regularly (`npm audit`).
- Add static analysis and lint checks in CI.
- Add auth and payment route integration tests.
